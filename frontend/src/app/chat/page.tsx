"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useConversationsStore } from "@/store/conversationsStore";

export default function ChatHomePage() {
  const router = useRouter();
  const create = useConversationsStore((s) => s.create);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBegin() {
    setBusy(true);
    setError(null);
    try {
      const c = await create();
      router.push(`/chat/${c.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "could not begin");
      setBusy(false);
    }
  }

  return (
    <div className="relative h-full flex items-center justify-center px-6 overflow-hidden">
      <div className="ambient-bloom opacity-40" aria-hidden />
      <div className="grain" aria-hidden />

      <div className="relative z-10 max-w-lg text-center space-y-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent reveal-1">
          {"// no thread selected"}
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] text-ink leading-[1.05] reveal-2">
          <span className="italic">silence</span> sits well here.
        </h1>
        <p className="font-serif italic text-xl text-inkDim reveal-3">
          pick a thread from the sidebar — or weave a new one.
        </p>
        <div className="pt-4 reveal-4">
          <button
            onClick={handleBegin}
            disabled={busy}
            className="group inline-flex items-center gap-3 bg-ink text-canvas px-7 py-3.5 font-mono text-[11px] uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{busy ? "opening" : "begin a thread"}</span>
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
        {error && (
          <p className="font-mono text-[11px] text-danger reveal-5">{error}</p>
        )}
      </div>
    </div>
  );
}
