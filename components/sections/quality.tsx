"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { SITE_IMAGES } from "@/lib/site-images";

const PILLARS = [
  {
    label: "100% leite integral",
    detail: "Uma base que entrega corpo, textura e cremosidade.",
  },
  {
    label: "Produção artesanal",
    detail: "Cuidado no processo e atenção ao resultado.",
  },
  {
    label: "Qualidade consistente",
    detail:
      "Porque o cliente precisa gostar da primeira vez. E da próxima também.",
  },
];

/**
 * SEÇÃO DE QUALIDADE
 * Fundo escuro (ink) para reforçar desejo e posicionamento premium.
 * Três pilares + destaque de formato (caixas de 5L e 10L).
 */
export function Quality() {
  return (
    <section
      id="diferencial"
      className="relative overflow-hidden bg-ink text-ink-foreground"
    >
      <div className="absolute inset-0 opacity-[0.22]">
        <Image
          src={SITE_IMAGES.texture.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 28%" }}
          aria-hidden="true"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/88 to-ink" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal>
          <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
            Diferencial
          </p>
        </Reveal>
        <SplitWords
          as="h2"
          text="O que faz um bom gelato aparecer na experiência?"
          className="block max-w-3xl font-serif text-4xl leading-[1.06] tracking-tight text-balance sm:text-5xl lg:text-6xl"
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-ink-foreground/15 bg-ink-foreground/10 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.1}>
              <div className="flex h-full flex-col bg-ink p-8 lg:p-10">
                <span className="font-serif text-2xl leading-tight tracking-tight text-ink-foreground sm:text-[1.7rem]">
                  {pillar.label}
                </span>
                <p className="mt-5 font-sans text-sm leading-relaxed text-ink-foreground/65">
                  {pillar.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
