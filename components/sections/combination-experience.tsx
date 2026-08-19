"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { CtaButton } from "@/components/ui/cta-button";

const COMBOS = [
  // tint = tom que entra sutilmente no fundo a cada combinação
  { with: "Açaí", color: "text-acai", tint: "#5a3a6d" },
  { with: "Sobremesas", color: "text-gelato", tint: "#7c8b5a" },
  { with: "Cafés", color: "text-cafe", tint: "#6b4a32" },
  // "Seu negócio" converge para o dourado da identidade i.sí
  { with: "Seu negócio", color: "text-accent", tint: "#b08d4f" },
];

// Tom final quando tudo converge para a identidade i.sí
const FINAL_TINT = "#b08d4f";

/**
 * SEÇÃO 08 — CONCEITO DE COMBINAÇÃO
 * Scroll longo e "pinned": conforme o usuário rola, a combinação muda
 * i.sí + AÇAÍ → GELATO → CAFÉ → SEU NEGÓCIO → VOCÊ.
 * Termina em "E com o seu negócio?" + CTA de parceria.
 * Cursor especial: um brilho segue o ponteiro, tingido pela combinação atual.
 */
export function CombinationExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Cursor especial — segue o ponteiro com mola suave
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const glowX = useSpring(cursorX, { stiffness: 260, damping: 28, mass: 0.5 });
  const glowY = useSpring(cursorY, { stiffness: 260, damping: 28, mass: 0.5 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // O conteúdo fica "pinned" (sticky) apenas enquanto a seção ocupa a tela.
    // Depois disso ele se solta e sobe. Se distribuíssemos os estados em 0→1,
    // o último estado (CTA) cairia na faixa já solta — e apareceria "vazio".
    // Por isso mapeamos os estados só sobre a faixa realmente fixada, medindo
    // a altura real da seção (funciona em mobile e desktop, com ou sem resize).
    const el = ref.current;
    const pinned =
      el && typeof window !== "undefined"
        ? Math.max(0.15, 1 - window.innerHeight / el.offsetHeight)
        : 0.75;
    const usable = Math.min(v / pinned, 1); // 0..1 durante o trecho fixado

    const total = COMBOS.length + 1;
    const raw = Math.floor(usable * total);
    const clamped = Math.min(raw, total - 1);
    if (clamped >= COMBOS.length) {
      setEnded(true);
    } else {
      setEnded(false);
      setIndex(clamped);
    }
  });

  const combo = COMBOS[index];
  const activeTint = ended ? FINAL_TINT : combo.tint;

  function handlePointer(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={ref}
      id="experiencia"
      className="relative h-[180vh] border-t border-border bg-ink text-ink-foreground lg:h-[320vh]"
    >
      <div
        onPointerMove={handlePointer}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5 [@media(hover:hover)]:cursor-none"
      >
        {/* Cursor especial — brilho tingido pela combinação atual.
            Sempre montado (árvore estável); só se move quando o ponteiro
            entra e a preferência de movimento permite. */}
        <motion.div
          aria-hidden="true"
          style={{ x: glowX, y: glowY }}
          className="pointer-events-none absolute left-0 top-0 z-30 hidden [@media(hover:hover)]:block"
        >
            <motion.div
              className="-translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-2xl"
              animate={{
                backgroundColor: activeTint,
                opacity: hovering ? 0.55 : 0,
                scale: hovering ? 1 : 0.6,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 220, height: 220 }}
            />
            <motion.div
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              animate={{
                borderColor: activeTint,
                opacity: hovering ? 0.7 : 0,
                scale: hovering ? 1 : 0.5,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 26, height: 26 }}
            />
        </motion.div>

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
              background: `radial-gradient(60% 55% at 50% 45%, ${activeTint}38 0%, transparent 70%)`,
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
                O gelato pode ocupar mais lugares do que você imagina.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                <span className="font-serif text-6xl tracking-tight sm:text-8xl">
                  i.sí
                </span>
                <motion.span
                  key={`plus-${index}`}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="font-serif text-4xl text-accent-soft sm:text-6xl"
                >
                  +
                </motion.span>
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
                Talvez a próxima combinação seja a sua.
              </h2>
              <div className="mt-12">
                <CtaButton href="#formulario" variant="inverse">
                  Quero conversar com a i.sí
                </CtaButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicadores de progresso — o dot ativo assume o tom da combinação */}
        <div className="absolute bottom-10 z-10 flex items-center gap-2">
          {[...COMBOS, { with: "cta" }].map((_, i) => {
            const activeDot = ended ? i === COMBOS.length : i === index;
            return (
              <motion.span
                key={i}
                className="h-1 rounded-full"
                animate={{
                  width: activeDot ? 32 : 6,
                  backgroundColor: activeDot
                    ? activeTint
                    : "rgba(239,233,221,0.25)",
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
