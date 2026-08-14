"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import { SITE_IMAGES } from "@/lib/site-images";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] overflow-hidden pt-24 lg:pt-0"
    >
      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1500px] grid-cols-1 items-center lg:grid-cols-2">
        {/* Coluna de texto */}
        <div className="order-2 px-5 pb-16 pt-10 sm:px-8 lg:order-1 lg:px-12 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-8 inline-flex items-center gap-2 font-sans text-[0.66rem] uppercase tracking-eyebrow text-muted-foreground"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Gelato artesanal <span className="text-line">•</span> Feira de Santana
          </motion.p>

          <h1 className="max-w-2xl font-serif text-[2.75rem] leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-[4.75rem]">
            {["Gelato artesanal.", "Para negócios que escolhem qualidade."].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease, delay: 0.15 + i * 0.12 }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="mt-8 max-w-lg font-sans text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Produzido em Feira de Santana com 100% leite integral, em formatos de
            5L e 10L, para operações que valorizam produto, experiência e
            consistência.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.65 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <CtaButton href="#formulario" variant="primary">
              Quero ser parceiro
            </CtaButton>
            <CtaButton href="#conceito" variant="secondary" arrow={false}>
              Conhecer a i.sí
            </CtaButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.85 }}
            className="mt-6 font-sans text-[0.7rem] uppercase tracking-wide-editorial text-muted-foreground"
          >
            Parcerias limitadas <span className="text-accent">·</span> trabalhamos
            com poucos parceiros por vez
          </motion.p>
        </div>

        {/* Painel de food photography — estrutura pronta para fotos reais do produto */}
        <div className="relative order-1 h-[48svh] w-full overflow-hidden lg:order-2 lg:h-screen">
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative h-full w-full"
          >
            <Image
              src={SITE_IMAGES.hero.src}
              alt={SITE_IMAGES.hero.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: SITE_IMAGES.hero.objectPosition }}
            />
          </motion.div>

          {/* Mesclagem suave com o fundo creme apenas no desktop */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-background via-background/40 to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent lg:hidden" />

          {SITE_IMAGES.hero.placeholder && (
            <span className="absolute bottom-5 right-5 rounded-full bg-background/80 px-3 py-1 font-sans text-[0.56rem] uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm">
              Foto ilustrativa
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
