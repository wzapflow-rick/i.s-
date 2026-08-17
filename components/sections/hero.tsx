"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { CtaButton } from "@/components/ui/cta-button";
import { SITE_IMAGES } from "@/lib/site-images";

const ease = [0.22, 1, 0.36, 1] as const;

// Detalhes editoriais que se revelam quando a marca surge.
const MARKERS = ["100% Leite integral", "Produção artesanal", "5L", "10L"] as const;

/**
 * HERO — EXPERIÊNCIA CINEMÁTICA CONTROLADA POR SCROLL
 * ---------------------------------------------------------------------------
 * Conceito: "SEU NEGÓCIO + i.sí". A narrativa NÃO depende de mouse nem de
 * timers — cada etapa é vinculada ao progresso do scroll:
 *
 *   1. separado  →  2. aproximação  →  3. combinação  →  4. descoberta da foto
 *   →  5. revelação da marca  →  6. proposta comercial  →  7. CTA
 *
 * A seção é alta (runway de scroll) e o palco fica "pinned" (sticky) ocupando
 * 100svh. Ao concluir a sequência, o visitante segue naturalmente para a
 * próxima seção. Com prefers-reduced-motion, mostramos direto o estado final
 * (foto + headline + texto + CTA), semanticamente correto.
 */
export function Hero() {
  return <HeroCinematic />;
}

/* ========================================================================== */
/* Versão cinemática controlada por scroll                                    */
/* ========================================================================== */

