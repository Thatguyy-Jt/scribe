import Link from "next/link";
import { FileText, Clock } from "lucide-react";
import { DeleteDocumentButton } from "./DeleteDocumentButton";

interface DocumentData {
  id: string;
  title: string;
  updated_at: string;
  content: unknown;
}

function collectTipTapPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  let out = "";
  if (typeof n.text === "string") out += n.text;
  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      out += collectTipTapPlainText(child);
      out += " ";
    }
  }
  return out;
}

function extractTextSnippet(content: unknown): string {
  const doc = content as { type?: string; content?: unknown[] } | null;
  if (!doc || doc.type !== "doc" || !Array.isArray(doc.content)) {
    return "Empty document...";
  }

  try {
    const text = collectTipTapPlainText({ type: "doc", content: doc.content })
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "Empty document...";
    return text.length > 100 ? `${text.slice(0, 100)}...` : text;
  } catch (e) {
    console.error("Error parsing document content snippet", e);
    return "Empty document...";
  }
}

export function DocumentCard({ document }: { document: DocumentData }) {
  const date = new Date(document.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const snippet = extractTextSnippet(document.content);

  return (
    <Link 
      href={`/documents/${document.id}`}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md hover:-translate-y-1 relative"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <FileText className="h-5 w-5" />
          </div>
          <div className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteDocumentButton documentId={document.id} />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground font-serif line-clamp-1">
          {document.title}
        </h3>
        <p className="mb-6 text-sm text-muted-foreground line-clamp-3">
          {snippet}
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
        <Clock className="h-3.5 w-3.5" />
        <span>Edited {date}</span>
      </div>
    </Link>
  );
}