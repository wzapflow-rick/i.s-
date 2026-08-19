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
      className="mb-1.5 block font-sans text-[0.66rem] uppercase tracking-wide-editorial text-[#f4efe4]/70"
    >
      {children}
      {optional && <span className="ml-1 lowercase tracking-normal">(opcional)</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 font-sans text-xs text-[#e2a5a0]">
      {message}
    </p>
  );
}

// Inputs em estilo "linha" — apenas borda inferior discreta sobre o fundo
// escuro cinematográfico. Sem caixa/preenchimento.
const inputBase =
  "w-full border-0 border-b bg-transparent px-0 py-2.5 font-sans text-[0.95rem] text-[#f8f4ea] " +
  "placeholder:text-[#f4efe4]/55 transition-colors duration-300 outline-none " +
  "focus:border-[color:var(--accent-soft)]";

export function TextField({
  error,
  className,
  ...props
}: ComponentProps<"input"> & { error?: string }) {
  return (
    <input
      className={cn(inputBase, error ? "border-[#e2a5a0]/70" : "border-[#f4efe4]/35", className)}
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
      className={cn(
        "w-full resize-none rounded-md border bg-transparent px-4 py-3 font-sans text-[0.95rem] text-[#f8f4ea] min-h-28 " +
          "placeholder:text-[#f4efe4]/55 transition-colors duration-300 outline-none focus:border-[color:var(--accent-soft)]",
        error ? "border-[#e2a5a0]/70" : "border-[#f4efe4]/35",
        className,
      )}
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
                ? "border-[color:var(--accent-soft)] bg-[#f4efe4]/[0.05] text-[#f4efe4]"
                : "border-[#f4efe4]/15 bg-transparent text-[#f4efe4]/60 hover:border-[#f4efe4]/35 hover:text-[#f4efe4]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                selected ? "border-[color:var(--accent-soft)]" : "border-[#f4efe4]/30",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full transition-transform duration-300",
                  selected ? "scale-100 bg-[color:var(--accent-soft)]" : "scale-0 bg-transparent",
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
