"use client";

import { useState } from "react";
import { useKnowledge } from "@/hooks/useKnowledge";
import { Plus, Trash2, Loader2, BookOpen, ChevronDown, ChevronRight, X } from "lucide-react";

interface KnowledgeSidebarProps {
  documentId: string;
}

export function KnowledgeSidebar({ documentId }: KnowledgeSidebarProps) {
  const { knowledgeItems, loading, addKnowledge, deleteKnowledge } = useKnowledge(documentId);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    const { error } = await addKnowledge(newTitle, newContent);
    setIsSubmitting(false);

    if (!error) {
      setNewTitle("");
      setNewContent("");
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this knowledge item?")) {
      await deleteKnowledge(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/30">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Knowledge Base</h2>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAdding && (
          <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm animate-fade-in-up">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-semibold text-foreground">Add Knowledge</h3>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Title (e.g., Target Audience)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
              required
            />
            <textarea
              placeholder="Paste relevant information, links, or context here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors min-h-[120px] resize-y"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                className="flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                Save
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm p-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-border/50 rounded animate-pulse shrink-0" />
                  <div className="h-4 bg-border/50 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : knowledgeItems.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-card/30 mt-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">No knowledge base</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">
              Add context, facts, or instructions to help the AI write better.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-blue-500 transition-colors w-full shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Knowledge
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {knowledgeItems.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all hover:border-blue-500/30">
                  <div 
                    className="p-3 flex items-center justify-between cursor-pointer select-none bg-card hover:bg-muted/30 transition-colors"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <h4 className="text-sm font-medium text-foreground truncate">{item.title}</h4>
                    </div>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-border/50 bg-background/50">
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap mt-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}