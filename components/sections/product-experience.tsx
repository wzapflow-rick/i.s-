"use client";

/**
 * PRODUCT EXPERIENCE — "i.sí combina."
 * --------------------------------------------------------------------------
 * Uma cena única onde o produto muda de estado por drag/swipe e TODO o
 * ambiente (fundo, onda de creme, texto, navegação) muda junto, em tempo
 * real, controlado pelo gesto do usuário. Não é um carousel: é uma câmera
 * atravessando diferentes versões da mesma marca.
 *
 * Toda a narrativa deriva de UM motion value contínuo — `progress` — que vai
 * de 0 (primeiro estado) a N-1 (último). Drag/nav/teclado só movem esse valor;
 * cada camada interpola a si mesma a partir dele. Animações usam apenas
 * transform/opacity/backgroundColor (GPU-friendly), sem WebGL, sem loops.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EXPERIENCE_STATES, type ExperienceState } from "@/lib/product-experience";

const EASE = [0.22, 1, 0.36, 1] as const;
const N = EXPERIENCE_STATES.length;
const LAST = N - 1;

const CREAM = [239, 233, 221] as const; // #efe9dd
const INK = [42, 30, 22] as const; //   #2a1e16

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Interpola entre duas cores rgb; t=0 → a, t=1 → b. Retorna rgba(). */
function mixRgba(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
  alpha = 1,
) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
}

