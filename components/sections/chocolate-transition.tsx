"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * TRANSIÇÃO — CALDA DE CHOCOLATE (100% SVG inline + CSS)
 *
 * NÃO é uma seção. É apenas a borda inferior da seção de sabores escorrendo
 * sobre o bege de "O PRODUTO":
 *   navegação de sabores → calda fina de chocolate → fundo bege.
 *
 * - Faixa MUITO fina (~64–88px). Sem texto. Só 4 gotas irregulares.
 * - Margem negativa encosta a calda logo abaixo da navegação (elimina o
 *   espaço bege que fazia parecer uma seção independente).
 * - Determinística (sem Math.random / Date) → SSR e client idênticos.
 * - Fade sutil ligado ao scroll; respeita prefers-reduced-motion.
 */
export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [8, 0]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative z-20 -mt-5 w-full overflow-hidden bg-surface leading-[0] sm:-mt-6 lg:-mt-8"
    >
      <motion.div
        style={{ opacity, y }}
        className="relative h-[64px] sm:h-[76px] lg:h-[88px]"
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            {/* Corpo: brilhante no topo, escuro na base — calda espessa. */}
            <linearGradient
              id="ct-body"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="120"
            >
              <stop offset="0" stopColor="#4a2110" />
              <stop offset="0.4" stopColor="#35170f" />
              <stop offset="1" stopColor="#260e07" />
            </linearGradient>
            {/* Highlight glossy logo abaixo da borda superior. */}
            <linearGradient
              id="ct-gloss"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="4"
              x2="0"
              y2="34"
            >
              <stop offset="0" stopColor="#9a6238" stopOpacity="0.5" />
              <stop offset="1" stopColor="#9a6238" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ===== MASSA: topo levemente ondulado, base irregular ===== */}
          <path
            fill="url(#ct-body)"
            d="M0,9
               C200,3 380,15 560,8
               C760,1 940,14 1120,7
               C1260,2 1360,11 1440,8
               L1440,60
               C1320,66 1240,56 1120,62
               C980,69 880,58 760,64
               C620,71 500,59 380,65
               C260,70 130,60 0,64
               Z"
          />

          {/* ===== HIGHLIGHT glossy sob a borda superior ===== */}
          <path
            fill="url(#ct-gloss)"
            d="M0,11
               C200,5 380,17 560,10
               C760,3 940,16 1120,9
               C1260,4 1360,13 1440,10
               L1440,26
               C1260,31 1080,20 900,26
               C720,32 560,21 380,27
               C240,31 120,23 0,27
               Z"
          />

          {/* ===== GOTAS — apenas 4, tamanhos e posições irregulares =====
              A: grande e longa | B: média | C: minúscula (quase some) | D: média-longa
              Posições NÃO uniformes (235, 615, 880, 1175). */}
          <path
            fill="url(#ct-body)"
            d="M223,62 C215,86 215,108 235,115 C255,108 255,86 247,62 Z"
          />
          <path
            fill="url(#ct-body)"
            d="M606,63 C600,80 601,91 615,96 C629,91 630,80 624,63 Z"
          />
          <path
            fill="url(#ct-body)"
            d="M874,62 C871,70 871,76 880,79 C889,76 889,70 886,62 Z"
          />
          <path
            fill="url(#ct-body)"
            d="M1165,62 C1157,84 1158,101 1175,108 C1192,101 1193,84 1185,62 Z"
          />
        </svg>
      </motion.div>
    </div>
  );
}
