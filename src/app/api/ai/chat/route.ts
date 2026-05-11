import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
const genAI = new GoogleGenerativeAI(apiKey!);

interface RateLimitInfo {
  retryAfterSeconds?: number;
  isDailyQuota: boolean;
}

/** Parse rate limit details from @google/generative-ai errors. */
function parseRateLimitInfo(error: unknown): RateLimitInfo {
  const result: RateLimitInfo = { isDailyQuota: false };
  if (!error || typeof error !== "object") return result;

  const e = error as { message?: string; errorDetails?: unknown[] };
  const details = e.errorDetails;

  if (Array.isArray(details)) {
    for (const d of details) {
      if (!d || typeof d !== "object") continue;

      // Check QuotaFailure violations for daily vs per-minute
      if ("violations" in d) {
        const violations = (d as { violations?: unknown[] }).violations;
        if (Array.isArray(violations)) {
          for (const v of violations) {
            if (v && typeof v === "object" && "quotaId" in v) {
              const qid = String((v as { quotaId: string }).quotaId);
              if (qid.includes("PerDay")) {
                result.isDailyQuota = true;
              }
            }
          }
        }
      }

      // Parse RetryInfo delay
      if ("retryDelay" in d) {
        const rd = (d as { retryDelay?: string }).retryDelay;
        if (typeof rd === "string") {
          const m = rd.match(/^(\d+(?:\.\d+)?)s$/);
          if (m) {
            const n = Number.parseFloat(m[1]);
            if (Number.isFinite(n) && n > 0) result.retryAfterSeconds = Math.max(1, Math.ceil(n));
          }
        }
      }
    }
  }

  // Fallback: parse from message text
  const msg = typeof e.message === "string" ? e.message : "";
  if (!result.isDailyQuota && msg.includes("PerDay")) {
    result.isDailyQuota = true;
  }
  if (result.retryAfterSeconds == null) {
    const match = msg.match(/Please retry in ([\d.]+)\s*s/i);
    if (match) {
      const n = Number.parseFloat(match[1]);
      if (Number.isFinite(n) && n > 0) result.retryAfterSeconds = Math.max(1, Math.ceil(n));
    }
  }

  return result;
}

export async function POST(req: Request) {
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
          "Daily API quota exceeded. The free tier allows 1,500 requests per day. The quota resets at midnight Pacific Time (8 AM WAT).";
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