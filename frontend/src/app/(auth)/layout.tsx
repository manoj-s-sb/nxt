import type { ReactNode } from "react";

import { AmbientStage } from "@/components/auth/AmbientStage";
import { Wordmark } from "@/components/auth/Wordmark";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.05fr_1fr] lg:grid-cols-[1.15fr_1fr] bg-canvas">
      <AmbientStage />

      <main className="relative flex flex-col bg-canvas">
        {/* Mobile-only top bar */}
        <header className="md:hidden flex items-center justify-between px-6 py-5 border-b border-edge">
          <Wordmark size="sm" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
            online
          </span>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-14 py-10 md:py-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>

        {/* Bottom corner — meta text */}
        <footer className="hidden md:flex items-center justify-between px-14 py-6 border-t border-edge font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          <span>encrypted · gemini · mongodb</span>
          <span>※</span>
          <span>v 0.1.0</span>
        </footer>
      </main>
    </div>
  );
}
