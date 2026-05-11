import Link from "next/link";
import { FileText, Clock } from "lucide-react";

interface DocumentData {
  id: string;
  title: string;
  updated_at: string;
  content: any; // We can parse jsonb to get a snippet
}

function extractTextSnippet(content: any): string {
  if (!content || !content.content) return "Empty document...";
  
  // Simple extraction of the first text node we find
  let text = "";
  try {
    for (const node of content.content) {
      if (node.type === "paragraph" && node.content && node.content[0]?.text) {
        text += node.content[0].text + " ";
        if (text.length > 100) break;
      }
    }
  } catch (e) {
    console.error("Error parsing document content snippet", e);
  }
  
  return text.trim() ? text.trim().slice(0, 100) + (text.length > 100 ? "..." : "") : "Empty document...";
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
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md hover:-translate-y-1"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <FileText className="h-5 w-5" />
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