export function ProductExperience() {
  const prefersReduced = useReducedMotion() ?? false;

  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  const [active, setActive] = useState(0);

  // Índice ativo (mais próximo) → z-index, aria-current e leitura acessível.
  useMotionValueEvent(progress, "change", (v) => {
    const nearest = clamp(Math.round(v), 0, LAST);
    setActive((prev) => (prev === nearest ? prev : nearest));
  });

  // ---- Fundo do ambiente: interpola a cor entre todos os estados ----------
  const bgColor = useTransform(
    progress,
    EXPERIENCE_STATES.map((_, i) => i),
    EXPERIENCE_STATES.map((s) => s.bg),
  );

  // ---- "cream": 1 enquanto há onda de creme (sabores), 0 no desfecho ------
  // Controla a onda, a cor da navegação e a opacidade da coluna de texto.
  const cream = useTransform(progress, [LAST - 1, LAST], [1, 0]);

  // ---- Navegação programática (nav / teclado): anima o progress -----------
  const goTo = useCallback(
    (target: number) => {
      const clamped = clamp(target, 0, LAST);
      animate(progress, clamped, {
        duration: prefersReduced ? 0.25 : 0.85,
        ease: prefersReduced ? "easeOut" : EASE,
      });
    },
    [progress, prefersReduced],
  );

  // ---- Drag em tempo real (pointer) ---------------------------------------
  const drag = useRef({ active: false, startX: 0, startProgress: 0, travel: 520, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    if (prefersReduced) return; // reduced-motion: só nav/teclado
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    const width = stageRef.current?.getBoundingClientRect().width ?? 520;
    drag.current = {
      active: true,
      startX: e.clientX,
      startProgress: progress.get(),
      travel: Math.min(width, 560),
      moved: false,
    };
    progress.stop();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    let next = drag.current.startProgress - dx / drag.current.travel;
    if (next < 0) next = next * 0.35;
    else if (next > LAST) next = LAST + (next - LAST) * 0.35;
    progress.set(next);
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const start = drag.current.startProgress;
    const cur = progress.get();
    const moved = cur - start;
    let target = Math.round(start);
    if (Math.abs(moved) >= 0.35) target = moved > 0 ? Math.round(start) + 1 : Math.round(start) - 1;
    goTo(clamp(target, 0, LAST));
  };

  // ---- Teclado ------------------------------------------------------------
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goTo(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(LAST);
    }
  };

  // ---- Wheel horizontal (trackpad) — opcional e seguro --------------------
  useEffect(() => {
    if (prefersReduced) return;
    const el = stageRef.current;
    if (!el) return;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
      e.preventDefault();
      const travel = Math.min(el.getBoundingClientRect().width, 560);
      let next = progress.get() + e.deltaX / travel;
      if (next < 0) next = next * 0.35;
      else if (next > LAST) next = LAST + (next - LAST) * 0.35;
      progress.set(next);
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        goTo(clamp(Math.round(progress.get()), 0, LAST));
      }, 140);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, [prefersReduced, progress, goTo]);

  const activeState = EXPERIENCE_STATES[active];
  const isPartner = activeState.kind === "partner";

  return (
    <section
      aria-roledescription="Experiência de produto"
      aria-label="Escolha a sua combinação i.sí"
      className="relative isolate w-full overflow-hidden"
    >
      {/* Ambiente — cor que interpola em tempo real */}
      <motion.div aria-hidden style={{ backgroundColor: bgColor }} className="absolute inset-0 -z-10" />
      {/* Vinheta sutil para profundidade editorial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 55% 25%, transparent 42%, rgba(0,0,0,0.36) 100%)",
        }}
      />

      <div
        ref={stageRef}
        role="group"
        tabIndex={0}
        aria-label="Arraste na horizontal, ou use as setas do teclado, para percorrer as combinações"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="relative flex min-h-[100svh] cursor-grab touch-pan-y select-none flex-col outline-none focus-visible:ring-2 focus-visible:ring-[#c9ad78] focus-visible:ring-offset-0 active:cursor-grabbing"
      >
        {/* ================= BARRA SUPERIOR ================= */}
        <header className="relative z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 pt-6 sm:px-8 lg:px-14 lg:pt-8">
          <span className="font-serif text-2xl tracking-tight text-[#efe9dd]">i.sí</span>
          <span className="hidden font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/55 md:block">
            Experiência i.sí
          </span>
          <span className="ml-auto hidden font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/55 lg:flex lg:items-center lg:gap-3">
            100% Leite Integral <Dot /> Artesanal <Dot /> 5L <Dot /> 10L
          </span>
        </header>

        {/* ================= ONDA DE CREME ================= */}
        <CreamWave cream={cream} />

        {/* ================= PALCO ================= */}
        <div className="relative z-10 flex flex-1 items-center">
          {/* Produto — uma camada por estado (desliza/escala junto) */}
          {EXPERIENCE_STATES.map((state, i) => (
            <ProductLayer
              key={state.id}
              state={state}
              index={i}
              progress={progress}
              reduced={prefersReduced}
              active={active === i}
            />
          ))}

          {/* Coluna de texto à esquerda (headline fixa + sabor animado) */}
          <motion.div
            style={{ opacity: cream }}
            className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[1600px] px-5 sm:px-8 lg:px-14"
          >
            <div className="max-w-[64%] sm:max-w-md lg:max-w-lg">
              <p className="inline-flex items-center gap-3 font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#c9ad78]">
                <span className="inline-block h-px w-8 bg-[#c9ad78]/60" />
                Experiência i.sí
              </p>
              <h2 className="mt-5 font-serif text-[1.9rem] leading-[1.02] tracking-tight text-balance text-[#efe9dd] sm:text-5xl lg:text-6xl">
                Cada combinação cria uma experiência.
              </h2>
              <p className="mt-4 font-sans text-sm text-[#efe9dd]/70 sm:text-base">
                Descubra a próxima.
              </p>
              <span className="mt-7 block h-px w-14 bg-[#efe9dd]/25" />

              {/* Bloco do sabor — troca com crossfade por estado ativo */}
              <div className="relative mt-6 h-24">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeState.id}
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: prefersReduced ? 0.2 : 0.4, ease: EASE }}
                    className="absolute inset-0"
                  >
                    {!isPartner && (
                      <>
                        <p className="font-sans text-lg uppercase tracking-wide-editorial text-[#efe9dd]">
                          {activeState.name}
                        </p>
                        <p className="mt-2 font-sans text-sm leading-relaxed text-[#efe9dd]/65">
                          {activeState.description}
                        </p>
                        <p
                          className="mt-3 inline-flex items-center gap-2 font-sans text-[0.62rem] uppercase tracking-eyebrow"
                          style={{ color: activeState.accent }}
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeState.accent }} />
                          {activeState.mood}
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Círculo "arraste para explorar" (desktop, some no desfecho) */}
          {!prefersReduced && (
            <motion.div
              style={{ opacity: cream }}
              aria-hidden
              className="absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#efe9dd]/30 text-[#efe9dd]/80">
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="text-lg"
                >
                  ↓
                </motion.span>
              </span>
              <span className="max-w-[6rem] text-center font-sans text-[0.55rem] uppercase leading-relaxed tracking-eyebrow text-[#efe9dd]/55">
                Arraste para explorar
              </span>
            </motion.div>
          )}
        </div>

        {/* ================= RODAPÉ: progresso + navegação ================= */}
        <footer className="relative z-30 mx-auto w-full max-w-[1600px] px-5 pb-7 sm:px-8 lg:px-14">
          <ProgressLine progress={progress} cream={cream} />
          <nav aria-label="Combinações" className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
            {EXPERIENCE_STATES.map((state, i) => (
              <NavItem
                key={state.id}
                state={state}
                index={i}
                progress={progress}
                cream={cream}
                isActive={active === i}
                onSelect={() => goTo(i)}
              />
            ))}
          </nav>
        </footer>

        {/* Leitura acessível do estado atual */}
        <p aria-live="polite" className="sr-only">
          {activeState.name}
        </p>
      </div>
    </section>
  );
}

