"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { hasToken } from "@/lib/auth";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <span
          aria-hidden
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent breathe"
        />
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-cols-[300px_1fr] bg-canvas overflow-hidden">
      <Sidebar />
      <main className="relative flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
