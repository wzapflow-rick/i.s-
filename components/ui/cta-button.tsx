"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface CtaButtonProps extends ComponentProps<"a"> {
  variant?: Variant;
  arrow?: boolean;
}

const base =
  "group inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 " +
  "font-sans text-[0.7rem] uppercase tracking-wide-editorial font-medium " +
  "transition-all duration-500 ease-out focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ink-foreground hover:bg-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.04)]",
  secondary:
    "border border-line text-foreground hover:border-foreground hover:bg-foreground/[0.03]",
  ghost: "text-foreground/80 hover:text-foreground",
};

export function CtaButton({
  variant = "primary",
  arrow = true,
  className,
  children,
  ...props
}: CtaButtonProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="inline-block translate-x-0 transition-transform duration-500 ease-out group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </a>
  );
}
