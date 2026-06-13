"use client";

import type { Message } from "@/api/conversations";

import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: Message[];
}

export function ChatWindow({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <div className="relative flex-1 flex items-center justify-center px-10 overflow-hidden">
        <div className="ambient-bloom opacity-30" aria-hidden />
        <div className="grain" aria-hidden />
        <div className="relative z-10 max-w-md text-center space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
            chapter — blank
          </p>
          <p className="font-serif italic text-2xl text-inkDim leading-relaxed">
            the room is quiet.
            <br />
            say something to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-y-auto px-10 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;
