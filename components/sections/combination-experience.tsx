"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { CtaButton } from "@/components/ui/cta-button";

const COMBOS = [
  { with: "Açaí", color: "text-acai" },
  { with: "Gelato", color: "text-gelato" },
  { with: "Café", color: "text-cafe" },
  { with: "Seu negócio", color: "text-accent" },
];

/**
 * SEÇÃO 08 — CONCEITO DE COMBINAÇÃO
 * Scroll longo e "pinned": conforme o usuário rola, a combinação muda
 * i.sí + AÇAÍ → GELATO → CAFÉ → SEU NEGÓCIO. Termina em "E com o seu negócio?".
 */
export function CombinationExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Divide o scroll em (COMBOS + 1) estados; o último é o CTA final.
    const total = COMBOS.length + 1;
    const raw = Math.floor(v * total);
    const clamped = Math.min(raw, total - 1);
    if (clamped >= COMBOS.length) {
      setEnded(true);
    } else {
      setEnded(false);
      setIndex(clamped);
    }
  });

  const combo = COMBOS[index];

  return (
    <section
      ref={ref}
      className="relative h-[400vh] border-t border-border bg-ink text-ink-foreground"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
        <AnimatePresence mode="wait">
          {!ended ? (
            <motion.div
              key={`combo-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <p className="mb-10 font-sans text-[0.68rem] uppercase tracking-eyebrow text-ink-foreground/50">
                Com o que a i.sí combina?
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                <span className="font-serif text-6xl tracking-tight sm:text-8xl">
                  i.sí
                </span>
                <span className="font-serif text-4xl text-accent-soft sm:text-6xl">
                  +
                </span>
                <span
                  className={`font-serif text-5xl tracking-tight sm:text-8xl ${combo.color}`}
                >
                  {combo.with}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ended"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
                E com o seu negócio?
              </h2>
              <div className="mt-12">
                <CtaButton
                  href="#formulario"
                  variant="primary"
                  className="border border-ink-foreground/20 bg-ink-foreground text-ink hover:bg-accent-soft"
                >
                  Quero ser parceiro
                </CtaButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicadores de progresso */}
        <div className="absolute bottom-10 flex items-center gap-2">
          {[...COMBOS, { with: "cta" }].map((_, i) => {
            const activeDot = ended ? i === COMBOS.length : i === index;
            return (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeDot ? "w-8 bg-accent-soft" : "w-1.5 bg-ink-foreground/25"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
