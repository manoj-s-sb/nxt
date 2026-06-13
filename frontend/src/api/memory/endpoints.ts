/**
 * Memory endpoints — list, semantic search, clear.
 * To be implemented in Phase 5 (long-term memory).
 */

import type { MemoryItem, MemorySearchQuery } from "./types";

export async function listMemories(): Promise<MemoryItem[]> {
  throw new Error("listMemories: not yet implemented");
}

export async function searchMemories(
  query: MemorySearchQuery,
): Promise<MemoryItem[]> {
  void query;
  throw new Error("searchMemories: not yet implemented");
}

export async function clearMemories(): Promise<void> {
  throw new Error("clearMemories: not yet implemented");
}
