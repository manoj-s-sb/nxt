"use client";

import type { Conversation } from "@/api/conversations";
import { formatDate } from "@/utils/formatDate";

export function ChatHeader({ conversation }: { conversation: Conversation }) {
  return (
    <header className="relative z-10 px-10 py-6 border-b border-edge bg-canvas">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          {"// thread"}
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink leading-tight">
          {conversation.title}
        </h1>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          opened · {formatDate(conversation.created_at)}
        </p>
      </div>
    </header>
  );
}

export default ChatHeader;
