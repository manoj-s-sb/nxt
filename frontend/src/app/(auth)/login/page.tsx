"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { hasToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasToken()) router.replace("/chat");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4 reveal-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          welcome back to the thread
        </p>
        <h1 className="font-serif text-[clamp(2.25rem,4vw,3rem)] leading-[1.05] text-ink">
          continue the
          <br />
          <span className="italic text-accent">conversation</span>.
        </h1>
        <p className="font-serif text-lg text-inkDim italic">
          sign in to pick up where memory left off.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 reveal-3" noValidate>
        <Field
          label="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you @ somewhere"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          disabled={loading}
        />
        <Field
          label="passphrase"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="······"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          disabled={loading}
          error={error}
        />

        <div className="pt-2">
          <Button type="submit" loading={loading} loadingLabel="verifying">
            enter
          </Button>
        </div>
      </form>

      <footer className="pt-6 border-t border-edge reveal-5 flex items-center justify-between">
        <p className="font-mono text-[11px] text-inkDim">
          no account yet?{" "}
          <Link
            href="/register"
            className="text-ink hover:text-accent transition-colors underline underline-offset-4 decoration-edge hover:decoration-accent"
          >
            begin a new thread
          </Link>
        </p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          ⌘ + ⏎
        </span>
      </footer>
    </div>
  );
}
