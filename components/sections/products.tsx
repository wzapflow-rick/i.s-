"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PRODUCT_LINES, type ProductLine } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const accentText: Record<ProductLine["accent"], string> = {
  acai: "text-acai",
  gelato: "text-gelato",
  cafe: "text-cafe",
  accent: "text-accent",
};

/**
 * SEÇÃO 04 — PRODUTOS
 * Cada linha: imagem grande, nome, descrição curta e "Ver linha →".
 * Abre um drawer elegante. Estrutura pronta para catálogo real.
 */
export function Products() {
  const [active, setActive] = useState<ProductLine | null>(null);

  return (
    <section id="produtos" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal>
          <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
            Produtos
          </p>
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Feito para criar novas possibilidades.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {PRODUCT_LINES.map((line, i) => (
            <Reveal key={line.slug} delay={i * 0.08}>
              <button
                type="button"
                onClick={() => setActive(line)}
                className="group block w-full overflow-hidden rounded-lg border border-border bg-card text-left transition-colors duration-500 hover:border-line"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={line.image}
                    alt={`Linha de ${line.name} da i.sí`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
                    Placeholder
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 p-6 sm:p-8">
                  <div>
                    <h3 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
                      {line.name}
                    </h3>
                    <p className="mt-2 max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
                      {line.short}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-border px-6 py-4 sm:px-8">
                  <span className={cn("font-sans text-[0.7rem] uppercase tracking-wide-editorial", accentText[line.accent])}>
                    Ver linha
                  </span>
                  <span className="translate-x-0 transition-transform duration-500 group-hover:translate-x-1 text-foreground">
                    →
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <ProductDrawer line={active} onClose={() => setActive(null)} />
    </section>
  );
}

function ProductDrawer({
  line,
  onClose,
}: {
  line: ProductLine | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (line) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [line, onClose]);

  return (
    <AnimatePresence>
      {line && (
        <motion.div
          className="fixed inset-0 z-[60] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Linha de ${line.name}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-background shadow-2xl"
          >
            <div className="relative aspect-[4/3] w-full shrink-0">
              <Image
                src={line.image}
                alt={`Linha de ${line.name} da i.sí`}
                fill
                sizes="450px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-sm transition-colors hover:bg-background"
                aria-label="Fechar painel"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-1 flex-col p-8">
              <p className={cn("font-sans text-[0.62rem] uppercase tracking-eyebrow", accentText[line.accent])}>
                Linha i.sí
              </p>
              <h3 className="mt-3 font-serif text-4xl tracking-tight text-foreground">
                {line.name}
              </h3>
              <p className="mt-5 font-sans text-sm leading-relaxed text-muted-foreground">
                {line.description}
              </p>

              <p className="mt-10 font-sans text-[0.62rem] uppercase tracking-eyebrow text-muted-foreground">
                O que esperar
              </p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {line.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 font-sans text-sm text-foreground"
                  >
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <a
                  href="#formulario"
                  onClick={onClose}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 font-sans text-[0.7rem] uppercase tracking-wide-editorial text-ink-foreground transition-colors hover:bg-foreground"
                >
                  Quero ser parceiro
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <p className="mt-4 text-center font-sans text-[0.62rem] text-muted-foreground">
                  Catálogo completo em breve.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
