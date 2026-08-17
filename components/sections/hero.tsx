"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { CtaButton } from "@/components/ui/cta-button";
import { SITE_IMAGES } from "@/lib/site-images";

const ease = [0.22, 1, 0.36, 1] as const;

// Detalhes editoriais que orbitam a marca durante a revelação.
const MARKERS = ["100% Leite integral", "Artesanal", "5L", "10L"] as const;

/**
 * HERO — "SEU NEGÓCIO + i.sí"
 * ---------------------------------------------------------------------------
 * Uma primeira dobra editorial e interativa. Um overlay cinematográfico toca
 * UMA vez: os elementos "SEU NEGÓCIO" e "i.sí" se aproximam, combinam e
 * revelam a marca sobre a fotografia real do produto; o fundo passa de preto
 * para o creme da identidade. Por baixo, o hero editorial (headline + CTA +
 * foto) existe sempre no DOM — acessível mesmo sem JS, animação ou com
 * prefers-reduced-motion. No desktop, o cursor adiciona um parallax sutil.
 */
export function Hero() {
  const prefersReduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [canHover, setCanHover] = useState(false);

  // Progresso mestre da narrativa de entrada (0 → 1).
  const p = useMotionValue(0);

  // Parallax de cursor (apenas desktop com ponteiro fino).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 24, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 24, mass: 0.4 });

  const photoX = useTransform(sx, [-1, 1], [-16, 16]);
  const photoY = useTransform(sy, [-1, 1], [-12, 12]);
  const brandX = useTransform(sx, [-1, 1], [-8, 8]);

  // Estado 01 → 03: elementos separados que convergem ao centro.
  const bizY = useTransform(p, [0.1, 0.46], [-72, -14]);
  const isiY = useTransform(p, [0.1, 0.46], [72, 14]);
  const introOpacity = useTransform(p, [0, 0.46, 0.58], [1, 1, 0]);
  const plusScale = useTransform(p, [0.1, 0.4, 0.52], [1, 1.35, 1]);
  const plusOpacity = useTransform(p, [0, 0.5, 0.58], [1, 1, 0]);
  const plusGlow = useTransform(p, [0.2, 0.44, 0.56], [0, 0.55, 0]);
  const eyebrowOpacity = useTransform(p, [0, 0.15, 0.5, 0.6], [0, 1, 1, 0]);

  // Estado 04 → 05: a combinação revela a marca.
  const brandOpacity = useTransform(p, [0.55, 0.66], [0, 1]);
  const brandScale = useTransform(p, [0.55, 0.7], [0.86, 1]);
  const brandColor = useTransform(p, [0.55, 0.72], ["#efe9dd", "#1c1815"]);
  const brandSubOpacity = useTransform(p, [0.66, 0.76], [0, 1]);

  // Marcadores editoriais que entram um a um.
  const m0 = useTransform(p, [0.72, 0.78], [0, 1]);
  const m1 = useTransform(p, [0.76, 0.82], [0, 1]);
  const m2 = useTransform(p, [0.8, 0.86], [0, 1]);
  const m3 = useTransform(p, [0.84, 0.9], [0, 1]);
  const markerOpacities = [m0, m1, m2, m3];

  // Fotografia surgindo por trás da marca, dentro do overlay.
  const photoHintOpacity = useTransform(p, [0.6, 0.82], [0, 0.5]);
  const photoHintScale = useTransform(p, [0.55, 1], [1.12, 1]);

  // Fundo do overlay: preto profundo → creme. Depois o overlay se dissolve.
  const overlayBg = useTransform(p, [0.45, 0.72], ["#171310", "#f3eee4"]);
  const overlayOpacity = useTransform(p, [0.9, 1], [1, 0]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      p.set(1);
      setRevealed(true);
      return;
    }
    const controls = animate(p, 1, {
      duration: 3.4,
      ease: "easeInOut",
      delay: 0.3,
    });
    return () => controls.stop();
  }, [prefersReduced, p]);

  useMotionValueEvent(p, "change", (v) => {
    if (v > 0.86) setRevealed(true);
  });

  function handlePointer(e: PointerEvent<HTMLElement>) {
    if (!canHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  return (
    <section
      id="top"
      onPointerMove={handlePointer}
      className="relative min-h-[100svh] overflow-hidden"
    >
      {/* ================= HERO EDITORIAL (conteúdo real, sempre no DOM) ====== */}
      <div className="mx-auto grid min-h-[100svh] w-full max-w-[1500px] grid-cols-1 items-center lg:grid-cols-2">
        {/* Texto */}
        <div className="order-2 px-5 pb-14 pt-7 sm:px-8 lg:order-1 lg:px-12 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="mb-5 inline-flex items-center gap-3 font-sans text-[0.66rem] uppercase tracking-eyebrow text-muted-foreground sm:mb-8"
          >
            Gelato artesanal
            <span className="inline-block h-px w-8 bg-line" />
            Uma nova combinação
          </motion.p>

          <h1 className="max-w-2xl font-serif text-[2.75rem] leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-[4.75rem]">
            {["Gelato artesanal.", "Para negócios que escolhem qualidade."].map(
              (line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={revealed ? { y: 0 } : undefined}
                    transition={{ duration: 1, ease, delay: 0.12 + i * 0.12 }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                </span>
              ),
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="mt-5 max-w-lg font-sans text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg"
          >
            100% leite integral. Produção artesanal. Formatos de 5L e 10L para
            operações que valorizam produto, experiência e consistência.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
          >
            <CtaButton href="#formulario" variant="primary">
              Quero ser parceiro
            </CtaButton>
            <CtaButton href="#marca" variant="secondary" arrow={false}>
              Conhecer a i.sí
            </CtaButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, ease, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.6rem] uppercase tracking-eyebrow text-muted-foreground sm:mt-14"
          >
            {MARKERS.map((m, i) => (
              <li key={m} className="flex items-center gap-5">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-accent-soft" />}
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Fotografia */}
        <div className="relative order-1 h-[38svh] w-full overflow-hidden lg:order-2 lg:h-screen">
          <motion.div
            style={canHover ? { x: photoX, y: photoY } : undefined}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={revealed ? { opacity: 1, scale: 1 } : undefined}
            transition={{
              opacity: { duration: 1.2, ease },
              scale: { duration: 1.6, ease },
            }}
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

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-background via-background/40 to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent lg:hidden" />
        </div>
      </div>

      {/* ================= OVERLAY CINEMATOGRÁFICO (decorativo) =============== */}
      <motion.div
        aria-hidden="true"
        style={{ backgroundColor: overlayBg, opacity: overlayOpacity }}
        className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden"
      >
        {/* Fotografia surgindo por trás da combinação */}
        <motion.div
          style={{
            opacity: photoHintOpacity,
            scale: photoHintScale,
            ...(canHover ? { x: photoX, y: photoY } : {}),
          }}
          className="pointer-events-none absolute inset-0"
        >
          <Image
            src={SITE_IMAGES.hero.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-70 blur-2xl"
            style={{ objectPosition: SITE_IMAGES.hero.objectPosition }}
          />
        </motion.div>

        {/* Eyebrow superior */}
        <motion.span
          style={{ opacity: eyebrowOpacity }}
          className="absolute top-[18%] font-sans text-[0.62rem] uppercase tracking-eyebrow text-ink-foreground/50"
        >
          Gelato artesanal
        </motion.span>

        {/* Composição central */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Estado 01–03: SEU NEGÓCIO + i.sí */}
          <motion.div
            style={{ opacity: introOpacity }}
            className="absolute flex flex-col items-center gap-6"
          >
            <motion.span
              style={{ y: bizY }}
              className="font-serif text-4xl tracking-tight text-ink-foreground sm:text-6xl"
            >
              Seu negócio
            </motion.span>

            <div className="relative flex items-center justify-center">
              <motion.span
                aria-hidden="true"
                style={{ opacity: plusGlow }}
                className="absolute h-40 w-40 rounded-full bg-accent-soft blur-3xl"
              />
              <motion.span
                style={{ scale: plusScale, opacity: plusOpacity }}
                className="relative font-serif text-4xl text-accent-soft sm:text-5xl"
              >
                +
              </motion.span>
            </div>

            <motion.span
              style={{ y: isiY }}
              className="font-serif text-5xl tracking-tight text-ink-foreground sm:text-7xl"
            >
              i.sí
            </motion.span>
          </motion.div>

          {/* Estado 04–05: marca revelada */}
          <motion.div
            style={canHover ? { x: brandX } : undefined}
            className="flex flex-col items-center text-center"
          >
            <motion.span
              style={{ opacity: brandOpacity, scale: brandScale, color: brandColor }}
              className="block font-serif text-7xl tracking-tight sm:text-8xl lg:text-9xl"
            >
              i.sí
            </motion.span>
            <motion.span
              style={{ opacity: brandSubOpacity }}
              className="mt-4 font-sans text-[0.66rem] uppercase tracking-eyebrow text-foreground/60"
            >
              Gelato artesanal
            </motion.span>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {MARKERS.map((m, i) => (
                <motion.span
                  key={m}
                  style={{ opacity: markerOpacities[i] }}
                  className="rounded-full border border-line/70 px-4 py-1.5 font-sans text-[0.56rem] uppercase tracking-eyebrow text-muted-foreground"
                >
                  {m}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Eyebrow inferior */}
        <motion.span
          style={{ opacity: eyebrowOpacity }}
          className="absolute bottom-[18%] font-sans text-[0.62rem] uppercase tracking-eyebrow text-ink-foreground/50"
        >
          Uma nova combinação
        </motion.span>
      </motion.div>
    </section>
  );
}
