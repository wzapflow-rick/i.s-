"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Revela imagens com um leve zoom-out + fade ao entrar em cena, dando a
 * sensação de a foto "assentar" no lugar.
 *
 * Deliberadamente evita clip-path/máscara: uma imagem clipada não é pintada
 * e o navegador nunca dispara o lazy-load do next/image. Aqui a imagem
 * permanece sempre no fluxo (opacity/scale não impedem o carregamento),
 * então o reveal é 100% confiável mesmo em wrappers aninhados.
 *
 * O container recebe o transform (scale), tornando-se o bloco de contexto
 * para imagens `fill` — elas dimensionam corretamente e acompanham o zoom.
 */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 1.08 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{
        opacity: { duration: 1, ease, delay },
        scale: { duration: 1.5, ease, delay },
      }}
    >
      {children}
    </motion.div>
  );
}
