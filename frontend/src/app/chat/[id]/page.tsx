"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getConversation, type ConversationDetail } from "@/api/conversations";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getConversation(params.id)
      .then((data) => {
        if (!cancelled) setConversation(data);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        if (err.message?.toLowerCase().includes("not found")) {
          router.replace("/chat");
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent breathe"
        />
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-mono text-sm text-danger">
          {error ?? "thread not found"}
        </p>
      </div>
    );
  }

  return (
    <>
      <ChatHeader conversation={conversation} />
      <ChatWindow messages={conversation.messages} />
      <MessageInput conversationId={conversation.id} />
    </>
  );
}
