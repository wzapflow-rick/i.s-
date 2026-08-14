"use client";

import { Reveal } from "@/components/ui/reveal";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * SEÇÃO — PARCERIAS SELECIONADAS
 * Fundo escuro premium. Comunica exclusividade por seletividade
 * (poucos parceiros por escolha), sem narrativa de "início" ou escassez agressiva.
 * Elemento de assinatura: o numeral "4" em serifa de grande escala.
 */
export function FirstPartners() {
  return (
    <section
      id="primeiros-parceiros"
      className="border-t border-border bg-ink text-ink-foreground"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Coluna de conteúdo */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-7 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent-soft">
                Parcerias • Feira de Santana
              </p>
              <h2 className="max-w-2xl font-serif text-[2.6rem] leading-[1.02] tracking-tight text-balance text-ink-foreground sm:text-6xl">
                Trabalhamos com poucos.
                <br />
                <span className="italic text-accent-soft">Por escolha.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-ink-foreground/70">
                A i.sí trabalha com um grupo reduzido de parceiros em Feira de
                Santana. Poucos, escolhidos com cuidado — para que cada parceria
                receba a atenção e a proximidade que merece.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10">
                <CtaButton
                  href="#formulario"
                  variant="secondary"
                  className="border-ink-foreground/30 text-ink-foreground hover:border-ink-foreground hover:bg-ink-foreground/5"
                >
                  Quero me tornar um parceiro
                </CtaButton>
              </div>
            </Reveal>
          </div>

          {/* Coluna do numeral de assinatura */}
          <div className="lg:col-span-5">
            <Reveal delay={0.12}>
              <div className="relative flex flex-col items-start border-t border-ink-foreground/15 pt-10 lg:items-end lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0 lg:text-right">
                <span className="font-serif text-[9rem] leading-[0.8] tracking-tight text-ink-foreground sm:text-[12rem]">
                  4
                </span>
                <span className="mt-4 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink-foreground/60">
                  Parceiros por vez
                </span>
                <span className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-ink-foreground/45 lg:max-w-[16rem]">
                  Um número propositalmente pequeno — para manter a proximidade
                  e o mesmo cuidado com cada parceiro.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
