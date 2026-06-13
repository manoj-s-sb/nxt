export interface ChatSendPayload {
  message: string;
}

export interface ChatStreamChunk {
  token?: string;
  done?: boolean;
}
