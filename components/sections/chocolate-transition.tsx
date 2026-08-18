"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * PONTE VISUAL — "FEITO PARA COMBINAR."
 * ---------------------------------------------------------------------------
 * NÃO é uma seção de conteúdo. É a assinatura da marca que conecta a seção de
 * SABORES (ProductExperience, que termina em creme) à seção O PRODUTO
 * (Products, fundo bege). O próprio chocolate é o elemento de ligação: derrete
 * a partir do topo, se espalha na horizontal numa faixa orgânica, carrega a
 * mensagem central e escorre em gotas que invadem o bege da próxima seção.
 *
 * A animação é dirigida pelo scroll (rápida, elegante, quase cinematográfica):
 * SABORES → chocolate derrete → chocolate ocupa a tela → O PRODUTO é revelado.
 * Usa apenas transform/opacity (GPU-friendly). Respeita prefers-reduced-motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// Fios/gotas de chocolate escorrendo para o bege — posições e proporções
// irregulares para leitura orgânica (não geométrica).
const DRIPS = [
  { left: 7, w: 9, h: 64 },
  { left: 16, w: 6, h: 40 },
  { left: 25, w: 13, h: 104 },
  { left: 34, w: 7, h: 52 },
  { left: 43, w: 10, h: 78 },
  { left: 50, w: 12, h: 128 },
  { left: 58, w: 7, h: 48 },
  { left: 66, w: 13, h: 92 },
  { left: 75, w: 6, h: 44 },
  { left: 84, w: 10, h: 70 },
  { left: 93, w: 8, h: 56 },
] as const;

// Superfície de chocolate espesso e brilhante
const CHOC_BODY =
  "linear-gradient(180deg, #4a2a1b 0%, #3b2118 42%, #2a1610 100%)";
const CHOC_DRIP =
  "linear-gradient(180deg, #3b2118 0%, #2a1610 100%)";

export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Progresso curto: começa quando o topo entra pela base da tela e termina
  // quando a faixa chega à zona nobre — dá a sensação rápida e contínua.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 38%"],
  });

  // Espalhamento horizontal da faixa (scaleX a partir do centro)
  const spreadMV = useTransform(scrollYProgress, [0, 0.85], [0.62, 1]);
  const bandOpacityMV = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const dripScaleMV = useTransform(scrollYProgress, [0.45, 1], [0, 1]);
  const textOpacityMV = useTransform(scrollYProgress, [0.35, 0.85], [0, 1]);
  const textYMV = useTransform(scrollYProgress, [0.35, 0.95], [26, 0]);

  // Reduced motion → tudo estático e já revelado
  const spread = reduced ? 1 : spreadMV;
  const bandOpacity = reduced ? 1 : bandOpacityMV;
  const dripScale = reduced ? 1 : dripScaleMV;
  const textOpacity = reduced ? 1 : textOpacityMV;
  const textY = reduced ? 0 : textYMV;

  return (
    <section
      ref={ref}
      aria-label="Feito para combinar"
      // bg-surface = mesmo bege da seção O PRODUTO → emenda invisível embaixo.
      className="relative isolate bg-surface"
    >
      {/* ================= CAMADA DE CHOCOLATE (espalha na horizontal) ======= */}
      <motion.div
        aria-hidden
        style={{ scaleX: spread, opacity: bandOpacity }}
        className="relative origin-center will-change-transform"
      >
        {/* Borda superior orgânica: o chocolate "escorre" do topo (dos sabores)
            e se assenta numa crista ondulada, nunca um retângulo. */}
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-[52px] w-full sm:h-[88px]"
        >
          <path
            d="M0,46 C 180,14 320,74 520,50 C 720,26 880,78 1080,52 C 1260,30 1360,66 1440,46 L1440,120 L0,120 Z"
            fill="#4a2a1b"
          />
        </svg>

        {/* Corpo da faixa: chocolate espesso e brilhante */}
        <div
          className="relative min-h-[280px] w-full sm:min-h-[360px]"
          style={{ background: CHOC_BODY }}
        >
          {/* Brilho glossy no topo do chocolate */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            style={{
              background:
                "linear-gradient(180deg, rgba(122,74,48,0.55) 0%, rgba(122,74,48,0) 100%)",
            }}
          />
          {/* Reflexo radial suave (aparência de gordura/brilho do chocolate) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 120% at 50% 8%, rgba(201,173,120,0.16) 0%, transparent 55%)",
            }}
          />
        </div>

        {/* Gotas e fios escorrendo para baixo, invadindo o bege abaixo */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0">
          {DRIPS.map((d, i) => (
            <Drip key={i} drip={d} scaleY={dripScale} />
          ))}
        </div>
      </motion.div>

      {/* ================= MENSAGEM CENTRAL (não distorce com o scaleX) ====== */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="pointer-events-none absolute inset-x-0 top-[52px] bottom-0 z-10 flex flex-col items-center justify-center px-6 text-center sm:top-[88px]"
      >
        <h2 className="font-serif text-4xl leading-[1.02] tracking-tight text-balance text-[#efe9dd] sm:text-6xl">
          Feito para combinar.
        </h2>
        <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-[#efe9dd]/75 sm:text-base">
          Gelato artesanal para negócios que querem oferecer mais.
        </p>
        <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-[0.62rem] uppercase tracking-eyebrow text-[#c9ad78] sm:text-[0.68rem]">
          <span>5L</span>
          <Dot />
          <span>10L</span>
          <Dot />
          <span>100% Leite Integral</span>
          <Dot />
          <span>Artesanal</span>
        </p>
      </motion.div>
    </section>
  );
}

function Dot() {
  return (
    <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-[#c9ad78]/70" />
  );
}

/** Um fio de chocolate que cresce para baixo (origin no topo) e termina numa gota. */
function Drip({
  drip,
  scaleY,
}: {
  drip: (typeof DRIPS)[number];
  scaleY: MotionValue<number> | number;
}) {
  const blob = drip.w * 1.7;
  return (
    <motion.div
      style={{
        left: `${drip.left}%`,
        width: drip.w,
        scaleY,
      }}
      className="absolute top-0 origin-top -translate-x-1/2 will-change-transform"
      transition={{ ease: EASE }}
    >
      {/* strand */}
      <div
        className="w-full rounded-b-full"
        style={{ height: drip.h, background: CHOC_DRIP }}
      />
      {/* gota na ponta */}
      <div
        className="mx-auto rounded-full"
        style={{
          width: blob,
          height: blob,
          marginTop: -blob * 0.55,
          background: CHOC_DRIP,
        }}
      />
    </motion.div>
  );
}
