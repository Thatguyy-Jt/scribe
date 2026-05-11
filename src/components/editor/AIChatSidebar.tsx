"use client";

import { useState, useRef, useEffect } from "react";
import { useKnowledge } from "@/hooks/useKnowledge";
import { Editor } from "@tiptap/react";
import { Send, Sparkles, ArrowLeftFromLine, Loader2 } from "lucide-react";

interface AIChatSidebarProps {
  documentId: string;
  editor: Editor | null;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AIChatSidebar({ documentId, editor }: AIChatSidebarProps) {
  const { knowledgeItems } = useKnowledge(documentId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; rateLimited: boolean; isDailyQuota: boolean } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const insertIntoDocument = (text: string) => {
    if (editor) {
      editor.commands.insertContent(`\n\n${text}\n\n`);
      editor.commands.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          documentContent: editor ? editor.getText() : "",
          knowledge: knowledgeItems,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({} as { error?: string; rateLimited?: boolean; isDailyQuota?: boolean }));
        const rateLimited = errData.rateLimited === true || res.status === 429;
        const isDailyQuota = errData.isDailyQuota === true;
        const msg =
          errData.error || `Request failed with status ${res.status}`;
        throw Object.assign(new Error(msg), { rateLimited, isDailyQuota });
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const assistantId = (Date.now() + 1).toString();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };
      setMessages(prev => [...prev, assistantMessage]);

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: fullText } : m)
        );
      }
    } catch (err: any) {
      console.error("AI Chat error:", err);
      const rateLimited = err?.rateLimited === true;
      const isDailyQuota = err?.isDailyQuota === true;
      setError({
        message: err?.message || "Something went wrong",
        rateLimited,
        isDailyQuota,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Scribe AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              error.isDailyQuota
                ? "bg-orange-500/10 border-orange-500/25 text-orange-200"
                : error.rateLimited
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-200"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <p className="font-medium">
              {error.isDailyQuota
                ? "Daily quota exhausted"
                : error.rateLimited
                  ? "Temporary limit"
                  : "Error"}
            </p>
            <p className="mt-1 leading-relaxed">{error.message}</p>
            {error.rateLimited && (
              <a
                href="https://ai.google.dev/gemini-api/docs/rate-limits"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-amber-400/90 underline underline-offset-2 hover:text-amber-300"
              >
                View Gemini API rate limits &amp; quotas
              </a>
            )}
          </div>
        )}
        {messages.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-card/30 mt-4">
            <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              I can help you draft sections, summarize notes, or brainstorm ideas based on your knowledge base.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              </div>
              
              {message.role === "assistant" && message.content && !isLoading && (
                <button
                  onClick={() => insertIntoDocument(message.content)}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors pl-1"
                >
                  <ArrowLeftFromLine className="h-3 w-3" />
                  Insert into document
                </button>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm pl-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-background/50">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to write something..."
            className="w-full rounded-xl border border-border bg-card pr-10 pl-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}