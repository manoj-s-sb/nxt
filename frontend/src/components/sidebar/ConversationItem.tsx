"use client";

import { useState, type MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

import type { Conversation } from "@/api/conversations";
import { useConversationsStore } from "@/store/conversationsStore";
import { formatRelativeTime } from "@/utils/formatDate";

interface Props {
  conversation: Conversation;
}

export function ConversationItem({ conversation }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const rename = useConversationsStore((s) => s.rename);
  const remove = useConversationsStore((s) => s.remove);

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(conversation.title);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isActive = pathname?.startsWith(`/chat/${conversation.id}`);

  function stop(e: MouseEvent) {
    e.stopPropagation();
  }

  async function commitRename() {
    const next = titleDraft.trim();
    if (next && next !== conversation.title) {
      try {
        await rename(conversation.id, next);
      } catch {
        setTitleDraft(conversation.title);
      }
    } else {
      setTitleDraft(conversation.title);
    }
    setEditing(false);
  }

  async function handleDelete() {
    try {
      await remove(conversation.id);
      if (isActive) router.push("/chat");
    } catch {
      // ignore — could surface a toast later
    }
  }

  return (
    <li
      className={clsx(
        "group relative px-3 py-2.5 cursor-pointer transition-colors rounded-sm",
        "hover:bg-canvas/60",
        isActive && "bg-canvas/80",
      )}
      onClick={() => {
        if (!editing) router.push(`/chat/${conversation.id}`);
      }}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-2 bottom-2 w-px bg-accent"
        />
      )}

      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={clsx(
            "mt-1.5 w-1 h-1 rounded-full flex-shrink-0 transition-colors",
            isActive ? "bg-accent" : "bg-edgeBright group-hover:bg-inkDim",
          )}
        />

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              type="text"
              value={titleDraft}
              maxLength={120}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={commitRename}
              onClick={stop}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename();
                }
                if (e.key === "Escape") {
                  setTitleDraft(conversation.title);
                  setEditing(false);
                }
              }}
              className="w-full bg-transparent border-b border-accent font-serif text-[15px] text-ink focus:outline-none py-0"
            />
          ) : (
            <p
              className={clsx(
                "font-serif text-[15px] leading-tight truncate",
                isActive
                  ? "text-ink"
                  : "text-inkDim group-hover:text-ink transition-colors",
              )}
            >
              {conversation.title}
            </p>
          )}

          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-inkFaint">
            {formatRelativeTime(conversation.updated_at)}
          </p>
        </div>

        {!editing && (
          <div
            className={clsx(
              "flex items-center gap-1.5 transition-opacity",
              confirmDelete || isActive
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100",
            )}
          >
            {confirmDelete ? (
              <>
                <button
                  onClick={(e) => {
                    stop(e);
                    handleDelete();
                  }}
                  className="font-mono text-[9px] uppercase tracking-widest text-danger hover:opacity-80"
                >
                  yes
                </button>
                <span aria-hidden className="text-inkFaint text-[10px]">
                  ·
                </span>
                <button
                  onClick={(e) => {
                    stop(e);
                    setConfirmDelete(false);
                  }}
                  className="font-mono text-[9px] uppercase tracking-widest text-inkFaint hover:text-ink"
                >
                  no
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    stop(e);
                    setEditing(true);
                  }}
                  aria-label="rename"
                  title="rename"
                  className="text-inkFaint hover:text-accent text-[12px] leading-none transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={(e) => {
                    stop(e);
                    setConfirmDelete(true);
                  }}
                  aria-label="delete"
                  title="delete"
                  className="text-inkFaint hover:text-danger text-[11px] leading-none transition-colors"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export default ConversationItem;
