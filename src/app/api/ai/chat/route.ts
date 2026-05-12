import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
const genAI = new GoogleGenerativeAI(apiKey!);

interface RateLimitInfo {
  retryAfterSeconds?: number;
  isDailyQuota: boolean;
}

function collectQuotaViolations(details: unknown[]): unknown[] {
  const out: unknown[] = [];
  for (const d of details) {
    if (!d || typeof d !== "object") continue;
    if ("violations" in d) {
      const violations = (d as { violations?: unknown[] }).violations;
      if (Array.isArray(violations)) out.push(...violations);
    }
  }
  return out;
}

function violationQuotaId(v: unknown): string {
  if (!v || typeof v !== "object") return "";
  const o = v as { quotaId?: string; quotaMetric?: string };
  return String(o.quotaId || o.quotaMetric || "");
}

/** Parse rate limit details from @google/generative-ai errors. */
function parseRateLimitInfo(error: unknown): RateLimitInfo {
  const result: RateLimitInfo = { isDailyQuota: false };
  if (!error || typeof error !== "object") return result;

  const e = error as {
    message?: string;
    errorDetails?: unknown[];
    status?: number;
    cause?: unknown;
  };
  const detailArrays: unknown[] = [];
  if (Array.isArray(e.errorDetails)) detailArrays.push(...e.errorDetails);

  // Some environments nest cause
  if (e.cause && typeof e.cause === "object") {
    const c = e.cause as { errorDetails?: unknown[] };
    if (Array.isArray(c.errorDetails)) detailArrays.push(...c.errorDetails);
  }

  const violations = collectQuotaViolations(detailArrays);

  for (const d of detailArrays) {
    if (!d || typeof d !== "object") continue;
    if ("retryDelay" in d) {
      const rd = (d as { retryDelay?: string }).retryDelay;
      if (typeof rd === "string") {
        const m = rd.match(/^(\d+(?:\.\d+)?)s$/);
        if (m) {
          const n = Number.parseFloat(m[1]);
          if (Number.isFinite(n) && n > 0) {
            result.retryAfterSeconds = Math.max(1, Math.ceil(n));
          }
        }
      }
    }
  }

  const msg = typeof e.message === "string" ? e.message : "";
  const msgLower = msg.toLowerCase();

  let hitsPerMinute = false;
  let hitsPerDay = false;

  for (const v of violations) {
    const qid = violationQuotaId(v).toLowerCase();
    if (
      qid.includes("perminute") ||
      qid.includes("per_minute") ||
      qid.includes("persecond") ||
      qid.includes("per_second")
    ) {
      hitsPerMinute = true;
    }
    if (qid.includes("perday") || qid.includes("per_day")) {
      hitsPerDay = true;
    }
  }

  // Google may stringify all details into message — prefer explicit violation types
  if (violations.length === 0) {
    if (/\bper[- ]?minute\b|rpm\b|requests per minute/i.test(msg)) hitsPerMinute = true;
    if (/\bper[- ]?day\b|requests per day|daily quota/i.test(msg)) hitsPerDay = true;
  }

  // Per-minute / burst limits are often mislabeled as "daily" if we only grep "day" in JSON
  if (hitsPerMinute) {
    result.isDailyQuota = false;
  } else if (hitsPerDay) {
    result.isDailyQuota = true;
  } else if (
    msgLower.includes("perday") ||
    /\bper[- ]?day\b/i.test(msg)
  ) {
    // Last resort: avoid matching generic "per day" in unrelated text
    if (!msgLower.includes("perminute") && !msgLower.includes("per minute")) {
      result.isDailyQuota = true;
    }
  }

  if (result.retryAfterSeconds == null) {
    const match = msg.match(/Please retry in ([\d.]+)\s*s/i);
    if (match) {
      const n = Number.parseFloat(match[1]);
      if (Number.isFinite(n) && n > 0) {
        result.retryAfterSeconds = Math.max(1, Math.ceil(n));
      }
    }
  }

  // If Google sends Retry-After-style hint, treat as short window unless clearly daily
  if (result.retryAfterSeconds != null && result.retryAfterSeconds <= 120 && !hitsPerDay) {
    result.isDailyQuota = false;
  }

  return result;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized. Please sign in to use AI features." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, documentContent, knowledge } = await req.json();

    const knowledgeText = knowledge
      ?.map((k: any) => `Title: ${k.title}\nContent: ${k.content}`)
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
4. Be helpful, professional, and directly address the user's prompt.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: { role: "user", parts: [{ text: systemPrompt }] },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessageStream(lastMessage);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
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
  } catch (error: any) {
    console.error("Error in AI chat route:", error);

    const message = error?.message || "Unknown error";
    const is429 =
      error?.status === 429 ||
      message.includes("429") ||
      message.includes("Too Many Requests") ||
      message.toLowerCase().includes("quota exceeded");
    const status = is429 ? 429 : 500;

    let userMessage: string;
    let isDailyQuota = false;
    let retryAfterSeconds: number | undefined;

    if (is429) {
      const info = parseRateLimitInfo(error);
      isDailyQuota = info.isDailyQuota;
      retryAfterSeconds = info.retryAfterSeconds;

      if (isDailyQuota) {
        userMessage =
          "Daily API quota for this model was hit (free tier is limited per day per API key / project). Quotas reset around midnight Pacific Time. If you barely used the app today, your Gemini API key is usually shared—e.g. the same key on Vercel and on your PC, or another project using that key. Create a fresh key in Google AI Studio, set it in Vercel (and .env.local), and check usage in the AI Studio / Google Cloud console.";
      } else if (retryAfterSeconds != null) {
        userMessage = `Rate limit reached. Try again in about ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}.`;
      } else {
        userMessage =
          "Rate limit exceeded for the Gemini API. Wait a few minutes and try again.";
      }
    } else {
      userMessage = message;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (retryAfterSeconds != null) {
      headers["Retry-After"] = String(retryAfterSeconds);
    }

    return new Response(
      JSON.stringify({
        error: userMessage,
        rateLimited: status === 429,
        isDailyQuota,
        retryAfterSeconds: retryAfterSeconds ?? null,
      }),
      { status, headers }
    );
  }
}