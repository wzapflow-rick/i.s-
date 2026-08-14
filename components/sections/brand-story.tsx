"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES } from "@/lib/site-images";

/**
 * SEÇÃO 07 — A MARCA / POSICIONAMENTO
 * Copy de posicionamento no presente — sem narrativa de origem, sem inventar
 * autoridade, fatos, números ou anos. Ampliar apenas com dados reais.
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
              src={SITE_IMAGES.texture.src}
              alt={SITE_IMAGES.texture.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          {SITE_IMAGES.texture.placeholder && (
            <span className="absolute left-5 top-5 rounded-full bg-background/85 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
              Foto ilustrativa
            </span>
          )}
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
                  {/* Copy de posicionamento — sem narrativa de origem, anos ou
                      números. Ampliar apenas com fatos reais após briefing. */}
                  A i.sí é uma fabricante de gelato artesanal B2B. Mais do que
                  fornecer caixas de 5L e 10L, trabalhamos lado a lado com cada
                  parceiro que coloca o nosso gelato no centro da própria
                  experiência.
                </p>
                <p>
                  Poucos parceiros por vez, um produto 100% leite integral e um
                  posicionamento premium — para quem busca qualidade e não o
                  menor preço.
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
