"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CtaButton } from "@/components/ui/cta-button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-28"
    >
      {/* Imagem principal — placeholder editorial preparado para substituição */}
      <div className="absolute inset-0 -z-10">
        <motion.div style={{ y: imageY, scale: imageScale }} className="relative h-full w-full">
          <Image
            src="/images/hero-gelato.png"
            alt="Close-up editorial de gelato artesanal com textura cremosa"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-8 font-sans text-[0.68rem] uppercase tracking-eyebrow text-muted-foreground"
        >
          Produtos para negócios <span className="text-accent">•</span> Atendimento comercial{" "}
          <span className="text-accent">•</span> Parcerias selecionadas
        </motion.p>

        <h1 className="max-w-4xl font-serif text-[2.75rem] leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-[5.25rem]">
          {["Novas combinações.", "Novas possibilidades."].map((line, i) => (
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
          className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Produtos pensados para negócios que querem ampliar seu mix, criar novas
          experiências e encontrar novas formas de vender.
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
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-sans text-[0.6rem] uppercase tracking-eyebrow text-muted-foreground">
          Role
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="h-8 w-px bg-line"
        />
      </motion.div>
    </section>
  );
}