function Dot() {
  return <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-[#c9ad78]/70" />;
}

/* ========================================================================== */
/* Onda de creme — elemento-assinatura na base da cena                        */
/* ========================================================================== */

function CreamWave({ cream }: { cream: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{ opacity: cream }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[46%]"
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M0,96 C 220,20 420,26 660,96 C 900,166 1120,196 1440,120 L1440,320 L0,320 Z"
          fill="#efe9dd"
        />
      </svg>
    </motion.div>
  );
}

/* ========================================================================== */
/* Camada de produto: um pote por estado (desliza/escala junto)               */
/* ========================================================================== */

function ProductLayer({
  state,
  index,
  progress,
  reduced,
  active,
}: {
  state: ExperienceState;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  active: boolean;
}) {
  const productX = useTransform(progress, (p) => (reduced ? "0%" : `${(index - p) * 62}%`));
  const productScale = useTransform(progress, (p) =>
    reduced ? 1 : clamp(1 - Math.abs(index - p) * 0.12, 0.82, 1),
  );
  const layerOpacity = useTransform(progress, (p) => clamp(1 - Math.abs(index - p) * 1.2, 0, 1));

  return (
    <motion.div
      aria-hidden={!active}
      style={{ opacity: layerOpacity, zIndex: active ? 15 : 5 }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[7%]"
    >
      <motion.div
        style={{ x: productX, scale: productScale }}
        className="relative flex w-[min(78vw,34rem)] items-center justify-center"
      >
        {state.kind === "partner" ? (
          <PartnerScene accent={state.accent} />
        ) : state.image ? (
          <ProductTub image={state.image} priority={index === 0} accent={state.accent} />
        ) : (
          <ProductPlaceholder accent={state.accent} name={state.name} />
        )}
      </motion.div>
    </motion.div>
  );
}

/* Produto — pote com fundo transparente, dominante, ancorado por sombra */
function ProductTub({
  image,
  priority,
  accent,
}: {
  image: NonNullable<ExperienceState["image"]>;
  priority: boolean;
  accent: string;
}) {
  return (
    <div className="relative aspect-square w-full">
      {/* Halo suave de cor do sabor atrás do produto */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[42%] -z-10 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: accent, opacity: 0.18 }}
      />
      {/* Sombra de contato sobre a onda de creme */}
      <div
        aria-hidden
        className="absolute inset-x-[18%] bottom-[6%] -z-10 h-[8%] rounded-[50%] blur-xl"
        style={{ background: "rgba(0,0,0,0.28)" }}
      />
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 78vw, 34rem"
        className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]"
        style={{ objectPosition: image.objectPosition }}
        draggable={false}
      />
    </div>
  );
}

/* Placeholder elegante para sabor sem foto real (configurável) */
function ProductPlaceholder({ accent, name }: { accent: string; name: string }) {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      <div
        className="flex h-[76%] w-[76%] flex-col items-center justify-center gap-4 rounded-full"
        style={{ background: `radial-gradient(circle at 50% 42%, ${accent}30, transparent 68%)` }}
      >
        <span className="font-serif text-4xl tracking-tight sm:text-5xl" style={{ color: accent }}>
          {name}
        </span>
        <span className="font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/45">
          Foto em breve
        </span>
      </div>
    </div>
  );
}

