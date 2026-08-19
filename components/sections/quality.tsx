"use client";

import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";

/**
 * SEÇÃO 05 — DIFERENCIAL ("Qualidade começa na base")
 * Pausa editorial sofisticada entre Produtos e Possibilidades.
 * Fundo preto neutro, título dominante e 4 pilares em colunas com
 * ícones lineares discretos em dourado sutil. Sem fotografia de fundo.
 */

/** Ícones lineares minimalistas — traço fino, herdam a cor via currentColor. */
const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Gota — 100% leite integral. */
function DropIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3.5c3 4 5 6.4 5 9.2a5 5 0 0 1-10 0c0-2.8 2-5.2 5-9.2Z" />
    </svg>
  );
}

/** Batedor / whisk — produção artesanal. */
function WhiskIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v9" />
      <path d="M8.5 5.2c0 3.4 1.6 6.8 3.5 6.8s3.5-3.4 3.5-6.8" />
      <path d="M10.2 4.2v7.2M13.8 4.2v7.2" />
      <path d="M12 12l-1.4 8.5h2.8L12 12Z" />
    </svg>
  );
}

/** Selo de verificação — qualidade consistente. */
function SealIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3.2l2.1 1.5 2.5-.3 1 2.4 2.1 1.5-.6 2.5.6 2.5-2.1 1.5-1 2.4-2.5-.3L12 20.8l-2.1-1.5-2.5.3-1-2.4L4.3 15.7l.6-2.5-.6-2.5 2.1-1.5 1-2.4 2.5.3L12 3.2Z" />
      <path d="M9.3 12l1.9 1.9 3.5-3.8" />
    </svg>
  );
}

/** Alvo / target — pensado para sua operação. */
function TargetIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const PILLARS = [
  {
    Icon: DropIcon,
    label: "100% leite integral",
    detail: "Uma base que entrega corpo, textura e cremosidade.",
  },
  {
    Icon: WhiskIcon,
    label: "Produção artesanal",
    detail: "Cuidado no processo e atenção em cada detalhe.",
  },
  {
    Icon: SealIcon,
    label: "Qualidade consistente",
    detail:
      "Porque o cliente precisa gostar da primeira vez. E da próxima também.",
  },
  {
    Icon: TargetIcon,
    label: "Pensado para sua operação",
    detail:
      "Um produto premium que precisa funcionar também no ritmo do seu negócio.",
  },
];

export function Quality() {
  return (
    <section
      id="diferencial"
      className="text-ink-foreground"
      // Preto neutro, consistente com a seção de Produtos.
      style={{ backgroundColor: "#0c0b0a" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        {/* ===== Cabeçalho — título dominante ===== */}
        <div className="max-w-2xl">
          <Reveal>
            <p className="mb-5 font-sans text-[0.66rem] uppercase tracking-eyebrow text-accent-soft">
              Diferencial
            </p>
          </Reveal>
          <SplitWords
            as="h2"
            text="Qualidade começa na base."
            className="block font-serif text-[2rem] leading-[1.04] tracking-tight text-balance text-[#f5f3ee] sm:text-5xl lg:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-[#b3aca3] sm:text-base">
              O cuidado está no produto, no processo e na forma como ele chega
              até você.
            </p>
          </Reveal>
        </div>

        {/* ===== 4 pilares — 4 colunas no desktop, 2x2 no mobile ===== */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-12">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.08}>
              <div className="flex flex-col">
                <span className="text-accent-soft/80" aria-hidden="true">
                  <pillar.Icon />
                </span>
                <h3 className="mt-5 font-serif text-lg leading-snug tracking-tight text-[#f5f3ee] sm:text-xl">
                  {pillar.label}
                </h3>
                <p className="mt-3 font-sans text-[0.82rem] leading-relaxed text-[#a49d94] sm:text-sm">
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
