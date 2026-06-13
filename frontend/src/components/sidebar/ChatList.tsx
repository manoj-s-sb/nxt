"use client";

import { useConversationsStore } from "@/store/conversationsStore";

import { ConversationItem } from "./ConversationItem";

export function ChatList() {
  const conversations = useConversationsStore((s) => s.conversations);
  const loading = useConversationsStore((s) => s.loading);
  const hasLoaded = useConversationsStore((s) => s.hasLoaded);
  const error = useConversationsStore((s) => s.error);

  if (loading && !hasLoaded) {
    return (
      <p className="px-3 font-mono text-[11px] text-inkFaint flex items-center gap-2">
        <span className="inline-block w-1 h-1 rounded-full bg-accent breathe" />
        gathering threads…
      </p>
    );
  }

  if (error) {
    return (
      <p className="px-3 font-mono text-[11px] text-danger leading-relaxed">
        {error}
      </p>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="px-3 font-serif italic text-[15px] leading-relaxed text-inkFaint">
        no threads yet. weave one above.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {conversations.map((c) => (
        <ConversationItem key={c.id} conversation={c} />
      ))}
    </ul>
  );
}

export default ChatList;