/* Desfecho / clímax: i.sí + seu negócio (composição minimalista) */
function PartnerScene({ accent }: { accent: string }) {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.6 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <div className="pointer-events-none relative flex flex-col items-center justify-center text-center">
      <motion.span {...rise(0.05)} className="font-sans text-[0.58rem] uppercase tracking-eyebrow text-[#efe9dd]/45">
        A combinação final
      </motion.span>
      <motion.span {...rise(0.12)} className="mt-5 font-serif text-[clamp(3.5rem,13vw,7rem)] leading-[0.85] tracking-tight text-[#efe9dd]">
        i.sí
      </motion.span>
      <motion.span {...rise(0.24)} className="my-2 font-serif text-3xl leading-none sm:text-4xl" style={{ color: accent }}>
        +
      </motion.span>
      <motion.span
        {...rise(0.34)}
        className="font-serif text-[clamp(2.2rem,9vw,4.25rem)] leading-[0.92] tracking-tight"
        style={{ color: "transparent", WebkitTextStroke: `1px ${accent}` }}
      >
        SEU NEGÓCIO
      </motion.span>
      <motion.p {...rise(0.46)} className="mt-6 font-serif text-lg italic text-[#efe9dd]/80">
        E com o seu negócio?
      </motion.p>
      <motion.a
        {...rise(0.56)}
        href="/#formulario"
        data-no-drag
        className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-sans text-xs uppercase tracking-wide-editorial transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9ad78]"
        style={{ backgroundColor: accent, color: "#171310" }}
      >
        Quero ser parceiro
        <span aria-hidden>→</span>
      </motion.a>
    </div>
  );
}

/* ========================================================================== */
/* Navegação editorial: 01 — CHOCOLATE + sublinhado reativo                   */
/* ========================================================================== */

function NavItem({
  state,
  index,
  progress,
  cream,
  isActive,
  onSelect,
}: {
  state: ExperienceState;
  index: number;
  progress: MotionValue<number>;
  cream: MotionValue<number>;
  isActive: boolean;
  onSelect: () => void;
}) {
  const proximity = useTransform(progress, (p) => clamp(1 - Math.abs(index - p), 0, 1));
  // Texto: escuro sobre creme, claro sobre o desfecho escuro. Alpha por proximidade.
  const labelColor = useTransform([proximity, cream] as MotionValue<number>[], ([px, cr]: number[]) =>
    mixRgba(CREAM, INK, cr, 0.5 + 0.5 * px),
  );
  const indexColor = useTransform(proximity, (px) => `rgba(201,173,120,${0.5 + 0.5 * px})`);
  const barScale = proximity;

  return (
    <button
      type="button"
      data-no-drag
      onClick={onSelect}
      aria-current={isActive ? "true" : undefined}
      className="group relative flex flex-col gap-1.5 pb-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#c9ad78]"
    >
      <span className="flex items-baseline gap-2">
        <motion.span style={{ color: indexColor }} className="font-sans text-[0.6rem] tabular-nums tracking-wide-editorial">
          {state.index}
        </motion.span>
        <motion.span aria-hidden style={{ color: labelColor }} className="text-[0.6rem]">
          —
        </motion.span>
        <motion.span style={{ color: labelColor }} className="font-sans text-[0.7rem] uppercase tracking-wide-editorial">
          {state.navLabel}
        </motion.span>
      </span>
      <motion.span
        aria-hidden
        style={{ scaleX: barScale }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#c9ad78]"
      />
    </button>
  );
}

/* ========================================================================== */
/* Barra de progresso                                                         */
/* ========================================================================== */

function ProgressLine({ progress, cream }: { progress: MotionValue<number>; cream: MotionValue<number> }) {
  const fill = useTransform(progress, (p) => `${(clamp(p, 0, LAST) / LAST) * 100}%`);
  const track = useTransform(cream, (cr) => mixRgba(CREAM, INK, cr, 0.18));
  return (
    <motion.div style={{ backgroundColor: track }} className="relative h-px w-full max-w-lg">
      <motion.div aria-hidden style={{ width: fill }} className="absolute inset-y-0 left-0 bg-[#c9ad78]" />
      <div className="absolute inset-0 flex items-center justify-between">
        {EXPERIENCE_STATES.map((s, i) => (
          <StateNode key={s.id} progress={progress} cream={cream} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function StateNode({
  progress,
  cream,
  index,
}: {
  progress: MotionValue<number>;
  cream: MotionValue<number>;
  index: number;
}) {
  const scale = useTransform(progress, (p) => clamp(1 - Math.abs(index - p) * 0.6, 0.6, 1));
  const bg = useTransform([progress, cream] as MotionValue<number>[], ([p, cr]: number[]) =>
    Math.abs(index - p) < 0.5 ? "rgba(201,173,120,1)" : mixRgba(CREAM, INK, cr, 0.4),
  );
  return <motion.span aria-hidden style={{ scale, backgroundColor: bg }} className="h-1.5 w-1.5 rounded-full" />;
}
