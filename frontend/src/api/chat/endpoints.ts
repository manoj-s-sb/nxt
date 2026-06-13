/**
 * Chat endpoints — streaming Gemini responses via Server-Sent Events.
 *
 * Note: SSE uses the native `fetch` API (not axios) because axios
 * does not handle streaming bodies well in browsers.
 *
 * To be implemented in Phase 3 (Gemini integration).
 */

import type { ChatSendPayload, ChatStreamChunk } from "./types";

export async function streamChatMessage(
  conversationId: string,
  payload: ChatSendPayload,
  onChunk: (chunk: ChatStreamChunk) => void,
): Promise<void> {
  void conversationId;
  void payload;
  void onChunk;
  throw new Error("streamChatMessage: not yet implemented");
}
