"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="group">
      <label
        htmlFor={inputId}
        className="block font-mono text-[10px] uppercase tracking-widest text-inkFaint mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={clsx(
            "w-full bg-transparent border-0 border-b py-2.5 px-0",
            "font-serif text-xl text-ink",
            "placeholder:font-serif placeholder:italic placeholder:text-inkFaint",
            "focus:outline-none transition-colors duration-300",
            error
              ? "border-danger"
              : "border-edge group-focus-within:border-accent",
            className,
          )}
        />
        <span
          aria-hidden
          className={clsx(
            "absolute left-0 -bottom-px h-px w-0 bg-accent transition-all duration-500",
            "group-focus-within:w-full",
            error && "bg-danger group-focus-within:bg-danger",
          )}
        />
      </div>
      {(error || hint) && (
        <p
          className={clsx(
            "mt-2 font-mono text-[11px] tracking-wide",
            error ? "text-danger" : "text-inkFaint",
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

export default Field;
