"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/ui/reveal";

/**
 * SEÇÃO 02 — O CONCEITO i.sí
 * Interação central: DOCE e SALGADO se movem um em direção ao outro
 * conforme o scroll; ao se encontrarem, revelam o wordmark i.sí.
 * Scroll-driven → funciona igual em desktop e mobile, sem depender de hover.
 */
export function BrandConcept() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Palavras se aproximam do centro.
  const doceX = useTransform(scrollYProgress, [0, 0.75], ["-42%", "0%"]);
  const salgadoX = useTransform(scrollYProgress, [0, 0.75], ["42%", "0%"]);
  const wordsOpacity = useTransform(scrollYProgress, [0.55, 0.85], [1, 0]);
  const wordsScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.9]);

  // Wordmark aparece no encontro.
  const logoOpacity = useTransform(scrollYProgress, [0.68, 0.92], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0.68, 0.95], [0.85, 1]);

  return (
    <section id="conceito" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Coluna editorial */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                O conceito
              </p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Por que i.sí?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-muted-foreground">
                <p>
                  Porque acreditamos que as melhores ideias surgem quando coisas
                  diferentes se encontram.
                </p>
                <p className="font-serif text-xl italic leading-relaxed text-foreground">
                  Doce com salgado. Clássico com inesperado. Produto com
                  oportunidade.
                </p>
                <p>
                  i.sí nasceu dessa ideia: combinar para criar algo novo.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Interação DOCE + SALGADO → i.sí */}
          <div ref={ref} className="lg:col-span-7">
            <div className="relative flex h-[60vh] min-h-[380px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
              {reduce ? (
                <Logo className="text-6xl sm:text-7xl" showTagline />
              ) : (
                <>
                  <motion.span
                    style={{ x: doceX, opacity: wordsOpacity, scale: wordsScale }}
                    className="absolute font-serif text-3xl uppercase tracking-wide-editorial text-foreground sm:text-5xl"
                  >
                    Doce
                  </motion.span>
                  <motion.span
                    aria-hidden="true"
                    style={{ opacity: wordsOpacity }}
                    className="absolute font-serif text-2xl text-accent sm:text-4xl"
                  >
                    +
                  </motion.span>
                  <motion.span
                    style={{ x: salgadoX, opacity: wordsOpacity, scale: wordsScale }}
                    className="absolute font-serif text-3xl uppercase tracking-wide-editorial text-foreground sm:text-5xl"
                  >
                    Salgado
                  </motion.span>

                  <motion.div
                    style={{ opacity: logoOpacity, scale: logoScale }}
                    className="absolute"
                  >
                    <Logo className="text-7xl sm:text-8xl" showTagline />
                  </motion.div>
                </>
              )}

              {/* moldura fina de canto — detalhe editorial */}
              <span className="pointer-events-none absolute left-5 top-5 h-6 w-6 border-l border-t border-line" />
              <span className="pointer-events-none absolute bottom-5 right-5 h-6 w-6 border-b border-r border-line" />
            </div>
            <p className="mt-4 text-center font-sans text-[0.62rem] uppercase tracking-eyebrow text-muted-foreground">
              Role para combinar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
