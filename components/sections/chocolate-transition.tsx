"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * TRANSIÇÃO SUAVE — do fim da cena de sabores (que repousa em #171310) o
 * ambiente esquenta em chocolate e escorre, via PNG realista de chocolate
 * derretido, para o bege da seção O PRODUTO. Sem emenda dura.
 * ---------------------------------------------------------------------------
 * COMO A EMENDA SOME:
 *  - O TOPO da massa começa EXATAMENTE em #171310 — a mesma cor em que a cena
 *    de sabores repousa no último estado. Topo = fundo anterior → sem linha.
 *  - A massa esquenta para um chocolate quente (#3a241a) descendo.
 *  - A borda derretida + gotas é o PNG real (fundo transparente): a parte
 *    transparente acima da onda mostra o chocolate da massa (contínuo) e as
 *    gotas pingam sobre o bege da próxima seção.
 *
 * Determinístico (sem Math.random/Date) → SSR = client, sem erro de hidratação.
 * Só transform/opacity dirigidos pelo scroll (GPU).
 */

// Cor em que a BASE da cena de sabores repousa por padrão (1º estado =
// chocolate). O topo da massa começa EXATAMENTE nela → encontro invisível.
const SCENE_REST = "#3b2118";
// Chocolate quente para onde a massa esquenta descendo (casa com o PNG).
const CHOC_WARM = "#3a241a";

const MELT_BODY = `linear-gradient(180deg, ${SCENE_REST} 0%, #3a2118 40%, ${CHOC_WARM} 100%)`;

export function ChocolateTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  // O escorrer acompanha o scroll: a calda "desce" um pouco e a frase surge.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });

  const dripYMV = useTransform(scrollYProgress, [0, 0.85], ["-4%", "0%"]);
  const glossMV = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const dripY = reduced ? "0%" : dripYMV;
  const gloss = reduced ? 1 : glossMV;

  return (
    // Sobe levemente sobre o fim da cena para garantir que o topo #171310
    // encoste no fundo anterior sem qualquer fresta.
    <div aria-hidden ref={ref} className="relative z-20 -mt-px bg-transparent">
      {/* ===== MASSA DE CHOCOLATE (esquenta descendo) ===== */}
      <div
        className="relative h-[280px] w-full sm:h-[330px] lg:h-[380px]"
        style={{ backgroundImage: MELT_BODY }}
      >
        {/* Brilho glossy sutil que surge no scroll */}
        <motion.div
          style={{ opacity: gloss }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(122,74,48,0) 0%, rgba(140,86,54,0.28) 60%, rgba(122,74,48,0) 100%)",
            }}
          />
        </motion.div>

        {/* Frase discreta — na parte alta do chocolate, acima das gotas */}
        <div className="absolute inset-x-0 top-[42%] flex items-center justify-center px-6">
          <p className="flex items-center gap-4 font-serif text-sm tracking-[0.22em] text-[#c9ad78] sm:gap-5 sm:text-base">
            <span aria-hidden className="hidden h-px w-8 bg-[#c9ad78]/45 sm:block" />
            FEITO PARA COMBINAR.
            <span aria-hidden className="hidden h-px w-8 bg-[#c9ad78]/45 sm:block" />
          </p>
        </div>
      </div>

      {/* ===== CALDA REAL DERRETENDO (PNG, escorre sobre o bege) =====
          bottom-0 + translateY: a onda superior do PNG alinha no fim da massa
          (transparente acima = chocolate contínuo) e as gotas pingam no bege. */}
      <motion.img
        src="/images/chocolate-drip.png"
        alt=""
        style={{ y: dripY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full translate-y-[64%] select-none"
      />
    </div>
  );
}
