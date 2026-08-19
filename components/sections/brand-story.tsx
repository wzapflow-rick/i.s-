"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
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
    <section id="marca" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-2">
        <div ref={ref} className="relative min-h-[60vh] overflow-hidden lg:min-h-full">
          <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
            <ImageReveal className="absolute inset-0">
              <Image
                src={SITE_IMAGES.texture.src}
                alt={SITE_IMAGES.texture.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{
                  objectPosition: "center 78%",
                  // Reduz a temperatura/saturação quente sem virar filtro marrom:
                  // dessatura levemente e esfria os tons, mantendo foto real.
                  filter: "saturate(0.82) hue-rotate(-6deg) brightness(1.02)",
                }}
              />
            </ImageReveal>
          </motion.div>
          {SITE_IMAGES.texture.placeholder && (
            <span className="absolute left-5 top-5 rounded-full bg-background/85 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
              Foto ilustrativa
            </span>
          )}
        </div>

        <div className="flex items-center px-5 py-24 sm:px-8 lg:px-16 lg:py-36">
          <div className="max-w-md">
            <Reveal>
              {/* Detalhe editorial: numeração da seção + linha fina */}
              <div className="mb-8 flex items-center gap-4">
                <span className="font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                  A marca
                </span>
                <span className="h-px flex-1 bg-foreground/12" aria-hidden />
                <span className="font-sans text-[0.68rem] tracking-eyebrow text-muted-foreground/60">
                  04
                </span>
              </div>
              <h2 className="font-serif text-[2.5rem] leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl">
                A i.sí nasceu para combinar.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 space-y-4 font-sans text-[0.95rem] leading-relaxed text-muted-foreground">
                <p>
                  {/* Copy de posicionamento — sem narrativa de origem, anos ou
                      números. Ampliar apenas com fatos reais após briefing. */}
                  A i.sí é uma fabricante de gelato artesanal B2B. Trabalhamos
                  próximos de negócios que querem oferecer mais.
                </p>
                <p>
                  Trabalhamos com poucos parceiros, escolhidos com critério.
                  Porque proximidade também faz parte do nosso produto.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex items-center gap-4">
                <span className="h-8 w-px bg-accent/50" aria-hidden />
                <p className="font-serif text-2xl italic leading-snug text-foreground sm:text-[1.7rem]">
                  Poucos parceiros. Muito cuidado.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
