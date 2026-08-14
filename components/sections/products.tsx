"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent } from "react";
import { GELATO_FORMATS, FUTURE_CATEGORY, type GelatoFormat } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { ImageReveal } from "@/components/ui/image-reveal";

/**
 * SEÇÃO 04 — PRODUTOS
 * Foco no produto confirmado: gelato artesanal 100% leite integral,
 * priorizando os formatos de 5L e 10L. Arquitetura pronta para novas
 * categorias, sem inventar linhas não confirmadas.
 */
export function Products() {
  return (
    <section id="produtos" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                O produto
              </p>
            </Reveal>
            <SplitWords
              as="h2"
              text="Um gelato. Dois formatos. Feito para o seu negócio."
              className="block max-w-xl font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md font-sans text-base leading-relaxed text-muted-foreground lg:pb-2">
              Nosso foco é fazer um gelato artesanal excepcional — 100% leite
              integral — e entregá-lo no formato certo para cada fase da sua
              operação.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {GELATO_FORMATS.map((format, i) => (
            <ProductCard key={format.slug} format={format} index={i} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col items-start gap-3 rounded-lg border border-dashed border-line bg-card/40 p-8 transition-colors duration-500 hover:border-accent-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-sans text-[0.6rem] uppercase tracking-eyebrow text-muted-foreground">
                {FUTURE_CATEGORY.label}
              </p>
              <p className="mt-2 font-serif text-2xl tracking-tight text-foreground">
                {FUTURE_CATEGORY.headline}
              </p>
            </div>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
              {FUTURE_CATEGORY.detail}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Card de produto com micro-parallax: a foto acompanha sutilmente o ponteiro
 * e o card ganha um leve tilt 3D. Molas suaves mantêm tudo premium, não brusco.
 */
function ProductCard({ format, index }: { format: GelatoFormat; index: number }) {
  // -0.5..0.5 relativo ao centro do card
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 150, damping: 20, mass: 0.4 });

  const imgX = useTransform(sx, [-0.5, 0.5], ["-14px", "14px"]);
  const imgY = useTransform(sy, [-0.5, 0.5], ["-14px", "14px"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-2.5deg", "2.5deg"]);
  const rotateX = useTransform(sy, [-0.5, 0.5], ["2.5deg", "-2.5deg"]);

  function handleMove(e: PointerEvent<HTMLElement>) {
    // Só reagimos a ponteiro fino (mouse); toque não dispara o tilt.
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <Reveal delay={index * 0.1}>
      <motion.article
        onPointerMove={handleMove}
        onPointerLeave={reset}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,box-shadow] duration-500 hover:border-accent-soft hover:shadow-[0_24px_60px_-32px_rgba(28,24,21,0.4)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <ImageReveal className="absolute inset-0">
            {/* Camada de micro-parallax: acompanha sutilmente o ponteiro.
                inset negativo dá folga para o deslocamento sem revelar bordas. */}
            <motion.div
              style={{ x: imgX, y: imgY }}
              className="absolute inset-[-7%]"
            >
              <Image
                src={format.image.src}
                alt={format.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
                style={{ objectPosition: format.image.objectPosition }}
              />
            </motion.div>
          </ImageReveal>
          <motion.span
            className="absolute right-5 top-5 z-10 flex size-16 items-center justify-center rounded-full bg-background/90 font-serif text-xl tracking-tight text-foreground backdrop-blur-sm transition-colors duration-500 group-hover:bg-accent group-hover:text-background"
            whileHover={{ rotate: -6 }}
          >
            {format.size}
          </motion.span>
          {format.image.placeholder && (
            <span className="absolute left-5 top-5 z-10 rounded-full bg-background/80 px-3 py-1 font-sans text-[0.56rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
              Foto ilustrativa
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-8">
          <h3 className="font-serif text-3xl tracking-tight text-foreground">
            {format.name}
          </h3>
          <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
            {format.description}
          </p>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <div>
              <p className="font-sans text-[0.6rem] uppercase tracking-eyebrow text-muted-foreground">
                Ideal para
              </p>
              <p className="mt-1 font-sans text-sm text-foreground">
                {format.bestFor}
              </p>
            </div>
            <a
              href="#formulario"
              className="flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wide-editorial text-accent"
            >
              Quero este formato
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
