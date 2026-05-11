"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-xl">
        <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-white mb-3">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. We've been notified and are looking into it.
        </p>
        <div className="bg-background/50 border border-border rounded-xl p-4 mb-8 text-left overflow-auto max-h-32">
          <p className="text-sm font-mono text-red-400 break-all">
            {error.message || "Unknown error"}
          </p>
        </div>
        <button
          onClick={reset}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}