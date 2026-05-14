import { createGroq } from "@ai-sdk/groq";
import { APICallError, LoadAPIKeyError, streamText, type ModelMessage } from "ai";
import { createClient } from "@/lib/supabase/server";

/** Vercel / serverless: allow time for Groq streaming. */
export const maxDuration = 60;

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function toModelMessages(raw: unknown): ModelMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ModelMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || !content.trim()) continue;
    out.push({ role, content });
  }
  return out;
}

function retryAfterFromHeaders(headers?: Record<string, string>): number | undefined {
  const raw = headers?.["retry-after"] ?? headers?.["Retry-After"];
  if (raw == null) return undefined;
  const n = Number.parseInt(String(raw), 10);
  if (Number.isFinite(n) && n > 0) return Math.max(1, n);
  return undefined;
}

function isLikelyDailyQuota(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    /\bper[- ]?day\b/.test(lower) ||
    lower.includes("daily limit") ||
    lower.includes("daily quota")
  );
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized. Please sign in to use AI features." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "AI is not configured: set GROQ_API_KEY in your environment (see .env.example). Create a key at https://console.groq.com/keys",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, documentContent, knowledge } = await req.json();

    const knowledgeText =
      knowledge
        ?.map((k: { title?: string; content?: string }) => `Title: ${k.title ?? ""}\nContent: ${k.content ?? ""}`)
        .join("\n\n---\n\n") || "No knowledge provided.";

    const systemPrompt = `You are an expert writing assistant for a document editor. 
Your goal is to help the user write, edit, and improve their document.

CURRENT DOCUMENT CONTENT:
"""
${documentContent || "The document is currently empty."}
"""

PROVIDED KNOWLEDGE SOURCES:
"""
${knowledgeText}
"""

INSTRUCTIONS:
1. Always base your suggestions and writing on the provided knowledge sources if relevant.
2. If the user asks you to draft something, write clearly and concisely.
3. You can format your responses using markdown.
4. Be helpful, professional, and directly address the user's prompt.
5. When you revise, correct, or fix wording that already appears in CURRENT DOCUMENT CONTENT, put any explanation or markdown *first*, then end your entire reply with **exactly one final line** and nothing after it:
SCRIBE_REPLACE:{"find":"...verbatim substring from the document...","replace":"...corrected text..."}
   Use straight ASCII double quotes in the JSON (do not use placeholder angle brackets—paste the real strings). Escape any double-quote characters inside find/replace as backslash-doublequote in JSON. The "find" value must match the document text exactly (including punctuation and spacing). If you are only adding new content and not replacing existing document text, omit the SCRIBE_REPLACE line entirely.`;

    const modelId = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;

    const chatMessages = toModelMessages(messages);
    if (chatMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages in request." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqProvider = createGroq({ apiKey });

    const result = streamText({
      model: groqProvider(modelId),
      system: systemPrompt,
      messages: chatMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            if (chunk) controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("Error in AI chat route:", error);

    let message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";
    let status = 500;
    let isDailyQuota = false;
    let retryAfterSeconds: number | undefined;

    if (APICallError.isInstance(error)) {
      message = error.message || message;
      if (typeof error.statusCode === "number") status = error.statusCode;
      retryAfterSeconds = retryAfterFromHeaders(error.responseHeaders);
      const body =
        typeof error.responseBody === "string"
          ? error.responseBody
          : error.responseBody != null
            ? JSON.stringify(error.responseBody)
            : "";
      if (body && !message.includes(body.slice(0, 80))) {
        try {
          const parsed = JSON.parse(body) as { error?: { message?: string } };
          const inner = parsed?.error?.message;
          if (typeof inner === "string" && inner) message = inner;
        } catch {
          /* keep APICallError.message */
        }
      }
    }

    const is429 = status === 429;

    if (is429) {
      if (retryAfterSeconds == null) {
        const m = message.match(/retry(?:\s+after)?[:\s]+(\d+)\s*s/i) || message.match(/in\s+(\d+)\s*seconds?/i);
        if (m) {
          const n = Number.parseInt(m[1], 10);
          if (Number.isFinite(n) && n > 0) retryAfterSeconds = n;
        }
      }
      isDailyQuota = isLikelyDailyQuota(message);
    }

    let userMessage: string;

    if (LoadAPIKeyError.isInstance(error)) {
      userMessage =
        "Groq API key is missing or invalid. Check GROQ_API_KEY and create a key at https://console.groq.com/keys";
      status = 500;
    } else if (is429) {
      if (isDailyQuota) {
        userMessage =
          "Daily or account-level rate limit reached for the Groq API. Check your usage and limits in the Groq console, or wait and try again.";
      } else if (retryAfterSeconds != null) {
        userMessage = `Rate limit reached. Try again in about ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}.`;
      } else {
        userMessage =
          "Rate limit exceeded for the Groq API. Wait briefly and try again, or review limits at Groq documentation.";
      }
    } else {
      userMessage = message;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (retryAfterSeconds != null) headers["Retry-After"] = String(retryAfterSeconds);

    return new Response(
      JSON.stringify({
        error: userMessage,
        rateLimited: status === 429,
        isDailyQuota,
        retryAfterSeconds: retryAfterSeconds ?? null,
      }),
      { status: status >= 400 && status < 600 ? status : 500, headers }
    );
  }
}
