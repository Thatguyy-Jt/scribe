"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteDocument } from "@/app/(protected)/dashboard/actions";

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the document
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      startTransition(() => {
        deleteDocument(documentId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete document"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
