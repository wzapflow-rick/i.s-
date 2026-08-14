"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

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
 * Usa useInView (ref explícito) em vez de whileInView: é determinístico
 * mesmo para wrappers aninhados em cartões animados, evitando que a
 * máscara fique presa no estado inicial (o que também impediria o
 * carregamento lazy da imagem, já que uma imagem clipada não é pintada).
 *
 * Acessibilidade: com prefers-reduced-motion, a imagem é renderizada já
 * no estado de repouso (totalmente visível), sem máscara.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: ImageRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const hidden =
    from === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 100% 0%)";
  const shown = "inset(0% 0% 0% 0%)";

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: hidden, scale: 1.12 }}
      animate={inView ? { clipPath: shown, scale: 1 } : undefined}
      transition={{
        clipPath: { duration: 1.1, ease, delay },
        scale: { duration: 1.5, ease, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
