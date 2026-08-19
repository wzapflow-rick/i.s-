"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { GELATO_FORMATS, type GelatoFormat } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";

/**
 * SEÇÃO 04 — PRODUTOS ("Dois formatos")
 * Bloco escuro e editorial: título à esquerda, duas embalagens reais
 * (pote 5L branco e 10L preto) apresentadas como produto sobre o fundo
 * escuro. Foco no que está confirmado — gelato artesanal 100% leite
 * integral, nos formatos 5L e 10L.
 */
export function Products() {
  return (
    <section
      id="produtos"
      className="bg-ink text-ink-foreground"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          {/* ===== Coluna editorial ===== */}
          <div>
            <Reveal>
              <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent-soft">
                O produto
              </p>
            </Reveal>
            <h2 className="font-serif text-4xl leading-[1.04] tracking-tight text-balance sm:text-5xl">
              <SplitWords as="span" text="Dois formatos." className="block" />
              <SplitWords
                as="span"
                text="O mesmo padrão de excelência."
                className="mt-1 block text-ink-foreground/80"
                delay={0.18}
              />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-7 max-w-sm font-sans text-base leading-relaxed text-ink-foreground/60">
                Escolha o que faz mais sentido para o ritmo do seu negócio.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <p className="mt-10 flex items-center gap-3 font-sans text-[0.66rem] uppercase tracking-wide-editorial text-ink-foreground/45">
                <MilkDrop />
                Produzido com 100% leite integral
              </p>
            </Reveal>
          </div>

          {/* ===== Vitrine de embalagens ===== */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10">
            {GELATO_FORMATS.map((format, i) => (
              <ProductStage key={format.slug} format={format} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Embalagem apresentada como produto: a foto flutua no fundo escuro
 * (uma vinheta radial funde a borda da imagem na cor da seção), e abaixo
 * ficam o formato e a descrição, em ritmo editorial.
 */
function ProductStage({
  format,
  index,
}: {
  format: GelatoFormat;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.12}>
      <div className="group flex flex-col">
        <motion.div
          className="relative aspect-square overflow-hidden"
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
          <Image
            src={format.image.src}
            alt={format.image.alt}
            fill
            sizes="(max-width: 1024px) 45vw, 32vw"
            className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
            style={{ objectPosition: format.image.objectPosition }}
          />
          {/* Vinheta: funde as bordas da foto no fundo escuro da seção,
              para o pote parecer flutuar (sem retângulo aparente). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 68% 66% at 50% 47%, transparent 52%, var(--ink) 100%)",
            }}
          />
        </motion.div>

        <div className="mt-5 border-t border-ink-foreground/12 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-4xl leading-none tracking-tight">
              {format.size}
            </h3>
            <span className="hidden font-sans text-[0.58rem] uppercase tracking-eyebrow text-accent-soft sm:inline">
              {format.bestFor.split(".")[0]}
            </span>
          </div>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink-foreground/55">
            {format.description}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/** Gota de leite — ícone minimalista para o selo "100% leite integral". */
function MilkDrop() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z" />
    </svg>
  );
}
