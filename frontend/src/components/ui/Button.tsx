"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  loadingLabel = "thinking",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={clsx(
        "group relative w-full overflow-hidden",
        "py-3.5 px-6",
        "font-mono text-[11px] uppercase tracking-widest",
        "transition-colors duration-300",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        variant === "primary" && [
          "bg-ink text-canvas",
          "hover:bg-accent",
          "disabled:bg-edge disabled:text-inkFaint disabled:cursor-not-allowed",
        ],
        variant === "ghost" && [
          "bg-transparent text-inkDim border border-edge",
          "hover:text-ink hover:border-edgeBright",
        ],
        className,
      )}
    >
      <span className="relative inline-flex items-center justify-center gap-3">
        {loading ? (
          <>
            <span
              aria-hidden
              className="w-1 h-1 rounded-full bg-current breathe"
            />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </>
        )}
      </span>
    </button>
  );
}

export default Button;
