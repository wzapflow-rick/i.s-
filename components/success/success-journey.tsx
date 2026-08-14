"use client";

import { motion } from "motion/react";
import { Logo } from "@/components/brand/logo";

interface SuccessJourneyProps {
  company?: string;
}

const NEXT_STEPS = [
  {
    step: "01",
    title: "Recebemos seu interesse",
    description:
      "Sua candidatura chegou até nós e já entrou na nossa curadoria de parceiros.",
  },
  {
    step: "02",
    title: "Análise personalizada",
    description:
      "Nosso time estuda seu perfil e monta uma proposta sob medida para o seu espaço.",
  },
  {
    step: "03",
    title: "Conversa com a i.sí",
    description:
      "Em até 2 dias úteis entramos em contato para desenhar a parceria juntos.",
  },
];

export function SuccessJourney({ company }: SuccessJourneyProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center md:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Logo className="text-5xl" showTagline />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-10 font-sans text-[0.7rem] uppercase tracking-eyebrow text-accent"
      >
        Candidatura enviada
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-4 text-balance font-serif text-4xl leading-tight text-foreground md:text-6xl"
      >
        {company ? (
          <>
            Bem-vindo à jornada,
            <br />
            <span className="text-accent">{company}</span>
          </>
        ) : (
          <>Uma nova descoberta começa aqui</>
        )}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-6 max-w-xl text-pretty font-sans text-base leading-relaxed text-muted-foreground"
      >
        Obrigado por querer levar sabores que despertam novas descobertas para o
        seu negócio. Veja o que vem a seguir.
      </motion.p>

      <div className="mt-16 grid w-full gap-px overflow-hidden rounded-2xl border border-border bg-border text-left md:grid-cols-3">
        {NEXT_STEPS.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
            className="flex flex-col gap-3 bg-card p-8"
          >
            <span className="font-serif text-2xl text-accent">{item.step}</span>
            <h3 className="font-serif text-xl leading-snug text-foreground">
              {item.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-16 font-serif text-xl italic text-foreground/80"
      >
        Sabores que despertam novas descobertas.
      </motion.p>
    </div>
  );
}
