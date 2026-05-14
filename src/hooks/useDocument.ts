import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface DocumentData {
  id: string;
  title: string;
  content: unknown;
  updated_at: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useDocument(id: string) {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const supabase = createClient();

  // Browser Supabase client is a singleton; depend only on `id` so typing / autosave re-renders do not refetch.
  useEffect(() => {
    let isMounted = true;

    async function loadDocument() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (isMounted && data) {
          setDocument(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Error loading document:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) {
      loadDocument();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const saveDocument = useCallback(
    async (newTitle: string, newContent: unknown) => {
      if (!id) return;
      
      setSaveStatus("saving");
      
      try {
        const { error } = await supabase
          .from("documents")
          .update({
            title: newTitle,
            content: newContent,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);

        if (error) throw error;
        
        setDocument((prev) => 
          prev ? { ...prev, title: newTitle, content: newContent } : null
        );
        setSaveStatus("saved");
        
        // Reset saved status to idle after a bit
        setTimeout(() => {
          setSaveStatus((current) => current === "saved" ? "idle" : current);
        }, 2000);
        
      } catch (err) {
        console.error("Error saving document:", err);
        setSaveStatus("error");
      }
    },
    [id]
  );

  return { document, loading, error, saveDocument, saveStatus, setSaveStatus };
}