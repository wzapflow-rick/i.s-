"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "inverse"
  | "inverseOutline";

// Removemos os handlers de drag/animação do React que conflitam com os
// tipos equivalentes do motion ao usar <motion.a>.
type AnchorProps = Omit<
  ComponentProps<"a">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

interface CtaButtonProps extends AnchorProps {
  variant?: Variant;
  arrow?: boolean;
}

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 " +
  "font-sans text-[0.7rem] uppercase tracking-wide-editorial font-medium " +
  "transition-colors duration-500 ease-out focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ink-foreground hover:bg-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.04)]",
  secondary:
    "border border-line text-foreground hover:border-foreground hover:bg-foreground/[0.03]",
  ghost: "text-foreground/80 hover:text-foreground",
  // Para fundos escuros (bg-ink): botão creme, texto escuro. Cores fixas na
  // própria variante para não depender de override por className (que o
  // tailwind-merge pode não resolver entre text-ink e text-ink-foreground).
  inverse:
    "border border-ink-foreground/20 bg-ink-foreground text-ink hover:bg-accent-soft",
  // Outline para fundos escuros: contorno + texto creme, fundo transparente.
  inverseOutline:
    "border border-ink-foreground/30 text-ink-foreground hover:border-ink-foreground hover:bg-ink-foreground/5",
};

// Cor do brilho que atravessa o botão no hover, por variante.
const shine: Record<Variant, string> = {
  primary: "via-ink-foreground/25",
  secondary: "via-foreground/10",
  ghost: "via-foreground/10",
  inverse: "via-ink/15",
  inverseOutline: "via-ink-foreground/15",
};

export function CtaButton({
  variant = "primary",
  arrow = true,
  className,
  children,
  ...props
}: CtaButtonProps) {
  return (
    <motion.a
      className={cn(base, variants[variant], className)}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Brilho diagonal que passa sutilmente no hover */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent to-transparent",
          "transition-transform duration-700 ease-out group-hover:translate-x-[130%]",
          shine[variant],
        )}
      />
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className="relative z-10 inline-block translate-x-0 transition-transform duration-500 ease-out group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </motion.a>
  );
}
