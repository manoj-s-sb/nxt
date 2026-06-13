"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Wordmark } from "@/components/auth/Wordmark";
import { useAuth } from "@/hooks/useAuth";
import { useConversationsStore } from "@/store/conversationsStore";

import { ChatList } from "./ChatList";
import { NewChatButton } from "./NewChatButton";

export function Sidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  const refresh = useConversationsStore((s) => s.refresh);
  const hasLoaded = useConversationsStore((s) => s.hasLoaded);
  const resetStore = useConversationsStore((s) => s.reset);

  useEffect(() => {
    if (!hasLoaded) refresh();
  }, [hasLoaded, refresh]);

  function handleSignOut() {
    logout();
    resetStore();
    router.replace("/login");
  }

  return (
    <aside className="relative h-full flex flex-col border-r border-edge bg-surface overflow-hidden">
      <div className="ambient-bloom opacity-40" aria-hidden />
      <div className="grain" aria-hidden />

      {/* Brand */}
      <div className="relative z-10 px-6 py-5 border-b border-edge">
        <Wordmark size="sm" />
      </div>

      {/* New thread */}
      <div className="relative z-10 px-5 py-5 border-b border-edge">
        <NewChatButton />
      </div>

      {/* Threads list */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 mb-4 font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          threads
        </p>
        <ChatList />
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 border-t border-edge flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          ※ archive
        </span>
        <button
          onClick={handleSignOut}
          className="font-mono text-[10px] uppercase tracking-widest text-inkDim hover:text-accent transition-colors"
        >
          sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
