"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * TRANSIÇÃO ORGÂNICA — MASSA DE CHOCOLATE (100% SVG inline + CSS)
 *
 * NÃO é uma faixa, barra ou seção. É uma massa de chocolate/calda que se
 * espalha organicamente sobre o bege, dando continuidade à grande curva que
 * a seção de sabores já possui:
 *   - espessa e profunda no centro-esquerda (perto do copo);
 *   - uma curva ampla e elegante que sobe suavemente para a direita;
 *   - poucas extensões orgânicas (não gotas alinhadas);
 *   - DESAPARECE gradualmente nas duas laterais (máscara horizontal);
 *   - sem texto, sem divisória, sem espaço vazio.
 *
 * Determinística (sem Math.random / Date) → SSR e client idênticos.
 * Animação: revelação sutil + leve espalhar no scroll; respeita
 * prefers-reduced-motion.
 */
export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const scaleX = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.965, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, 0]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative z-20 -mt-10 w-full overflow-hidden bg-surface leading-[0] lg:-mt-16"
    >
      <motion.div
        style={{ opacity, scaleX, y, transformOrigin: "50% 0%" }}
        className="relative h-[110px] sm:h-[130px] lg:h-[150px]"
      >
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            {/* Corpo: brilho quente no topo → chocolate profundo na base. */}
            <linearGradient
              id="ct-body"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="200"
            >
              <stop offset="0" stopColor="#5a2e18" />
              <stop offset="0.35" stopColor="#3c1d11" />
              <stop offset="1" stopColor="#22100a" />
            </linearGradient>
            {/* Brilho glossy discreto acompanhando a borda superior. */}
            <linearGradient
              id="ct-gloss"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="14"
              x2="0"
              y2="60"
            >
              <stop offset="0" stopColor="#9a6238" stopOpacity="0.45" />
              <stop offset="1" stopColor="#9a6238" stopOpacity="0" />
            </linearGradient>
            {/* Máscara horizontal: dissolve a massa nas duas laterais. */}
            <linearGradient
              id="ct-fade"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="1440"
              y2="0"
            >
              <stop offset="0" stopColor="#000" />
              <stop offset="0.12" stopColor="#fff" />
              <stop offset="0.88" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <mask id="ct-mask">
              <rect x="0" y="0" width="1440" height="200" fill="url(#ct-fade)" />
            </mask>
          </defs>

          <g mask="url(#ct-mask)">
            {/* ===== MASSA PRINCIPAL — assimétrica, curva ampla =====
                Topo com ondulação suave; base mergulha num lobo profundo no
                centro-esquerda (pour espesso) e sobe elegantemente à direita,
                afinando até as bordas. */}
            <path
              fill="url(#ct-body)"
              d="M0,40
                 C 300,28 560,22 760,30
                 C 980,38 1200,34 1440,42
                 L 1440,58
                 C 1260,64 1120,68 1000,76
                 C 880,84 800,98 700,122
                 C 620,142 550,172 460,172
                 C 380,172 320,140 250,116
                 C 170,88 90,64 0,58
                 Z"
            />

            {/* ===== EXTENSÃO ORGÂNICA — uma só, larga e claramente fundida
                ao lobo (uma língua de calda, não uma gota). Base do lobo
                (~x=430–490) que se estende suavemente para baixo. ===== */}
            <path
              fill="url(#ct-body)"
              d="M418,164
                 C 410,184 420,202 458,206
                 C 496,202 506,184 498,164
                 C 470,172 446,172 418,164 Z"
            />

            {/* ===== BRILHO glossy sob a borda superior ===== */}
            <path
              fill="url(#ct-gloss)"
              d="M0,44
                 C 300,32 560,26 760,34
                 C 980,42 1200,38 1440,46
                 L 1440,60
                 C 1200,54 980,58 760,50
                 C 560,44 300,50 0,60
                 Z"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
