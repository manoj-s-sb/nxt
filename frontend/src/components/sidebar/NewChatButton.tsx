"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { useConversationsStore } from "@/store/conversationsStore";

export function NewChatButton() {
  const router = useRouter();
  const create = useConversationsStore((s) => s.create);
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const convo = await create();
      router.push(`/chat/${convo.id}`);
    } catch {
      // error surfaced by store consumers
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={clsx(
        "group w-full flex items-center justify-between gap-3",
        "border border-edge hover:border-accent transition-colors duration-300",
        "bg-canvas/60 hover:bg-canvas",
        "px-4 py-3",
        "font-mono text-[11px] uppercase tracking-widest text-ink",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className="font-serif italic text-accent text-xl leading-none"
        >
          ⟢
        </span>
        <span>{busy ? "opening" : "new thread"}</span>
      </span>
      <span
        aria-hidden
        className="transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

export default NewChatButton;
