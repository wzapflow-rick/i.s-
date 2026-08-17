"use client";

import { motion } from "motion/react";
import { Logo } from "@/components/brand/logo";

interface SuccessJourneyProps {
  company?: string;
}

// Jornada pós-envio: dois passos concluídos, dois pendentes.
const JOURNEY = [
  { label: "Cadastro recebido", done: true },
  { label: "Dados registrados", done: true },
  { label: "Análise do perfil", done: false },
  { label: "Contato da equipe i.sí", done: false },
];

export function SuccessJourney({ company }: SuccessJourneyProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-8 md:py-32">
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
        Perfil enviado
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-4 text-balance font-serif text-4xl leading-tight text-foreground md:text-6xl"
      >
        Recebemos o seu i.sí.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-6 max-w-lg text-pretty font-sans text-base leading-relaxed text-muted-foreground"
      >
        {company ? `${company}, seu ` : "Seu "}perfil foi enviado para análise
        comercial. Nossa equipe entrará em contato caso exista um bom encaixe
        para a parceria.
      </motion.p>

      <div className="mt-14 w-full max-w-md">
        <ol className="flex flex-col gap-px overflow-hidden rounded-lg border border-border bg-border text-left">
          {JOURNEY.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 bg-card px-6 py-5"
            >
              <span
                aria-hidden="true"
                className={
                  item.done
                    ? "flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[0.7rem] text-background"
                    : "flex size-6 shrink-0 items-center justify-center rounded-full border border-line text-[0.7rem] text-muted-foreground"
                }
              >
                {item.done ? "✓" : "○"}
              </span>
              <span
                className={
                  item.done
                    ? "font-sans text-sm text-foreground"
                    : "font-sans text-sm text-muted-foreground"
                }
              >
                {item.label}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.95 }}
        className="mt-14 font-serif text-xl italic text-foreground/80"
      >
        Novas combinações. Novas possibilidades.
      </motion.p>
    </div>
  );
}
