"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    index: "01",
    title: "Você conta sobre sua empresa",
    text: "Um formulário rápido para entendermos quem é você e o seu negócio.",
  },
  {
    index: "02",
    title: "A gente analisa seu perfil",
    text: "Nossa equipe comercial avalia se há um bom encaixe para a parceria.",
  },
  {
    index: "03",
    title: "Entendemos sua operação",
    text: "Conversamos sobre o seu momento, seu mix e suas oportunidades.",
  },
  {
    index: "04",
    title: "Conversamos sobre a parceria",
    text: "Alinhamos como a i.sí pode fazer parte do próximo passo do seu negócio.",
  },
];

/**
 * SEÇÃO 06 — COMO FUNCIONA
 * Timeline vertical sofisticada com linha de progressão animada no scroll.
 */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="como-funciona" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="mb-6 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent">
                Como funciona
              </p>
              <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:sticky lg:top-32">
                Talvez a i.sí seja o próximo passo do seu negócio.
              </h2>
            </Reveal>
          </div>

          <div ref={ref} className="relative lg:col-span-7">
            {/* Trilho */}
            <span className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px bg-border sm:left-[19px]" />
            <motion.span
              style={{ scaleY: lineScale }}
              className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-accent sm:left-[19px]"
            />

            <div className="space-y-14">
              {STEPS.map((step) => (
                <Reveal key={step.index} className="relative pl-12 sm:pl-16">
                  <span className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border border-line bg-background sm:size-10">
                    <span className="size-2 rounded-full bg-accent" />
                  </span>
                  <span className="font-sans text-[0.7rem] tabular-nums tracking-wide-editorial text-muted-foreground">
                    {step.index}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md font-sans text-base leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
