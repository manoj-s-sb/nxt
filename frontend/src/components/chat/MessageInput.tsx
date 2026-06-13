"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import clsx from "clsx";

interface Props {
  conversationId: string;
}

export function MessageInput({ conversationId }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue("");
    textareaRef.current?.focus();
  }, [conversationId]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Reserved for Phase 3 — Gemini streaming.
    }
  }

  return (
    <footer className="relative z-10 border-t border-edge bg-canvas px-10 py-6">
      <div className="max-w-3xl mx-auto">
        <div
          className={clsx(
            "relative border border-edge",
            "focus-within:border-accent transition-colors duration-300",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a thought…"
            rows={3}
            className={clsx(
              "w-full bg-transparent border-0 px-5 pt-4 pb-2 resize-none",
              "font-serif text-lg text-ink",
              "placeholder:font-serif placeholder:italic placeholder:text-inkFaint",
              "focus:outline-none",
            )}
          />
          <div className="flex items-center justify-between px-5 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
              ↵ to send · ⇧+↵ for new line
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-accent breathe" />
              awaiting gemini · phase 03
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MessageInput;
