"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direção da máscara ao revelar. */
  from?: "bottom" | "left";
}

/**
 * Revela imagens com uma máscara (clip-path) suave + um leve zoom-out,
 * dando a sensação de a foto "assentar" ao entrar em cena.
 *
 * Mantém sempre o mesmo elemento (motion.div) para evitar hydration
 * mismatch. Usuários com prefers-reduced-motion têm as transições
 * neutralizadas pelo CSS global (globals.css).
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: ImageRevealProps) {
  const hidden =
    from === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 100% 0%)";

  return (
    <motion.div
      className={className}
      initial={{ clipPath: hidden, scale: 1.12 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        clipPath: { duration: 1.1, ease, delay },
        scale: { duration: 1.5, ease, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
