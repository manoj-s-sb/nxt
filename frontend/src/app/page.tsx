import Link from "next/link";

import { Wordmark } from "@/components/auth/Wordmark";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-canvas">
      <div className="ambient-bloom" aria-hidden />
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-8 sm:px-14 py-8">
        <Wordmark size="md" />
        <nav className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-widest text-inkDim">
          <Link href="/login" className="hover:text-ink transition-colors">
            sign in
          </Link>
          <Link
            href="/register"
            className="text-ink underline underline-offset-4 decoration-accent hover:decoration-ink"
          >
            begin →
          </Link>
        </nav>
      </header>

      <section className="relative z-10 flex-1 flex items-center px-8 sm:px-14">
        <div className="max-w-4xl space-y-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent reveal-1">
            chapter 01 · the thinking machine
          </p>
          <h1 className="font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] text-ink reveal-2">
            a quiet machine
            <br />
            that <span className="italic text-accent">remembers</span> you.
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-inkDim italic max-w-2xl leading-relaxed reveal-3">
            most chat tools forget the moment the tab closes. loom keeps the
            thread —<span className="text-ink"> what you said yesterday </span>
            informs what you ask tomorrow.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6 reveal-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 bg-ink text-canvas px-7 py-4 font-mono text-[11px] uppercase tracking-widest hover:bg-accent transition-colors"
            >
              <span>open a thread</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/login"
              className="font-mono text-[11px] uppercase tracking-widest text-inkDim hover:text-ink transition-colors underline underline-offset-4 decoration-edge hover:decoration-accent"
            >
              continue an old one
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-8 sm:px-14 py-8 border-t border-edge reveal-5">
        <div className="flex items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          <div className="space-y-1">
            <p>woven from gemini · mongodb · redis</p>
            <p>encrypted at rest · your memory is yours</p>
          </div>
          <div className="flex items-center gap-2 text-inkDim">
            <span className="inline-block w-1 h-1 rounded-full bg-accent breathe" />
            <span>online</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
