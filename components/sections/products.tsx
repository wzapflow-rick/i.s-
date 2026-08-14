"use client";

import Image from "next/image";
import { GELATO_FORMATS, FUTURE_CATEGORY } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";

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
          <Reveal>
            <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
              O produto
            </p>
            <h2 className="max-w-xl font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Um gelato. Dois formatos. Feito para o seu negócio.
            </h2>
          </Reveal>
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
            <Reveal key={format.slug} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-500 hover:border-line">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={format.image.src}
                    alt={format.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105"
                    style={{ objectPosition: format.image.objectPosition }}
                  />
                  <span className="absolute right-5 top-5 flex size-16 items-center justify-center rounded-full bg-background/90 font-serif text-xl tracking-tight text-foreground backdrop-blur-sm">
                    {format.size}
                  </span>
                  {format.image.placeholder && (
                    <span className="absolute left-5 top-5 rounded-full bg-background/80 px-3 py-1 font-sans text-[0.56rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
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
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col items-start gap-3 rounded-lg border border-dashed border-line bg-card/40 p-8 sm:flex-row sm:items-center sm:justify-between">
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
