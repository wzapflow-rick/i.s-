"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface SplitWordsProps {
  text: string;
  className?: string;
  as?: Tag;
  delay?: number;
  step?: number;
  /** Deslocamento vertical inicial de cada palavra. */
  y?: string | number;
}

/**
 * Revela um título palavra por palavra, em stagger editorial.
 * Sobe + fade suave, sem clipar descendentes (seguro para serif/itálico).
 * Acessível: o texto completo fica no aria-label; as palavras são aria-hidden.
 */
export function SplitWords({
  text,
  className,
  as = "span",
  delay = 0,
  step = 0.055,
  y = "0.45em",
}: SplitWordsProps) {
  const MotionTag = motion[as];
  const words = text.split(" ");
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y, opacity: 0 },
              show: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.7, ease },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </MotionTag>
  );
}
