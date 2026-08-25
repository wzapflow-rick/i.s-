"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { GELATO_FORMATS, type GelatoFormat } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import ScrollVelocity from "@/components/ui/scroll-velocity";

/**
 * SEÇÃO 04 — PRODUTOS ("Dois formatos")
 * Palco escuro e neutro onde as embalagens (pote 5L branco e 10L preto)
 * são o protagonista: potes grandes, hierarquia compacta
 * imagem → volume → benefício → descrição, e uma assinatura horizontal
 * "100% leite integral" fechando a seção.
 */
export function Products() {
  return (
    <section
      id="produtos"
      // Preto neutro (menos marrom que o --ink) para o produto dominar.
      className="text-ink-foreground"
      style={{ backgroundColor: "#100f0e" }}
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {/* ===== Cabeçalho compacto ===== */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-9 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="mb-4 font-sans text-[0.66rem] uppercase tracking-eyebrow text-accent-soft">
                O produto
              </p>
            </Reveal>
            {/* Headline ~25% menor, mantida em duas linhas naturais. */}
            <h2 className="font-serif text-[1.5rem] leading-[1.08] tracking-tight text-balance text-[#f5f3ee] sm:text-[2.1rem] lg:text-4xl">
              <SplitWords as="span" text="Dois formatos." className="block" />
              <SplitWords
                as="span"
                text="O mesmo padrão de excelência."
                className="block text-[#f5f3ee]/70"
                delay={0.18}
              />
            </h2>
          </div>
          <Reveal delay={0.25}>
            <p className="max-w-xs font-sans text-sm leading-relaxed text-[#b3aca3] lg:text-right">
              Escolha o que faz mais sentido para o ritmo do seu negócio.
            </p>
          </Reveal>
        </div>

        {/* ===== Vitrine: os potes como protagonistas ===== */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-12 lg:mt-14 lg:gap-20">
          {GELATO_FORMATS.map((format, i) => (
            <ProductStage key={format.slug} format={format} index={i} />
          ))}
        </div>

        {/* ===== Assinatura horizontal da seção (Sync Scroll) ===== */}
        <Reveal delay={0.2}>
          <div className="mt-14 border-t border-white/10 pt-7 lg:mt-20">
            <ScrollVelocity
              words={["Produzido com 100% leite integral"]}
              baseVelocity={22}
              gap={28}
              textColor="#8f8981"
              className="h-6"
              font={{
                fontFamily: "inherit",
                fontSize: "0.68rem",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
              separator
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Embalagem como protagonista: pote grande, apoiado por uma sombra elíptica
 * no chão (não flutua), com volume → benefício → descrição em ritmo próximo.
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
      <motion.div
        className="group flex flex-col items-center text-center"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
      >
        {/* Palco do pote */}
        <div className="relative flex w-full items-end justify-center">
          {/* Sombra de apoio no chão */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[6%] left-1/2 h-[8%] w-[62%] -translate-x-1/2 rounded-[100%]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 70%)",
            }}
          />
          <div className="relative aspect-square w-full max-w-[420px]">
            <Image
              src={format.image.src}
              alt={format.image.alt}
              fill
              sizes="(max-width: 1024px) 46vw, 420px"
              className="object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)] transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bloco de texto compacto sob o pote */}
        <div className="mt-4 flex flex-col items-center">
          <h3 className="font-serif text-5xl leading-none tracking-tight text-[#f5f3ee] sm:text-6xl">
            {format.size}
          </h3>
          <span className="mt-3 font-sans text-[0.58rem] uppercase tracking-eyebrow text-accent-soft">
            {format.bestFor.split(".")[0]}
          </span>
          <p className="mt-3 max-w-[15rem] font-sans text-sm leading-relaxed text-[#a29b92]">
            {format.description}
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}

