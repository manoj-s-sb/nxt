"use client";

import clsx from "clsx";

import type { Message } from "@/api/conversations";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <article
      className={clsx(
        "flex flex-col gap-2",
        isUser ? "items-end text-right" : "items-start",
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
        {isUser ? "you" : "loom"}
      </span>
      <p
        className={clsx(
          "max-w-[88%] font-serif text-lg leading-relaxed whitespace-pre-wrap",
          isUser ? "text-ink" : "text-inkDim",
        )}
      >
        {message.content}
      </p>
    </article>
  );
}

export default MessageBubble;
