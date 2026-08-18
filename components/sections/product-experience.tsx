"use client";

/**
 * PRODUCT EXPERIENCE — "i.sí combina."
 * --------------------------------------------------------------------------
 * Uma cena única onde o produto muda de estado por drag/swipe e TODO o
 * ambiente (fundo, detalhe gráfico, texto, assinatura) muda junto, em tempo
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

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function ProductExperience() {
  const prefersReduced = useReducedMotion() ?? false;

  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  const [active, setActive] = useState(0);
  const [announced, setAnnounced] = useState(EXPERIENCE_STATES[0].name);

  // Índice ativo (mais próximo) → z-index, aria-current e leitura acessível.
  useMotionValueEvent(progress, "change", (v) => {
    const nearest = clamp(Math.round(v), 0, LAST);
    setActive((prev) => (prev === nearest ? prev : nearest));
  });

  useEffect(() => {
    setAnnounced(EXPERIENCE_STATES[active].name);
  }, [active]);

  // ---- Fundo do ambiente: interpola a cor entre todos os estados ----------
  const bgColor = useTransform(
    progress,
    EXPERIENCE_STATES.map((_, i) => i),
    EXPERIENCE_STATES.map((s) => s.bg),
  );

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
  const drag = useRef({
    active: false,
    startX: 0,
    startProgress: 0,
    travel: 520,
    moved: false,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (prefersReduced) return; // reduced-motion: só nav/teclado
    // Ignora cliques em controles interativos (nav, CTA).
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
    // Arrastar para a esquerda (dx < 0) avança (progress aumenta).
    let next = drag.current.startProgress - dx / drag.current.travel;
    // Rubber-band nas extremidades.
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
      // Só intercepta quando o gesto é claramente horizontal.
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

  return (
    <section
      aria-roledescription="Experiência de produto"
      aria-label="Escolha a sua combinação i.sí"
      className="relative isolate w-full overflow-hidden"
    >
      {/* Ambiente — cor que interpola em tempo real */}
      <motion.div
        aria-hidden
        style={{ backgroundColor: bgColor }}
        className="absolute inset-0 -z-10"
      />
      {/* Vinheta + grão sutil para profundidade editorial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 18%, transparent 40%, rgba(0,0,0,0.32) 100%)",
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
        {/* ---------- Cabeçalho editorial (posição fixa) ---------- */}
        <header className="relative z-20 mx-auto flex w-full max-w-[1500px] flex-col px-5 pt-24 sm:px-8 sm:pt-28 lg:px-16">
          <p className="inline-flex items-center gap-3 font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/60">
            <span className="inline-block h-px w-8 bg-[#efe9dd]/40" />
            Experiência i.sí
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-[2rem] leading-[0.98] tracking-tight text-balance text-[#efe9dd] sm:text-5xl">
            Escolha a sua combinação.
          </h2>
          <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-[#efe9dd]/70 sm:text-base">
            Cada sabor cria uma nova possibilidade.
          </p>
        </header>

        {/* ---------- Palco do produto ---------- */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          {/* Camadas gráficas + produto, uma por estado */}
          {EXPERIENCE_STATES.map((state, i) => (
            <SceneLayer
              key={state.id}
              state={state}
              index={i}
              progress={progress}
              reduced={prefersReduced}
              active={active === i}
            />
          ))}
        </div>

        {/* ---------- Rodapé: assinatura, progresso e navegação ---------- */}
        <footer className="relative z-20 mx-auto w-full max-w-[1500px] px-5 pb-8 sm:px-8 lg:px-16">
          {/* Barra de progresso elegante */}
          <ProgressLine progress={progress} />

          <nav
            aria-label="Combinações"
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {EXPERIENCE_STATES.map((state, i) => {
              const isActive = active === i;
              return (
                <button
                  key={state.id}
                  type="button"
                  data-no-drag
                  onClick={() => goTo(i)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-baseline gap-2 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[#c9ad78]"
                >
                  <span
                    className="font-sans text-[0.62rem] tabular-nums tracking-wide-editorial transition-colors"
                    style={{ color: isActive ? "#c9ad78" : "rgba(239,233,221,0.45)" }}
                  >
                    {state.index}
                  </span>
                  <span
                    className="font-sans text-xs uppercase tracking-wide-editorial transition-colors"
                    style={{ color: isActive ? "#efe9dd" : "rgba(239,233,221,0.55)" }}
                  >
                    {state.navLabel}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Dica de gesto (some sob reduced-motion) */}
          {!prefersReduced && (
            <p className="mt-4 font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/35">
              Arraste para combinar
            </p>
          )}
        </footer>

        {/* Leitura acessível do estado atual */}
        <p aria-live="polite" className="sr-only">
          {announced}
        </p>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* Camada de cena: detalhe gráfico + produto + texto de um estado             */
/* ========================================================================== */

function SceneLayer({
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
  // Distância relativa d = index - progress (0 = centralizado).
  // Produto desliza 72% da própria largura por passo; escala/rotação leves.
  const productX = useTransform(progress, (p) =>
    reduced ? "0%" : `${(index - p) * 72}%`,
  );
  const productScale = useTransform(progress, (p) =>
    reduced ? 1 : clamp(1 - Math.abs(index - p) * 0.16, 0.72, 1),
  );
  const productRotate = useTransform(progress, (p) =>
    reduced ? 0 : (index - p) * 4,
  );
  const layerOpacity = useTransform(progress, (p) =>
    clamp(1 - Math.abs(index - p) * 1.15, 0, 1),
  );
  // Gráficos ao fundo: menos deslocamento = sensação de profundidade.
  const graphicsX = useTransform(progress, (p) =>
    reduced ? "0%" : `${(index - p) * 26}%`,
  );
  // Texto: mantém a posição horizontal; só opacity + leve translateY.
  const textY = useTransform(progress, (p) =>
    reduced ? 0 : (index - p) * 22,
  );

  return (
    <motion.div
      aria-hidden={!active}
      style={{ opacity: layerOpacity, zIndex: active ? 30 : 10 }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {/* Detalhe gráfico editorial da cena */}
      <motion.div style={{ x: graphicsX }} className="absolute inset-0">
        <SceneGraphics accent={state.accent} kind={state.kind} />
      </motion.div>

      {/* Assinatura vertical (lateral direita) */}
      <motion.span
        style={{ x: graphicsX }}
        aria-hidden
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[clamp(2.5rem,7vw,5rem)] leading-none tracking-tight sm:block lg:right-8"
      >
        <span
          className="block [writing-mode:vertical-rl] rotate-180"
          style={{ color: state.accent, opacity: 0.16 }}
        >
          {state.wordmark}
        </span>
      </motion.span>

      {/* Produto central */}
      <motion.div
        style={{ x: productX, scale: productScale, rotate: productRotate }}
        className="relative z-10 flex w-full max-w-[560px] items-center justify-center px-6"
      >
        {state.kind === "partner" ? (
          <PartnerScene accent={state.accent} />
        ) : state.kind === "teaser" ? (
          <TeaserScene accent={state.accent} name={state.name} />
        ) : state.image ? (
          <ProductPhoto image={state.image} name={state.name} priority={index === 0} />
        ) : (
          <ProductPlaceholder accent={state.accent} name={state.name} />
        )}
      </motion.div>

      {/* Texto do estado (nome + descrição) — só para foto real; placeholder
          e teaser já carregam o texto na própria composição central. */}
      {state.kind === "flavor" && state.image && (
        <motion.div
          style={{ y: textY }}
          className="absolute bottom-[16%] left-5 z-20 max-w-xs sm:left-8 lg:bottom-[20%] lg:left-16"
        >
          <p
            className="font-serif text-3xl leading-none tracking-tight sm:text-4xl"
            style={{ color: "#efe9dd" }}
          >
            {state.name}
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#efe9dd]/70">
            {state.description}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ========================================================================== */
/* Produto — foto real em moldura circular flutuante                          */
/* ========================================================================== */

function ProductPhoto({
  image,
  name,
  priority,
}: {
  image: NonNullable<ExperienceState["image"]>;
  name: string;
  priority: boolean;
}) {
  return (
    <div className="relative aspect-square w-[min(78vw,30rem)]">
      {/* Halo suave atrás do produto */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full blur-2xl"
        style={{ background: "rgba(0,0,0,0.35)", transform: "translateY(8%) scale(0.9)" }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
        <Image
          src={image.src || "/placeholder.svg"}
          alt={`Gelato i.sí de ${name}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 78vw, 30rem"
          className="object-cover"
          style={{ objectPosition: image.objectPosition }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/* Placeholder elegante para sabor sem foto real (claramente configurável) */
function ProductPlaceholder({ accent, name }: { accent: string; name: string }) {
  return (
    <div className="relative aspect-square w-[min(78vw,30rem)]">
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-full border border-dashed"
        style={{
          borderColor: `${accent}66`,
          background: `radial-gradient(circle at 50% 40%, ${accent}22, transparent 70%)`,
        }}
      >
        <span
          className="font-serif text-4xl tracking-tight sm:text-5xl"
          style={{ color: accent }}
        >
          {name}
        </span>
        <span className="font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/45">
          Foto em breve
        </span>
      </div>
    </div>
  );
}

/* Cena de portfólio (sem produto) */
function TeaserScene({ accent, name }: { accent: string; name: string }) {
  return (
    <div className="relative flex aspect-square w-[min(78vw,30rem)] flex-col items-center justify-center text-center">
      <span
        className="font-serif text-[clamp(3rem,10vw,6rem)] leading-none tracking-tight"
        style={{ color: accent }}
      >
        +
      </span>
      <span className="mt-2 font-serif text-2xl tracking-tight text-[#efe9dd] sm:text-3xl">
        {name}
      </span>
      <span className="mt-3 max-w-[16rem] font-sans text-sm leading-relaxed text-[#efe9dd]/65">
        Novas combinações entram na i.sí quando alcançam o mesmo padrão.
      </span>
    </div>
  );
}

/* Desfecho: i.sí + seu negócio */
function PartnerScene({ accent }: { accent: string }) {
  return (
    <div className="relative flex aspect-square w-[min(82vw,32rem)] flex-col items-center justify-center text-center">
      <span className="font-serif text-[clamp(3rem,12vw,6rem)] leading-[0.9] tracking-tight text-[#efe9dd]">
        i.sí
      </span>
      <span
        className="my-1 font-serif text-3xl leading-none sm:text-4xl"
        style={{ color: accent }}
      >
        +
      </span>
      <span
        className="font-serif text-[clamp(2rem,8vw,3.75rem)] leading-[0.95] tracking-tight"
        style={{
          color: "transparent",
          WebkitTextStroke: `1px ${accent}`,
        }}
      >
        SEU NEGÓCIO
      </span>
      <p className="mt-5 font-sans text-sm leading-relaxed text-[#efe9dd]/70">
        E com o seu negócio?
      </p>
      <a
        href="/#formulario"
        data-no-drag
        className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 font-sans text-xs uppercase tracking-wide-editorial transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9ad78]"
        style={{ backgroundColor: accent, color: "#171310" }}
      >
        Quero ser parceiro
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}

/* ========================================================================== */
/* Detalhe gráfico editorial (5–10 elementos leves por cena)                  */
/* ========================================================================== */

function SceneGraphics({
  accent,
  kind,
}: {
  accent: string;
  kind: ExperienceState["kind"];
}) {
  // Poucos elementos, apenas transform/opacity, sem animação infinita.
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Anel amplo atrás do produto */}
      <div
        className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: `${accent}33` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: `${accent}22` }}
      />
      {/* Pontos / detalhes soltos */}
      <span
        className="absolute left-[14%] top-[30%] h-2 w-2 rounded-full"
        style={{ backgroundColor: accent, opacity: 0.5 }}
      />
      <span
        className="absolute right-[18%] top-[24%] h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent, opacity: 0.4 }}
      />
      <span
        className="absolute left-[22%] bottom-[26%] h-1 w-1 rounded-full"
        style={{ backgroundColor: accent, opacity: 0.45 }}
      />
      {/* Linha fina editorial */}
      <span
        className="absolute right-[12%] top-1/2 h-px w-[10vw]"
        style={{ backgroundColor: `${accent}55` }}
      />
      {kind === "flavor" && (
        <span
          className="absolute left-[10%] top-1/2 h-px w-[8vw]"
          style={{ backgroundColor: `${accent}44` }}
        />
      )}
    </div>
  );
}

/* ========================================================================== */
/* Barra de progresso minimalista                                             */
/* ========================================================================== */

function ProgressLine({ progress }: { progress: MotionValue<number> }) {
  const fill = useTransform(progress, (p) => `${(clamp(p, 0, LAST) / LAST) * 100}%`);
  return (
    <div className="relative h-px w-full max-w-md bg-[#efe9dd]/15">
      <motion.div
        aria-hidden
        style={{ width: fill }}
        className="absolute inset-y-0 left-0 bg-[#c9ad78]"
      />
      {/* Nós dos estados */}
      <div className="absolute inset-0 flex items-center justify-between">
        {EXPERIENCE_STATES.map((s, i) => (
          <StateNode key={s.id} progress={progress} index={i} />
        ))}
      </div>
    </div>
  );
}

function StateNode({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const scale = useTransform(progress, (p) =>
    clamp(1 - Math.abs(index - p) * 0.6, 0.6, 1),
  );
  const bg = useTransform(progress, (p) =>
    Math.abs(index - p) < 0.5 ? "#c9ad78" : "rgba(239,233,221,0.35)",
  );
  return (
    <motion.span
      aria-hidden
      style={{ scale, backgroundColor: bg }}
      className="h-1.5 w-1.5 rounded-full"
    />
  );
}
