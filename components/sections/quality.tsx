"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { SITE_IMAGES } from "@/lib/site-images";

const PILLARS = [
  {
    label: "100% leite integral",
    detail: "Corpo, textura e cremosidade como base.",
  },
  {
    label: "Produção artesanal",
    detail: "Cuidado em cada etapa, do preparo ao produto final.",
  },
  {
    label: "Qualidade que aparece",
    detail: "Porque um bom produto não precisa se explicar.",
  },
];

/**
 * SEÇÃO DE QUALIDADE
 * Fundo escuro (ink) para reforçar desejo e posicionamento premium.
 * Três pilares + destaque de formato (caixas de 5L e 10L).
 */
export function Quality() {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
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
            Qualidade
          </p>
          <h2 className="max-w-3xl font-serif text-4xl leading-[1.06] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Feito para ser sentido logo na primeira colherada.
          </h2>
        </Reveal>

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

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-start gap-6 border-t border-ink-foreground/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-sans text-sm leading-relaxed text-ink-foreground/70">
              Disponível em formatos pensados para a operação do seu negócio —
              da vitrine selecionada ao alto giro.
            </p>
            <div className="flex items-center gap-4">
              <span className="rounded-full border border-ink-foreground/25 px-6 py-3 font-sans text-sm uppercase tracking-wide-editorial text-ink-foreground">
                Caixas de 5L
              </span>
              <span className="rounded-full border border-ink-foreground/25 px-6 py-3 font-sans text-sm uppercase tracking-wide-editorial text-ink-foreground">
                Caixas de 10L
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
