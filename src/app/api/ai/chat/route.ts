import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
const genAI = new GoogleGenerativeAI(apiKey!);

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

    const message = error.message || "Unknown error";
    const status = message.includes("429") || message.includes("Too Many Requests")
      ? 429
      : 500;
    const userMessage = status === 429
      ? "Rate limit reached. Please wait a minute and try again."
      : message;

    return new Response(JSON.stringify({ error: userMessage }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}