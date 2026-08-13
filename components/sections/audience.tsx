"use client";

import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Açaíterias", index: "01" },
  { name: "Sorveterias", index: "02" },
  { name: "Gelaterias", index: "03" },
  { name: "Lojas de sobremesas", index: "04" },
  { name: "Cafeterias", index: "05" },
  { name: "Mercados", index: "06" },
];

/**
 * SEÇÃO 03 — PARA QUEM VENDEMOS
 * Galeria editorial: lista tipográfica grande com hover, não 6 cards iguais.
 */
export function Audience() {
  return (
    <section id="audiencia" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                Para quem vendemos
              </p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Você vende. A gente pensa no que vem depois.
              </h2>
              <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
                A i.sí foi criada para empresas que trabalham com produtos
                gelados, sobremesas e experiências que fazem o cliente voltar.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Stagger className="border-t border-border">
              {CATEGORIES.map((cat) => (
                <RevealItem key={cat.name}>
                  <div
                    className={cn(
                      "group flex items-center justify-between border-b border-border py-6 sm:py-7",
                      "transition-colors duration-500 hover:bg-surface/60",
                    )}
                  >
                    <div className="flex items-baseline gap-5 sm:gap-8">
                      <span className="font-sans text-[0.7rem] tabular-nums text-muted-foreground">
                        {cat.index}
                      </span>
                      <span className="font-serif text-2xl tracking-tight text-foreground transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl">
                        {cat.name}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="translate-x-2 font-serif text-xl text-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