function HeroCinematic() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const narrowRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Progresso mestre da narrativa (0 → 1), normalizado apenas sobre o trecho
  // realmente "pinned" — assim o estado final assenta ANTES de a seção soltar.
  const t = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    narrowRef.current = mq.matches;
    const onChange = () => (narrowRef.current = mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = sectionRef.current;
    const pinned =
      el && typeof window !== "undefined"
        ? Math.max(0.15, 1 - window.innerHeight / el.offsetHeight)
        : 0.667;
    t.set(Math.min(v / pinned, 1));
  });

  // Habilita cliques nos CTAs só quando a etapa comercial está visível.
  useMotionValueEvent(t, "change", (v) => setReady(v > 0.7));

  /* ---- Sequência: elementos separados que convergem ---------------------- */
  const eyebrowOpacity = useTransform(t, [0, 0.05, 0.44, 0.54], [0, 1, 1, 0]);
  const bizY = useTransform(t, [0.02, 0.42], [-150, -12]);
  const isiSmallY = useTransform(t, [0.22, 0.46], [150, 12]);
  const smallCompOpacity = useTransform(t, [0.46, 0.56], [1, 0]);
  const plusScale = useTransform(t, [0.14, 0.3, 0.48], [0.9, 1.4, 1]);
  const plusOpacity = useTransform(t, [0, 0.44, 0.54], [0.55, 1, 0]);
  const plusGlow = useTransform(t, [0.16, 0.32, 0.5], [0, 0.6, 0]);

  /* ---- Revelação da marca ------------------------------------------------ */
  const brandOpacity = useTransform(t, [0.46, 0.56, 0.66, 0.76], [0, 1, 1, 0]);
  const brandScale = useTransform(t, [0.46, 0.62], [0.88, 1]);
  const brandSubOpacity = useTransform(t, [0.54, 0.62, 0.66, 0.74], [0, 1, 1, 0]);

  // Marcadores editoriais entram com pequenos delays (stagger).
  const m0 = useTransform(t, [0.56, 0.62], [0, 1]);
  const m1 = useTransform(t, [0.59, 0.65], [0, 1]);
  const m2 = useTransform(t, [0.62, 0.68], [0, 1]);
  const m3 = useTransform(t, [0.65, 0.71], [0, 1]);
  const markerOpacities = [m0, m1, m2, m3];

  /* ---- Fotografia sendo descoberta atrás da composição ------------------- */
  const photoOpacity = useTransform(t, [0.34, 0.52], [0, 1]);
  const photoScale = useTransform(t, [0.34, 1], [1.12, 1]);
  const photoBlurN = useTransform(t, [0.34, 0.54], [1, 0]);
  const photoFilter = useTransform(photoBlurN, (n) => {
    if (prefersReduced) return "blur(0px)";
    return `blur(${(Math.max(0, n) * (narrowRef.current ? 8 : 18)).toFixed(1)}px)`;
  });

  /* ---- Fundo e cenas ----------------------------------------------------- */
  const stageBg = useTransform(t, [0.14, 0.5], ["#14100d", "#efe7d8"]);
  const scrimOpacity = useTransform(t, [0.5, 0.68], [0, 1]);

  /* ---- Camada comercial (hero real) -------------------------------------- */
  const editorialOpacity = useTransform(t, [0.66, 0.8], [0, 1]);
  const editorialY = useTransform(t, [0.66, 0.82], [32, 0]);

  /* ---- Dica de scroll no início ------------------------------------------ */
  const hintOpacity = useTransform(t, [0, 0.05, 0.16], [1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-[280vh] md:h-[320vh]"
    >
      <motion.div
        style={{ backgroundColor: stageBg }}
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden"
      >
        {/* ---------- Fotografia real, descoberta atrás da composição ------- */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: photoOpacity, scale: photoScale, filter: photoFilter }}
          className="absolute inset-0"
        >
          <Image
            src={SITE_IMAGES.hero.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: SITE_IMAGES.hero.objectPosition }}
          />
        </motion.div>

        {/* Scrim para leitura do texto comercial sobre a foto escura */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/20"
        />

        {/* ---------- Eyebrow superior (durante a sequência) ---------------- */}
        <motion.p
          style={{ opacity: eyebrowOpacity }}
          className="absolute top-[16%] z-10 px-6 text-center font-sans text-[0.6rem] uppercase tracking-eyebrow text-ink-foreground/55"
        >
          Gelato artesanal <span className="text-accent-soft">•</span> Parceria B2B
        </motion.p>

        {/* ---------- Composição central: SEU NEGÓCIO + i.sí ---------------- */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          {/* Estado separado → convergente */}
          <motion.div
            style={{ opacity: smallCompOpacity }}
            className="absolute flex flex-col items-center gap-5 text-center"
          >
            <motion.span
              style={{ y: bizY }}
              className="font-serif text-4xl leading-none tracking-tight text-ink-foreground sm:text-6xl"
            >
              Seu negócio
            </motion.span>

            <span className="relative flex items-center justify-center">
              <motion.span
                aria-hidden="true"
                style={{ opacity: plusGlow }}
                className="absolute h-36 w-36 rounded-full bg-accent-soft blur-3xl"
              />
              <motion.span
                style={{ scale: plusScale, opacity: plusOpacity }}
                className="relative font-serif text-4xl text-accent-soft sm:text-5xl"
              >
                +
              </motion.span>
            </span>

            <motion.span
              style={{ y: isiSmallY }}
              className="font-serif text-5xl leading-none tracking-tight text-ink-foreground sm:text-7xl"
            >
              i.sí
            </motion.span>
          </motion.div>

          {/* Estado combinado → marca revelada */}
          <motion.div
            style={{ opacity: brandOpacity }}
            className="flex flex-col items-center text-center"
          >
            <motion.span
              style={{ scale: brandScale }}
              className="block font-serif text-7xl tracking-tight text-ink-foreground sm:text-8xl lg:text-9xl"
            >
              i.sí
            </motion.span>
            <motion.span
              style={{ opacity: brandSubOpacity }}
              className="mt-4 font-sans text-[0.62rem] uppercase tracking-eyebrow text-ink-foreground/60"
            >
              Gelato artesanal
            </motion.span>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {MARKERS.map((m, i) => (
                <motion.span
                  key={m}
                  style={{ opacity: markerOpacities[i] }}
                  className="rounded-full border border-ink-foreground/25 px-4 py-1.5 font-sans text-[0.54rem] uppercase tracking-eyebrow text-ink-foreground/75"
                >
                  {m}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ---------- Camada comercial (hero real, semântico) --------------- */}
        <motion.div
          style={{ opacity: editorialOpacity, y: editorialY }}
          className="absolute inset-x-0 bottom-0 z-20 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-16 lg:pb-20"
        >
          <div className="mx-auto w-full max-w-[1500px]">
            <p className="mb-5 inline-flex items-center gap-3 font-sans text-[0.62rem] uppercase tracking-eyebrow text-ink-foreground/60">
              Gelato artesanal
              <span className="inline-block h-px w-8 bg-ink-foreground/40" />
              Uma nova combinação
            </p>

            <h1 className="max-w-3xl font-serif text-[2.5rem] leading-[0.98] tracking-tight text-balance text-ink-foreground sm:text-6xl lg:text-7xl">
              Gelato artesanal.
              <br />
              Para negócios que escolhem qualidade.
            </h1>

            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-ink-foreground/75 sm:text-lg">
              100% leite integral. Produção artesanal. Formatos de 5L e 10L para
              operações que valorizam produto, experiência e consistência.
            </p>

            <div
              className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4"
              style={{ pointerEvents: ready ? "auto" : "none" }}
            >
              <CtaButton href="#formulario" variant="inverse">
                Quero ser parceiro
              </CtaButton>
              <CtaButton href="#marca" variant="inverseOutline" arrow={false}>
                Conhecer a i.sí
              </CtaButton>
            </div>
          </div>
        </motion.div>

        {/* ---------- Dica de scroll ---------------------------------------- */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: hintOpacity }}
          className="absolute bottom-9 z-10 flex flex-col items-center gap-2 text-ink-foreground/55"
        >
          <span className="font-sans text-[0.56rem] uppercase tracking-eyebrow">
            Role para descobrir
          </span>
          <motion.span
            animate={prefersReduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-sm"
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
