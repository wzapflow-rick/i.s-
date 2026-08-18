"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Transition,
} from "motion/react";
import { CtaButton } from "@/components/ui/cta-button";
import { SITE_IMAGES } from "@/lib/site-images";

const ease = [0.22, 1, 0.36, 1] as const;
const zoomEase = [0.16, 1, 0.3, 1] as const;

// Marcadores editoriais discretos — texto puro, nunca cards.
const MARKERS = ["100% Leite integral", "Produção artesanal", "5L", "10L"] as const;

/**
 * HERO — CAMPANHA CINEMATOGRÁFICA (fotografia como protagonista)
 * ---------------------------------------------------------------------------
 * A primeira dobra é o PRODUTO. Uma fotografia real da i.sí ocupa a viewport
 * inteira e recebe um zoom-out lento (câmera se afastando) + parallax ambiente
 * de mouse (apenas desktop). A tipografia entra em cascata editorial:
 *
 *   i.sí  →  "Feito para combinar."  →  "com o seu negócio."
 *         →  headline comercial  →  subheadline  →  CTA  →  marcadores
 *
 * A narrativa é TEMPORIZADA (roda uma vez ao carregar), nunca bloqueia a
 * navegação e todo o conteúdo já está no DOM. Com prefers-reduced-motion,
 * removemos zoom/parallax/translate e mantemos apenas fades suaves.
 */
export function Hero() {
  const prefersReduced = useReducedMotion();

  // ---- Parallax ambiente de mouse (desktop) -------------------------------
  // Motion values crus (destino) → springs (suavização de "câmera").
  const photoRawX = useMotionValue(0);
  const photoRawY = useMotionValue(0);
  const textRawX = useMotionValue(0);
  const textRawY = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18, mass: 0.6 } as const;
  // Foto move mais; camada de texto move de leve e oposta (profundidade).
  const photoX = useSpring(photoRawX, spring);
  const photoY = useSpring(photoRawY, spring);
  const textX = useSpring(textRawX, spring);
  const textY = useSpring(textRawY, spring);

  useEffect(() => {
    if (prefersReduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const nx = e.clientX / window.innerWidth - 0.5; // -0.5 → 0.5
        const ny = e.clientY / window.innerHeight - 0.5;
        // Câmera: ± ~8px horizontal, ± ~6px vertical.
        photoRawX.set(nx * -16);
        photoRawY.set(ny * -12);
        // Texto: metade e em sentido oposto.
        textRawX.set(nx * 6);
        textRawY.set(ny * 5);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReduced, photoRawX, photoRawY, textRawX, textRawY]);

  // ---- Helpers de revelação editorial -------------------------------------
  const reveal = (delay: number, y = 20) => {
    if (prefersReduced) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5, ease } as Transition,
      };
    }
    return {
      initial: { opacity: 0, y },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.95, delay, ease } as Transition,
    };
  };

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* ================= FOTOGRAFIA (protagonista) ======================= */}
      <motion.div
        aria-hidden="true"
        style={prefersReduced ? undefined : { x: photoX, y: photoY }}
        className="absolute inset-0 scale-[1.12]"
      >
        <motion.div
          initial={prefersReduced ? { scale: 1 } : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.6, ease: zoomEase }}
          className="absolute inset-0"
        >
          <Image
            src={SITE_IMAGES.hero.src}
            alt={SITE_IMAGES.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: SITE_IMAGES.hero.objectPosition }}
          />
        </motion.div>
      </motion.div>

      {/* Gradientes cinematográficos: escuro embaixo/esquerda para leitura,
          topo levemente escurecido para a marca. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/45 to-ink/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_55%,rgba(8,6,4,0.55)_100%)]"
      />
      {/* Grain extremamente leve. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ================= CAMADA EDITORIAL ================================ */}
      <motion.div
        style={prefersReduced ? undefined : { x: textX, y: textY }}
        className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-16 lg:pb-16 lg:pt-28"
      >
        {/* Topo: kicker editorial (a marca vive no header) */}
        <div className="mx-auto flex w-full max-w-[1500px] justify-end">
          <motion.span
            {...reveal(0.6, 8)}
            className="text-right font-sans text-[0.58rem] uppercase leading-relaxed tracking-eyebrow text-ink-foreground/55"
          >
            Gelato artesanal
            <br className="hidden sm:block" />
            <span className="sm:hidden"> · </span>Parceria B2B
          </motion.span>
        </div>

        {/* Base: narrativa editorial */}
        <div className="mx-auto w-full max-w-[1500px]">
          {/* Frase conceitual — o gancho emocional (protagonista tipográfico) */}
          <p className="font-serif text-[2.6rem] leading-[0.98] tracking-tight text-balance text-ink-foreground sm:text-6xl lg:text-7xl">
            <motion.span {...reveal(1.1)} className="block">
              Feito para <span className="italic text-accent-soft">combinar</span>.
            </motion.span>
            <motion.span {...reveal(1.9)} className="block text-ink-foreground/85">
              Com o seu negócio.
            </motion.span>
          </p>

          {/* Headline comercial — a proposição que esclarece */}
          <motion.h1
            {...reveal(2.7)}
            className="mt-6 max-w-2xl font-sans text-base font-medium uppercase leading-snug tracking-wide-editorial text-ink-foreground/90 sm:text-lg"
          >
            Gelato artesanal para negócios que escolhem qualidade.
          </motion.h1>

          {/* Subheadline — factual, curta */}
          <motion.p
            {...reveal(3.4)}
            className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-ink-foreground/70 sm:text-base"
          >
            100% leite integral. Produção artesanal. Formatos de 5L e 10L.
          </motion.p>

          {/* CTAs — o principal entra por último */}
          <motion.div
            {...reveal(4.0)}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
          >
            <CtaButton href="#formulario" variant="inverse">
              Quero ser parceiro
            </CtaButton>
            <CtaButton href="#marca" variant="inverseOutline" arrow={false}>
              Conhecer a i.sí
            </CtaButton>
          </motion.div>

          {/* Marcadores editoriais — texto puro, hairline, entram por último */}
          <motion.div
            {...reveal(4.3, 10)}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink-foreground/15 pt-5 font-sans text-[0.56rem] uppercase tracking-eyebrow text-ink-foreground/60"
          >
            {MARKERS.map((m, i) => (
              <span key={m} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-accent-soft/70">
                    ·
                  </span>
                )}
                {m}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
