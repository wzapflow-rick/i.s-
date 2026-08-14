"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

/**
 * SEÇÃO 07 — AUTORIDADE / HISTÓRIA
 * Copy PROVISÓRIA — não inventar fatos, números ou anos de atuação.
 * Placeholders claramente preparados para substituição.
 */
export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-2">
        <div ref={ref} className="relative min-h-[60vh] overflow-hidden lg:min-h-full">
          <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
            <Image
              src="/images/story-texture.png"
              alt="Textura macro de gelato cremoso"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <span className="absolute left-5 top-5 rounded-full bg-background/85 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
            Placeholder
          </span>
        </div>

        <div className="flex items-center px-5 py-24 sm:px-8 lg:px-16 lg:py-36">
          <div>
            <Reveal>
              <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                A marca
              </p>
              <h2 className="max-w-xl font-serif text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl">
                Mais que uma marca de gelato: uma fábrica parceira do seu
                negócio.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 max-w-xl space-y-5 font-sans text-base leading-relaxed text-muted-foreground">
                <p>
                  A i.sí é uma fabricante de gelato artesanal B2B. Não vendemos
                  apenas caixas de 5L e 10L — construímos relações próximas com
                  um grupo selecionado de parceiros que colocam nosso gelato no
                  centro da própria experiência.
                </p>
                <p>
                  {/* TODO(cliente): substituir por história, trajetória e
                      diferenciais reais após briefing. */}
                  Por isso trabalhamos com poucos parceiros por vez: exclusividade,
                  acompanhamento de perto e um produto 100% leite integral, pensado
                  para quem busca posicionamento premium — não o menor preço.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-8 font-serif text-xl italic text-foreground">
                Novas combinações. Novas possibilidades.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
