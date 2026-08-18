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
 * TRANSIÇÃO CURTA — calda de chocolate entre SABORES e O PRODUTO.
 * ---------------------------------------------------------------------------
 * NÃO é uma seção. É apenas uma ponte visual: uma fina faixa de chocolate
 * derretido que "escorre" do fim da cena marrom (sabores) e revela o bege da
 * seção O PRODUTO logo abaixo. Curta (≈130–170px desktop, menos no mobile),
 * com uma frase discreta e poucas gotas orgânicas descendo sobre o bege.
 *
 * Determinístico (sem Math.random/Date) → SSR e client renderizam idêntico,
 * sem erro de hidratação. Animação apenas com transform (GPU), rápida e sutil,
 * dirigida pelo scroll — nunca bloqueia a rolagem.
 */

// Poucas gotas finas, posições/alturas fixas e irregulares (orgânico, não geométrico).
const DRIPS = [
  { left: 15, w: 7, h: 40 },
  { left: 35, w: 9, h: 72 },
  { left: 57, w: 6, h: 48 },
  { left: 80, w: 8, h: 58 },
] as const;

// Chocolate: escuro no topo (continua a cena marrom) → chocolate quente na base.
const CHOC_TOP = "#1b110b";
const CHOC_BOTTOM = "#3a2016";
const CHOC_BODY = `linear-gradient(180deg, ${CHOC_TOP} 0%, #2a1610 55%, ${CHOC_BOTTOM} 100%)`;

export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // Progresso curto e rápido: completa logo que a faixa entra na tela.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 70%"],
  });

  const dripGrowMV = useTransform(scrollYProgress, [0, 1], [0.45, 1]);
  const dripGrow = reduced ? 1 : dripGrowMV;

  return (
    // bg-surface = mesmo bege da seção O PRODUTO → emenda invisível embaixo.
    <div aria-hidden ref={ref} className="relative isolate bg-surface">
      {/* ===== MASSA DE CHOCOLATE (curta) ===== */}
      <div
        className="relative h-[104px] w-full sm:h-[124px] lg:h-[132px]"
        style={{ background: CHOC_BODY }}
      >
        {/* Brilho glossy sutil no topo do chocolate */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(122,74,48,0.5) 0%, rgba(122,74,48,0) 100%)",
          }}
        />

        {/* Frase discreta, centralizada, com filetes dourados */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="flex items-center gap-4 font-serif text-sm tracking-[0.22em] text-[#c9ad78] sm:gap-5 sm:text-base">
            <span aria-hidden className="hidden h-px w-8 bg-[#c9ad78]/45 sm:block" />
            FEITO PARA COMBINAR.
            <span aria-hidden className="hidden h-px w-8 bg-[#c9ad78]/45 sm:block" />
          </p>
        </div>
      </div>

      {/* ===== BORDA INFERIOR ORGÂNICA (chocolate escorrendo no bege) ===== */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="-mt-px block h-6 w-full sm:h-8"
      >
        <path
          d="M0,0 L1440,0 L1440,20 C1360,22 1330,30 1290,29 C1250,28 1235,17 1180,18 C1090,20 1030,33 950,30 C900,28 892,16 858,17 C770,19 700,32 620,29 C575,27 566,15 536,16 C470,18 400,31 320,28 C270,26 258,16 226,17 C160,19 90,30 0,24 Z"
          fill={CHOC_BOTTOM}
        />
      </svg>

      {/* ===== GOTAS FINAS descendo sobre o bege ===== */}
      <div className="pointer-events-none relative -mt-2 h-0">
        {DRIPS.map((d, i) => (
          <Drip key={i} drip={d} scaleY={dripGrow} />
        ))}
      </div>
    </div>
  );
}

/** Fio fino que cresce para baixo (origin no topo) e termina numa gota. */
function Drip({
  drip,
  scaleY,
}: {
  drip: (typeof DRIPS)[number];
  scaleY: MotionValue<number> | number;
}) {
  const blob = drip.w * 1.6;
  return (
    <motion.div
      style={{ left: `${drip.left}%`, width: drip.w, scaleY }}
      className="absolute top-0 origin-top -translate-x-1/2 will-change-transform"
    >
      <div
        className="w-full rounded-b-full"
        style={{ height: drip.h, background: CHOC_BOTTOM }}
      />
      <div
        className="mx-auto rounded-full"
        style={{
          width: blob,
          height: blob,
          marginTop: -blob * 0.5,
          background: CHOC_BOTTOM,
        }}
      />
    </motion.div>
  );
}
