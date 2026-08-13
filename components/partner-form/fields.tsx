"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-sans text-[0.68rem] uppercase tracking-wide-editorial text-muted-foreground"
    >
      {children}
      {optional && <span className="ml-1 lowercase tracking-normal">(opcional)</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 font-sans text-xs text-acai">
      {message}
    </p>
  );
}

const inputBase =
  "w-full rounded-md border bg-background px-4 py-3 font-sans text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 transition-colors duration-300 outline-none " +
  "focus:border-accent focus:ring-1 focus:ring-accent";

export function TextField({
  error,
  className,
  ...props
}: ComponentProps<"input"> & { error?: string }) {
  return (
    <input
      className={cn(inputBase, error ? "border-acai/60" : "border-border", className)}
      aria-invalid={!!error}
      {...props}
    />
  );
}

export function TextArea({
  error,
  className,
  ...props
}: ComponentProps<"textarea"> & { error?: string }) {
  return (
    <textarea
      className={cn(inputBase, "min-h-32 resize-none", error ? "border-acai/60" : "border-border", className)}
      aria-invalid={!!error}
      {...props}
    />
  );
}

interface OptionGridProps {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
}

/** Grade de opções em estilo "chips" — usada para segmento, objetivo, etc. */
export function OptionGrid({
  name,
  value,
  options,
  onChange,
  columns = 2,
}: OptionGridProps) {
  const cols =
    columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
  return (
    <div className={cn("grid gap-2.5", cols)} role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center gap-3 rounded-md border px-4 py-3.5 text-left font-sans text-sm transition-all duration-300",
              selected
                ? "border-accent bg-accent/[0.07] text-foreground"
                : "border-border bg-background text-muted-foreground hover:border-line hover:text-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                selected ? "border-accent" : "border-line",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full transition-transform duration-300",
                  selected ? "scale-100 bg-accent" : "scale-0 bg-transparent",
                )}
              />
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
