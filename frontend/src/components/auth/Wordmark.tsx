import Link from "next/link";
import clsx from "clsx";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const text =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  const dot = size === "lg" ? "w-2 h-2" : "w-1.5 h-1.5";

  return (
    <Link
      href="/"
      className={clsx(
        "inline-flex items-center gap-3 group",
        "transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "rounded-full bg-accent breathe",
          "shadow-[0_0_12px_var(--accent)]",
          dot,
        )}
      />
      <span className={clsx("font-serif italic text-ink", text)}>loom</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-inkFaint hidden sm:inline">
        · 2026
      </span>
    </Link>
  );
}

export default Wordmark;
