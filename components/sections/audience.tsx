"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, Stagger, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { SITE_IMAGES } from "@/lib/site-images";

// Cada categoria ganha uma foto real (reaproveitada) e um enquadramento próprio,
// para a revelação parecer uma experiência — não uma lista.
const CATEGORIES = [
  { name: "Açaíterias", index: "01", image: SITE_IMAGES.gelato10L },
  { name: "Sorveterias", index: "02", image: SITE_IMAGES.hero },
  { name: "Gelaterias", index: "03", image: SITE_IMAGES.texture },
  { name: "Lojas de sobremesas", index: "04", image: SITE_IMAGES.gelato5L },
  { name: "Cafeterias", index: "05", image: SITE_IMAGES.texture },
  { name: "Mercados", index: "06", image: SITE_IMAGES.gelato5L },
];

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * SEÇÃO 03 — PARA QUEM VENDEMOS
 * Galeria editorial interativa: cada categoria revela uma foto ao tocar
 * (mobile) ou ao passar o cursor (desktop). Premium, conduzido, não estático.
 */
export function Audience() {
  const [active, setActive] = useState<number | null>(null);

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
              {CATEGORIES.map((cat, i) => {
                const isActive = active === i;
                return (
                  <RevealItem key={cat.name}>
                    <button
                      type="button"
                      onClick={() => setActive(isActive ? null : i)}
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive((prev) => (prev === i ? null : prev))}
                      aria-expanded={isActive}
                      className={cn(
                        "group block w-full border-b border-border text-left",
                        "transition-colors duration-500",
                        isActive ? "bg-surface/70" : "hover:bg-surface/40",
                      )}
                    >
                      <div className="flex items-center justify-between py-6 sm:py-7">
                        <div className="flex items-baseline gap-5 sm:gap-8">
                          <span
                            className={cn(
                              "font-sans text-[0.7rem] tabular-nums transition-colors duration-500",
                              isActive ? "text-accent" : "text-muted-foreground",
                            )}
                          >
                            {cat.index}
                          </span>
                          <span
                            className={cn(
                              "font-serif text-2xl tracking-tight text-foreground transition-transform duration-500 sm:text-4xl",
                              isActive ? "translate-x-2" : "group-hover:translate-x-1",
                            )}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "font-serif text-xl text-accent transition-all duration-500",
                            isActive
                              ? "translate-x-0 opacity-100"
                              : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                          )}
                        >
                          →
                        </span>
                      </div>

                      {/* Revelação da foto — abre suavemente quando ativo */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="reveal"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.55, ease }}
                            className="overflow-hidden"
                          >
                            <div className="relative mb-6 h-40 w-full overflow-hidden rounded-md sm:h-52">
                              <motion.div
                                initial={{ scale: 1.12 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.9, ease }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src={cat.image.src}
                                  alt={cat.image.alt}
                                  fill
                                  sizes="(max-width: 1024px) 100vw, 50vw"
                                  className="object-cover"
                                  style={{ objectPosition: cat.image.objectPosition }}
                                />
                              </motion.div>
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </RevealItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
