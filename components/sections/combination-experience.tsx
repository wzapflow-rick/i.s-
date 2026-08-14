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
  // tint = tom que entra sutilmente no fundo a cada combinação
  { with: "Açaí", color: "text-acai", tint: "#5a3a6d" },
  { with: "Gelato", color: "text-gelato", tint: "#7c8b5a" },
  { with: "Café", color: "text-cafe", tint: "#6b4a32" },
  // "Seu negócio" e "Você" convergem para o dourado da identidade i.sí
  { with: "Seu negócio", color: "text-accent", tint: "#b08d4f" },
  { with: "Você", color: "text-accent", tint: "#c9ad78" },
];

// Tom final quando tudo converge para a identidade i.sí
const FINAL_TINT = "#b08d4f";

/**
 * SEÇÃO 08 — CONCEITO DE COMBINAÇÃO
 * Scroll longo e "pinned": conforme o usuário rola, a combinação muda
 * i.sí + AÇAÍ → GELATO → CAFÉ → SEU NEGÓCIO → VOCÊ.
 * Termina em "E com o seu negócio?" + CTA de parceria.
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
        {/* Microvariação de tom: um brilho radial sutil entra a cada combinação */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tint-${ended ? "final" : index}`}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(60% 55% at 50% 45%, ${
                ended ? FINAL_TINT : combo.tint
              }38 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!ended ? (
            <motion.div
              key={`combo-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex flex-col items-center text-center"
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
              className="relative z-10 flex flex-col items-center text-center"
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
        <div className="absolute bottom-10 z-10 flex items-center gap-2">
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
