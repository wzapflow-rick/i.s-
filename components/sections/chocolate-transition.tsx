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
 * TRANSIÇÃO SUAVE — o chocolate DERRETE do fim da cena de sabores para o bege
 * da seção O PRODUTO, seguindo o scroll. Sem emenda dura.
 * ---------------------------------------------------------------------------
 * COMO A EMENDA SOME:
 *  - O wrapper é TRANSPARENTE e sobe sobre o fim da cena (margin negativa).
 *  - O topo da massa de chocolate é um gradiente que começa 100% transparente
 *    e só então adensa em chocolate. Assim, QUALQUER cor de ambiente da cena
 *    (chocolate, morango, etc.) "escorre" para dentro do chocolate sem linha.
 *  - A base termina numa borda orgânica + gotas que caem sobre o bege.
 *
 * Determinístico (sem Math.random/Date) → SSR = client, sem erro de hidratação.
 * Só transform/opacity dirigidos pelo scroll (GPU); nunca bloqueia a rolagem.
 */

// Gotas finas — posições/alturas fixas e irregulares (orgânico, não geométrico).
const DRIPS = [
  { left: 9, w: 6, h: 34 },
  { left: 22, w: 8, h: 58 },
  { left: 38, w: 6, h: 42 },
  { left: 52, w: 9, h: 74 },
  { left: 68, w: 6, h: 38 },
  { left: 84, w: 8, h: 56 },
  { left: 94, w: 5, h: 30 },
] as const;

const CHOC_DEEP = "#2a1610";
const CHOC_WARM = "#3a2016";

// Topo transparente → adensa em chocolate. O ambiente da cena (atrás) derrete
// para dentro deste gradiente: nenhuma linha reta separando as seções.
const MELT_BODY =
  `linear-gradient(180deg,` +
  ` rgba(30,17,11,0) 0%,` +
  ` rgba(30,17,11,0) 26%,` +
  ` rgba(32,18,12,0.35) 42%,` +
  ` rgba(35,19,13,0.72) 56%,` +
  ` ${CHOC_DEEP} 74%,` +
  ` ${CHOC_WARM} 100%)`;

export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // O escorrer acompanha o scroll: começa antes de a faixa centralizar e
  // termina quando o bege já domina a tela.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  const dripGrowMV = useTransform(scrollYProgress, [0.15, 0.75], [0.25, 1]);
  const edgeYMV = useTransform(scrollYProgress, [0.1, 0.7], [-10, 0]);
  const dripGrow = reduced ? 1 : dripGrowMV;
  const edgeY = reduced ? 0 : edgeYMV;

  return (
    // Sobe sobre o fim da cena de sabores; fundo transparente para o chocolate
    // "nascer" da cor que estiver acima. z alto para escorrer sobre o bege.
    <div
      aria-hidden
      ref={ref}
      className="relative z-20 -mt-20 bg-transparent sm:-mt-24 lg:-mt-28"
    >
      {/* ===== MASSA DE CHOCOLATE DERRETENDO ===== */}
      <div
        className="relative h-[240px] w-full sm:h-[280px] lg:h-[300px]"
        style={{ backgroundImage: MELT_BODY }}
      >
        {/* Brilho glossy sutil na parte já adensada */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{
            background:
              "linear-gradient(180deg, rgba(122,74,48,0) 0%, rgba(122,74,48,0.28) 55%, rgba(122,74,48,0) 100%)",
          }}
        />

        {/* Frase discreta — assenta na parte sólida (inferior) da massa */}
        <div className="absolute inset-x-0 bottom-9 flex items-center justify-center px-6 sm:bottom-11">
          <p className="flex items-center gap-4 font-serif text-sm tracking-[0.22em] text-[#c9ad78] sm:gap-5 sm:text-base">
            <span aria-hidden className="hidden h-px w-8 bg-[#c9ad78]/45 sm:block" />
            FEITO PARA COMBINAR.
            <span aria-hidden className="hidden h-px w-8 bg-[#c9ad78]/45 sm:block" />
          </p>
        </div>
      </div>

      {/* ===== BORDA ORGÂNICA + GOTAS (escorrem sobre o bege) ===== */}
      <motion.div style={{ y: edgeY }} className="pointer-events-none relative">
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          className="-mt-px block h-8 w-full sm:h-10"
        >
          <path
            d="M0,0 L1440,0 L1440,26 C1360,30 1332,44 1290,43 C1246,42 1236,24 1180,26 C1092,29 1030,50 950,46 C902,44 894,22 858,24 C772,28 702,49 620,45 C576,43 568,20 536,22 C472,26 402,48 320,43 C272,40 260,22 226,24 C160,28 92,46 0,34 Z"
            fill={CHOC_WARM}
          />
        </svg>

        <div className="relative h-0">
          {DRIPS.map((d, i) => (
            <Drip key={i} drip={d} scaleY={dripGrow} />
          ))}
        </div>
      </motion.div>
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
  const blob = drip.w * 1.7;
  return (
    <motion.div
      style={{ left: `${drip.left}%`, width: drip.w, scaleY }}
      className="absolute top-0 origin-top -translate-x-1/2 will-change-transform"
    >
      <div
        className="w-full rounded-b-full"
        style={{ height: drip.h, background: CHOC_WARM }}
      />
      <div
        className="mx-auto rounded-full"
        style={{
          width: blob,
          height: blob,
          marginTop: -blob * 0.5,
          background: CHOC_WARM,
        }}
      />
    </motion.div>
  );
}
