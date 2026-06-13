"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { hasToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { registerAndLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasToken()) router.replace("/chat");
  }, [router]);

  function validate(): boolean {
    let ok = true;
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("that doesn't look like a real address");
      ok = false;
    }
    if (password.length < 8) {
      setPasswordError("at least eight characters, please");
      ok = false;
    }
    return ok;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await registerAndLogin(email.trim(), password);
      router.replace("/chat");
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "could not create account",
      );
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4 reveal-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          {"// session — begin"}
        </p>
        <h1 className="font-serif text-[clamp(2.25rem,4vw,3rem)] leading-[1.05] text-ink">
          a place to be
          <br />
          <span className="italic text-accent">remembered</span>.
        </h1>
        <p className="font-serif text-lg text-inkDim italic">
          create your thread. your memory is yours alone.
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
            if (emailError) setEmailError(null);
            if (generalError) setGeneralError(null);
          }}
          disabled={loading}
          error={emailError}
        />
        <Field
          label="passphrase"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="at least eight characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
            if (generalError) setGeneralError(null);
          }}
          disabled={loading}
          error={passwordError}
          hint={
            !passwordError
              ? "kept as a one-way hash, never readable"
              : undefined
          }
        />

        {generalError && (
          <p
            role="alert"
            className="font-mono text-[11px] text-danger border border-danger/30 bg-danger/5 px-4 py-3"
          >
            {generalError}
          </p>
        )}

        <div className="pt-2">
          <Button type="submit" loading={loading} loadingLabel="weaving">
            begin
          </Button>
        </div>
      </form>

      <footer className="pt-6 border-t border-edge reveal-5 flex items-center justify-between">
        <p className="font-mono text-[11px] text-inkDim">
          already woven in?{" "}
          <Link
            href="/login"
            className="text-ink hover:text-accent transition-colors underline underline-offset-4 decoration-edge hover:decoration-accent"
          >
            return to your thread
          </Link>
        </p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint">
          ⌘ + ⏎
        </span>
      </footer>
    </div>
  );
}
