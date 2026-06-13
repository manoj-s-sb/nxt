export interface MemoryItem {
  id: string;
  content: string;
  source_conversation_id?: string;
  created_at: string;
}

export interface MemorySearchQuery {
  q: string;
  limit?: number;
}
