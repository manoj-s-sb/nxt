"use client";

import { create } from "zustand";

import {
  createConversation,
  deleteConversation,
  listConversations,
  renameConversation,
  type Conversation,
} from "@/api/conversations";

interface ConversationsState {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;

  refresh: () => Promise<void>;
  create: (title?: string) => Promise<Conversation>;
  rename: (id: string, title: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reset: () => void;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  loading: false,
  error: null,
  hasLoaded: false,

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const list = await listConversations();
      set({ conversations: list, loading: false, hasLoaded: true });
    } catch (err) {
      set({
        loading: false,
        hasLoaded: true,
        error: err instanceof Error ? err.message : "failed to load",
      });
    }
  },

  create: async (title) => {
    const convo = await createConversation({ title });
    set((s) => ({ conversations: [convo, ...s.conversations] }));
    return convo;
  },

  rename: async (id, title) => {
    const updated = await renameConversation(id, { title });
    set((s) => ({
      conversations: [updated, ...s.conversations.filter((c) => c.id !== id)],
    }));
  },

  remove: async (id) => {
    await deleteConversation(id);
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
    }));
  },

  reset: () => set({ conversations: [], hasLoaded: false, error: null }),
}));
