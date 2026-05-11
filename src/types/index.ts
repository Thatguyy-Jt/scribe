export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeItem {
  id: string;
  document_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
