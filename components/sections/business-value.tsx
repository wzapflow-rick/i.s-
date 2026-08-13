"use client";

import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";

const PILLARS = [
  {
    title: "Mais mix",
    text: "Amplie sua oferta sem complicar sua operação.",
  },
  {
    title: "Mais experiência",
    text: "Produtos que ajudam a tornar o consumo mais desejável.",
  },
  {
    title: "Mais possibilidades",
    text: "Crie combinações, novos produtos e novas oportunidades.",
  },
  {
    title: "Mais parceria",
    text: "Atendimento próximo e relacionamento comercial.",
  },
];

/**
 * SEÇÃO 05 — VALOR PARA O NEGÓCIO
 * Quatro pilares, layout editorial minimalista.
 */
export function BusinessValue() {
  return (
    <section className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal>
          <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent-soft">
            Valor para o negócio
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-balance text-ink-foreground sm:text-5xl">
            Não é só produto. É possibilidade.
          </h2>
        </Reveal>

        <Stagger className="mt-16 grid gap-px overflow-hidden rounded-lg border border-ink-foreground/15 bg-ink-foreground/15 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <RevealItem key={p.title}>
              <div className="flex h-full flex-col justify-between bg-ink p-8 lg:p-9">
                <span className="font-serif text-5xl text-ink-foreground/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-16">
                  <h3 className="font-serif text-2xl tracking-tight text-ink-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink-foreground/60">
                    {p.text}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
