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
          <p className="inline-flex items-center gap-3 font-sans text-[0.6rem] uppercase tracking-eyebrow text-[#efe9dd]/55">
            <span className="inline-block h-px w-8 bg-[#efe9dd]/35" />
            Experiência i.sí
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-[1.7rem] leading-[1.02] tracking-tight text-balance text-[#efe9dd] sm:text-[2.6rem]">
            Cada combinação cria uma experiência.
          </h2>
          <p className="mt-2 font-sans text-[0.7rem] uppercase tracking-eyebrow text-[#c9ad78]/80">
            Descubra a próxima.
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

        {/* ---------- Rodapé: progresso e navegação editorial ---------- */}
        <footer className="relative z-20 mx-auto w-full max-w-[1500px] px-5 pb-8 sm:px-8 lg:px-16">
          {/* Barra de progresso contínua entre estados */}
          <ProgressLine progress={progress} />

          <nav
            aria-label="Combinações"
            className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            {EXPERIENCE_STATES.map((state, i) => (
              <NavItem
                key={state.id}
                state={state}
                index={i}
                progress={progress}
                isActive={active === i}
                onSelect={() => goTo(i)}
              />
            ))}
          </nav>

          {/* Dica de gesto (some sob reduced-motion) */}
          {!prefersReduced && (
            <p className="mt-4 font-sans text-[0.58rem] uppercase tracking-eyebrow text-[#efe9dd]/30">
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
/* Item de navegação editorial: 01 — CHOCOLATE + sublinhado reativo           */
/* ========================================================================== */

function NavItem({
  state,
  index,
  progress,
  isActive,
  onSelect,
}: {
  state: ExperienceState;
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
  onSelect: () => void;
}) {
  // Proximidade contínua (1 = neste estado, 0 = a um passo ou mais).
  const proximity = useTransform(progress, (p) =>
    clamp(1 - Math.abs(index - p), 0, 1),
  );
  const labelColor = useTransform(proximity, [0, 1], [
    "rgba(239,233,221,0.5)",
    "rgba(239,233,221,1)",
  ]);
  const indexColor = useTransform(proximity, [0, 1], [
    "rgba(239,233,221,0.35)",
    "rgba(201,173,120,1)",
  ]);
  const barScale = useTransform(proximity, [0, 1], [0, 1]);

  return (
    <button
      type="button"
      data-no-drag
      onClick={onSelect}
      aria-current={isActive ? "true" : undefined}
      className="group relative flex flex-col gap-1.5 pb-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#c9ad78]"
    >
      <span className="flex items-baseline gap-2">
        <motion.span
          style={{ color: indexColor }}
          className="font-sans text-[0.6rem] tabular-nums tracking-wide-editorial"
        >
          {state.index}
        </motion.span>
        <span aria-hidden className="text-[0.6rem] text-[#efe9dd]/25">
          —
        </span>
        <motion.span
          style={{ color: labelColor }}
          className="font-sans text-[0.7rem] uppercase tracking-wide-editorial"
        >
          {state.navLabel}
        </motion.span>
      </span>
      {/* Sublinhado de progresso individual (dourado) */}
      <motion.span
        aria-hidden
        style={{ scaleX: barScale }}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-[#c9ad78]"
      />
    </button>
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
  // Produto desliza com profundidade; escala/rotação leves. Entra enquanto o
  // anterior sai — cor, produto, texto e gráficos mudam juntos (contínuo).
  const productX = useTransform(progress, (p) =>
    reduced ? "0%" : `${(index - p) * 66}%`,
  );
  const productScale = useTransform(progress, (p) =>
    reduced ? 1 : clamp(1 - Math.abs(index - p) * 0.14, 0.78, 1),
  );
  const productRotate = useTransform(progress, (p) =>
    reduced ? 0 : (index - p) * 3.5,
  );
  const layerOpacity = useTransform(progress, (p) =>
    clamp(1 - Math.abs(index - p) * 1.15, 0, 1),
  );
  // Gráficos ao fundo: menos deslocamento = sensação de profundidade.
  const graphicsX = useTransform(progress, (p) =>
    reduced ? "0%" : `${(index - p) * 24}%`,
  );
  // Assinatura vertical: parallax próprio, ainda mais lento (fundo profundo).
  const wordmarkX = useTransform(progress, (p) =>
    reduced ? "0%" : `${(index - p) * 14}%`,
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
        <SceneGraphics accent={state.accent} kind={state.kind} mood={state.mood} />
      </motion.div>

      {/* Assinatura vertical (lateral direita) — detalhe discreto, não compete */}
      <motion.span
        style={{ x: wordmarkX }}
        aria-hidden
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 select-none font-sans text-[clamp(1.4rem,3.4vw,2.4rem)] font-light uppercase leading-none tracking-[0.32em] sm:block lg:right-5"
      >
        <span
          className="block [writing-mode:vertical-rl] rotate-180"
          style={{ color: state.accent, opacity: 0.14 }}
        >
          {state.wordmark}
        </span>
      </motion.span>

      {/* Produto central — dominante, pode transbordar a composição */}
      <motion.div
        style={{ x: productX, scale: productScale, rotate: productRotate }}
        className="relative z-10 flex w-full max-w-[720px] items-center justify-center px-2 sm:px-6"
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
          className="absolute bottom-[15%] left-5 z-20 max-w-xs sm:left-8 lg:bottom-[19%] lg:left-16"
        >
          <span
            className="font-sans text-[0.58rem] uppercase tracking-eyebrow"
            style={{ color: state.accent }}
          >
            {state.mood}
          </span>
          <p
            className="mt-2 font-serif text-[2rem] leading-none tracking-tight sm:text-5xl"
            style={{ color: "#efe9dd" }}
          >
            {state.name}
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#efe9dd]/65">
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
    <div className="relative aspect-square w-[min(94vw,38rem)]">
      {/* Sombra de contato suave — ancora o produto sem moldura de slider */}
      <div
        aria-hidden
        className="absolute inset-x-[12%] bottom-[4%] -z-10 h-[26%] rounded-[50%] blur-2xl"
        style={{ background: "rgba(0,0,0,0.45)" }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-white/8 shadow-[0_60px_150px_-40px_rgba(0,0,0,0.75)]">
        <Image
          src={image.src || "/placeholder.svg"}
          alt={`Gelato i.sí de ${name}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 94vw, 38rem"
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
    <div className="relative aspect-square w-[min(90vw,34rem)]">
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${accent}2e, transparent 68%)`,
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

/* Desfecho / clímax: i.sí + seu negócio (composição minimalista) */
function PartnerScene({ accent }: { accent: string }) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.6 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <div className="relative flex w-[min(90vw,36rem)] flex-col items-center justify-center text-center">
      <motion.span
        {...rise(0.05)}
        className="font-sans text-[0.58rem] uppercase tracking-eyebrow text-[#efe9dd]/45"
      >
        A combinação final
      </motion.span>

      <motion.span
        {...rise(0.12)}
        className="mt-5 font-serif text-[clamp(3.5rem,13vw,7rem)] leading-[0.85] tracking-tight text-[#efe9dd]"
      >
        i.sí
      </motion.span>

      <motion.span
        {...rise(0.24)}
        className="my-2 font-serif text-3xl leading-none sm:text-4xl"
        style={{ color: accent }}
      >
        +
      </motion.span>

      <motion.span
        {...rise(0.34)}
        className="font-serif text-[clamp(2.2rem,9vw,4.25rem)] leading-[0.92] tracking-tight"
        style={{ color: "transparent", WebkitTextStroke: `1px ${accent}` }}
      >
        SEU NEGÓCIO
      </motion.span>

      <motion.p
        {...rise(0.46)}
        className="mt-6 font-serif text-lg italic text-[#efe9dd]/80"
      >
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
/* Detalhe gráfico editorial (5–10 elementos leves por cena)                  */
/* ========================================================================== */

function SceneGraphics({
  accent,
  kind,
  mood,
}: {
  accent: string;
  kind: ExperienceState["kind"];
  mood: string;
}) {
  // Sem círculos "de slider": apenas linhas incompletas, marcadores e etiqueta.
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Linha editorial superior, incompleta */}
      <span
        className="absolute left-0 top-[22%] h-px w-[22vw] max-w-[16rem]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}55)` }}
      />
      {/* Linha editorial inferior direita, incompleta */}
      <span
        className="absolute right-0 bottom-[28%] h-px w-[18vw] max-w-[13rem]"
        style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }}
      />
      {/* Microelemento: palavra-humor discreta (item 9) */}
      <span
        className="absolute right-[8%] top-[20%] hidden font-sans text-[0.58rem] uppercase tracking-eyebrow sm:block"
        style={{ color: `${accent}`, opacity: 0.55 }}
      >
        {mood}
      </span>
      {/* Marcadores soltos */}
      <span
        className="absolute left-[16%] top-[34%] h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: accent, opacity: 0.5 }}
      />
      <span
        className="absolute right-[22%] top-[30%] h-1 w-1 rounded-full"
        style={{ backgroundColor: accent, opacity: 0.4 }}
      />
      {kind === "flavor" && (
        <span
          className="absolute left-[20%] bottom-[30%] h-1 w-1 rounded-full"
          style={{ backgroundColor: accent, opacity: 0.4 }}
        />
      )}
      {/* Etiqueta discreta inferior esquerda */}
      <span
        className="absolute left-0 bottom-[16%] flex items-center gap-2 pl-5 sm:pl-8 lg:pl-16"
      >
        <span className="h-px w-6" style={{ backgroundColor: `${accent}66` }} />
        <span
          className="font-sans text-[0.52rem] uppercase tracking-eyebrow"
          style={{ color: "#efe9dd", opacity: 0.4 }}
        >
          i.sí · combina
        </span>
      </span>
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
