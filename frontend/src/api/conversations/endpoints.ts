import { api, extractErrorMessage } from "@/lib/api";

import type {
  Conversation,
  ConversationDetail,
  CreateConversationPayload,
  UpdateConversationPayload,
} from "./types";

const BASE = "/api/v1/conversations";

export async function listConversations(): Promise<Conversation[]> {
  try {
    const { data } = await api.get<Conversation[]>(BASE);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "could not load conversations"));
  }
}

export async function createConversation(
  payload: CreateConversationPayload = {},
): Promise<Conversation> {
  try {
    const { data } = await api.post<Conversation>(BASE, payload);
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "could not start a new thread"));
  }
}

export async function getConversation(
  conversationId: string,
): Promise<ConversationDetail> {
  try {
    const { data } = await api.get<ConversationDetail>(
      `${BASE}/${conversationId}`,
    );
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "could not open conversation"));
  }
}

export async function renameConversation(
  conversationId: string,
  payload: UpdateConversationPayload,
): Promise<Conversation> {
  try {
    const { data } = await api.patch<Conversation>(
      `${BASE}/${conversationId}`,
      payload,
    );
    return data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "could not rename conversation"));
  }
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  try {
    await api.delete(`${BASE}/${conversationId}`);
  } catch (err) {
    throw new Error(extractErrorMessage(err, "could not delete conversation"));
  }
}
