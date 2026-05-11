"use client";

import { useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createDocument } from "@/app/(protected)/dashboard/actions";

export function CreateDocumentButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => createDocument())}
      disabled={isPending}
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      New Document
    </button>
  );
}