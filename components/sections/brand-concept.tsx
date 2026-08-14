"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";

/**
 * SEÇÃO 02 — O CONCEITO i.sí
 * Progressão conduzida por scroll (funciona igual em desktop e mobile, sem
 * depender de hover): DOCE → SALGADO → DOCE + SALGADO → i.sí → i.sí GELATO.
 * Cada estado aparece sozinho, centralizado — nunca sobrepõe o anterior,
 * garantindo leitura clara em qualquer largura de tela.
 */
const STAGES = 5;
const ease = [0.22, 1, 0.36, 1] as const;

export function BrandConcept() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  // Progresso do trilho alto: 0 quando o topo encosta no topo da viewport,
  // 1 quando o fim do trilho encosta no fim — exatamente a faixa "pinada".
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(Math.floor(v * STAGES), STAGES - 1);
    setStage(next);
  });

  return (
    <section id="conceito" className="border-t border-border bg-surface">
      {/* Trilho alto que sustenta o conteúdo fixado enquanto os estados passam. */}
      <div ref={trackRef} className="relative h-[240vh] lg:h-[280vh]">
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-12">
              {/* Coluna editorial */}
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                    O conceito
                  </p>
                </Reveal>
                <SplitWords
                  as="h2"
                  text="i.sí nasceu para combinar."
                  className="block font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl"
                />
                <Reveal delay={0.1}>
                  <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-muted-foreground">
                    <p className="font-serif text-xl italic leading-relaxed text-foreground">
                      Doce com salgado. Clássico com inesperado. Produto com
                      oportunidade.
                    </p>
                    <p>
                      Porque cada combinação pode abrir uma nova possibilidade
                      para o seu negócio.
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* Palco da progressão — um estado por vez, sem sobreposição. */}
              <div className="lg:col-span-7">
                <div className="relative flex h-[46vh] min-h-[300px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[56vh]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stage}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -18 }}
                      transition={{ duration: 0.45, ease }}
                      className="absolute inset-0 flex items-center justify-center px-6 text-center"
                    >
                      <StageContent stage={stage} />
                    </motion.div>
                  </AnimatePresence>

                  {/* moldura fina de canto — detalhe editorial */}
                  <span className="pointer-events-none absolute left-5 top-5 h-6 w-6 border-l border-t border-line" />
                  <span className="pointer-events-none absolute bottom-5 right-5 h-6 w-6 border-b border-r border-line" />

                  {/* Indicador de progressão */}
                  <div
                    className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2"
                    aria-hidden="true"
                  >
                    {Array.from({ length: STAGES }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === stage
                            ? "w-6 bg-accent"
                            : "w-1.5 bg-line"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-center font-sans text-[0.62rem] uppercase tracking-eyebrow text-muted-foreground">
                  Role para combinar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Conteúdo de cada estado da progressão. */
function StageContent({ stage }: { stage: number }) {
  const wordClass =
    "font-serif uppercase tracking-wide-editorial text-foreground text-5xl sm:text-7xl";

  switch (stage) {
    case 0:
      return <span className={wordClass}>Doce</span>;
    case 1:
      return <span className={wordClass}>Salgado</span>;
    case 2:
      return (
        <span className="font-serif uppercase tracking-wide-editorial text-foreground text-3xl sm:text-6xl">
          Doce <span className="text-accent">+</span> Salgado
        </span>
      );
    case 3:
      return <Logo className="text-7xl sm:text-8xl" />;
    case 4:
      return <Logo className="text-7xl sm:text-8xl" showTagline />;
    default:
      return null;
  }
}
