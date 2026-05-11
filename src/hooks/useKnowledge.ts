import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface KnowledgeItem {
  id: string;
  document_id: string;
  title: string;
  content: string;
  created_at: string;
}

export function useKnowledge(documentId: string) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchKnowledge = useCallback(async () => {
    if (!documentId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("knowledge")
        .select("*")
        .eq("document_id", documentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKnowledgeItems(data || []);
    } catch (err: any) {
      console.error("Error fetching knowledge:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [documentId, supabase]);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  const addKnowledge = async (title: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("knowledge")
        .insert([
          {
            document_id: documentId,
            user_id: user.id,
            title,
            content,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setKnowledgeItems(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      console.error("Error adding knowledge:", err);
      return { data: null, error: err };
    }
  };

  const deleteKnowledge = async (id: string) => {
    try {
      const { error } = await supabase
        .from("knowledge")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setKnowledgeItems(prev => prev.filter(item => item.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error("Error deleting knowledge:", err);
      return { error: err };
    }
  };

  return {
    knowledgeItems,
    loading,
    error,
    addKnowledge,
    deleteKnowledge,
    refreshKnowledge: fetchKnowledge
  };
}