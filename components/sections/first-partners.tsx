"use client";

import { Reveal } from "@/components/ui/reveal";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * SEÇÃO — PARCERIAS SELECIONADAS
 * Fundo escuro premium. Comunica exclusividade por seleção criteriosa,
 * como uma marca consolidada — sem narrativa de "início", sem quantificar
 * parceiros e sem escassez agressiva.
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
                A i.sí trabalha com um grupo seleto de parceiros. Cada parceria
                é construída de perto, com exclusividade e o cuidado que um
                produto premium exige — não somos um gelato para estar em toda
                esquina.
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

          {/* Coluna de assinatura — seleção criteriosa, sem quantificar */}
          <div className="lg:col-span-5">
            <Reveal delay={0.12}>
              <div className="relative flex flex-col items-start border-t border-ink-foreground/15 pt-10 lg:items-end lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0 lg:text-right">
                <span className="font-serif text-[2.4rem] italic leading-[1.1] tracking-tight text-ink-foreground sm:text-[3rem]">
                  Seleção
                  <br />
                  por critério.
                </span>
                <span className="mt-6 font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink-foreground/60">
                  Parcerias exclusivas
                </span>
                <span className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-ink-foreground/45 lg:max-w-[16rem]">
                  Não abrimos parceria para todos. Cada negócio é avaliado pelo
                  perfil, pela estrutura e pela forma como pretende trabalhar o
                  nosso gelato.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
