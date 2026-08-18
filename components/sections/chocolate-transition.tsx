"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * TRANSIÇÃO — CHOCOLATE DERRETIDO (100% SVG inline + CSS)
 *
 * Divisória orgânica e CURTA entre a seção de sabores e a seção "O PRODUTO".
 * - Nada de PNG/JPG/IA: a forma é um SVG inline, totalmente responsivo.
 * - Fundo bege (surface) → o chocolate é uma faixa que pinga sobre o bege,
 *   emendando sem linha dura com a onda de creme dos sabores (acima) e com
 *   "O PRODUTO" (abaixo), ambos bege.
 * - Determinístico: sem Math.random / Date → SSR e client idênticos.
 * - Animação sutil ligada ao scroll (fade + leve deriva). Sem sticky, sem
 *   pinning, sem scroll-hijacking — a página rola normalmente.
 */
export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Revelação suave + micro-deriva orgânica (desativadas se reduced-motion).
  const opacity = useTransform(scrollYProgress, [0, 0.32], [0, 1]);
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduced ? [0, 0, 0] : [12, 0, -6],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative w-full overflow-hidden bg-surface leading-[0]"
    >
      <motion.div
        style={{ opacity, y }}
        className="relative h-[80px] sm:h-[120px] lg:h-[150px]"
      >
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            {/* Corpo do chocolate: profundidade vertical (brilhante no topo,
                escuro na base). userSpaceOnUse para casar massa + gotas. */}
            <linearGradient
              id="choco-body"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="24"
              x2="0"
              y2="200"
            >
              <stop offset="0" stopColor="#48200f" />
              <stop offset="0.42" stopColor="#35170f" />
              <stop offset="1" stopColor="#280f08" />
            </linearGradient>

            {/* Highlight glossy discreto logo abaixo da borda superior. */}
            <linearGradient
              id="choco-gloss"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="30"
              x2="0"
              y2="78"
            >
              <stop offset="0" stopColor="#8a5836" stopOpacity="0.42" />
              <stop offset="1" stopColor="#8a5836" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ===== MASSA: topo levemente ondulado + base irregular ===== */}
          <path
            fill="url(#choco-body)"
            d="M0,38
               C160,28 300,46 460,37
               C620,28 760,47 920,37
               C1080,28 1240,45 1440,37
               L1440,150
               C1300,150 1200,140 1060,148
               C900,157 780,141 620,150
               C460,159 320,143 160,150
               C104,153 52,150 0,150
               Z"
          />

          {/* ===== HIGHLIGHT glossy sob a borda superior ===== */}
          <path
            fill="url(#choco-gloss)"
            d="M0,40
               C160,30 300,48 460,39
               C620,30 760,49 920,39
               C1080,30 1240,47 1440,39
               L1440,70
               C1240,76 1080,62 920,69
               C760,76 620,60 460,69
               C300,76 160,62 0,70
               Z"
          />

          {/* ===== GOTAS (teardrops com pontas arredondadas) =====
              Tamanhos variados; as pequenas somem no mobile (hidden sm:block)
              para reduzir a quantidade e a densidade em telas estreitas. */}
          {/* grande */}
          <path
            fill="url(#choco-body)"
            d="M132,146 C124,170 126,192 140,198 C154,192 156,170 148,146 Z"
          />
          {/* pequena (só ≥ sm) */}
          <path
            className="hidden sm:block"
            fill="url(#choco-body)"
            d="M295,147 C291,158 291,167 300,171 C309,167 309,158 305,147 Z"
          />
          {/* média */}
          <path
            fill="url(#choco-body)"
            d="M514,147 C508,168 509,180 520,185 C531,180 532,168 526,147 Z"
          />
          {/* grande */}
          <path
            fill="url(#choco-body)"
            d="M722,147 C714,171 716,193 730,199 C744,193 746,171 738,147 Z"
          />
          {/* pequena (só ≥ sm) */}
          <path
            className="hidden sm:block"
            fill="url(#choco-body)"
            d="M935,147 C931,158 931,167 940,172 C949,167 949,158 945,147 Z"
          />
          {/* média */}
          <path
            fill="url(#choco-body)"
            d="M1114,147 C1108,168 1109,180 1120,186 C1131,180 1132,168 1126,147 Z"
          />
          {/* pequena (só ≥ sm) */}
          <path
            className="hidden sm:block"
            fill="url(#choco-body)"
            d="M1305,147 C1301,158 1301,167 1310,171 C1319,167 1319,158 1315,147 Z"
          />
        </svg>

        {/* ===== ASSINATURA: frase pequena e elegante dentro da massa ===== */}
        <div className="absolute inset-x-0 top-[24%] flex justify-center px-6 sm:top-[28%]">
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.34em] text-accent-soft sm:text-[0.68rem]">
            Feito para combinar.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
