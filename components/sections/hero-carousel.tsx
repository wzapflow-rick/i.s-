"use client";

/**
 * HERO 3D CAROUSEL — "i.sí combina."
 * --------------------------------------------------------------------------
 * Um hero full-viewport inspirado na estética "3D shape": os potes de sabor
 * giram num coverflow com perspectiva real (centro nítido, laterais inclinadas
 * e desfocadas). Todo o ambiente — fundo profundo, brilho, palavra gigante ao
 * fundo, textos e navegação — troca junto ao mudar de sabor.
 *
 * Usa apenas transform/opacity/filter/background-color (GPU-friendly), sem
 * WebGL. Navegação por botões, clique nas laterais, teclado, swipe e autoplay.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Setas em SVG inline (o projeto não usa lucide-react). */
function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

interface Flavor {
  key: string;
  /** Palavra gigante ao fundo. */
  word: string;
  name: string;
  tagline: string;
  description: string;
  /** Fundo profundo da cena. */
  bg: string;
  /** Cor de brilho/realce do sabor. */
  glow: string;
  src: string;
  alt: string;
}

const FLAVORS: Flavor[] = [
  {
    key: "chocolate",
    word: "Chocolate",
    name: "Chocolate Intenso",
    tagline: "Cacau encorpado, pedaços generosos.",
    description:
      "Cremosidade densa com lascas e calda de chocolate. O clássico que sustenta qualquer vitrine.",
    bg: "#2a1712",
    glow: "#c9976a",
    src: "/products/tub-chocolate.png",
    alt: "Pote i.sí de gelato de chocolate com pedaços e calda, sobre fundo escuro",
  },
  {
    key: "morango",
    word: "Morango",
    name: "Morango Real",
    tagline: "Fruta de verdade, doçura na medida.",
    description:
      "Pedaços de morango e calda vermelha viva sobre um creme leve. Frescor que vende sozinho.",
    bg: "#551d29",
    glow: "#e79ba7",
    src: "/products/tub-morango.png",
    alt: "Pote i.sí de gelato de morango com frutas e calda, sobre fundo escuro",
  },
  {
    key: "pistache",
    word: "Pistache",
    name: "Pistache Siciliano",
    tagline: "Amêndoa torrada, final elegante.",
    description:
      "Pistache torrado com toques de chocolate. O sabor premium que eleva o mix da sua operação.",
    bg: "#232d1c",
    glow: "#b6c98a",
    src: "/products/tub-pistache.png",
    alt: "Pote i.sí de gelato de pistache com castanhas e chocolate, sobre fundo escuro",
  },
];

const N = FLAVORS.length;
const DURATION = 700; // ms — sincroniza fundo, cards e textos
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const AUTOPLAY = 5000; // ms

type Role = "center" | "left" | "right";

function roleFor(index: number, active: number): Role {
  if (index === active) return "center";
  if (index === (active + 1) % N) return "right";
  return "left";
}

export function Hero3DCarousel() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const lockRef = useRef(false);
  const swipeRef = useRef<number | null>(null);

  // Detecta viewport para calibrar tamanhos/perspectiva.
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = useCallback((dir: "next" | "prev") => {
    if (lockRef.current) return;
    lockRef.current = true;
    setActive((prev) =>
      dir === "next" ? (prev + 1) % N : (prev + N - 1) % N,
    );
    window.setTimeout(() => {
      lockRef.current = false;
    }, DURATION);
  }, []);

  // Teclado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "ArrowLeft") navigate("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Autoplay (respeita reduced motion e pausa no hover).
  useEffect(() => {
    if (paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(() => navigate("next"), AUTOPLAY);
    return () => window.clearInterval(id);
  }, [paused, navigate]);

  const current = FLAVORS[active];

  // Dimensões do card (paisagem 3:2, mesma proporção das fotos).
  const cardW = isMobile ? 300 : 560;
  const cardH = Math.round(cardW * (2 / 3));

  function styleForRole(role: Role): React.CSSProperties {
    const base: React.CSSProperties = {
      transition: `transform ${DURATION}ms ${EASE}, filter ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}, left ${DURATION}ms ${EASE}`,
      willChange: "transform, filter, opacity, left",
      width: cardW,
      height: cardH,
    };
    if (role === "center") {
      return {
        ...base,
        left: "50%",
        transform: `translateX(-50%) translateZ(0) rotateY(0deg) scale(${isMobile ? 1 : 1.12})`,
        filter: "none",
        opacity: 1,
        zIndex: 20,
      };
    }
    if (role === "left") {
      return {
        ...base,
        left: isMobile ? "22%" : "27%",
        transform: `translateX(-50%) rotateY(38deg) scale(${isMobile ? 0.6 : 0.72})`,
        filter: "blur(2px) brightness(0.7)",
        opacity: isMobile ? 0 : 0.5,
        zIndex: 10,
      };
    }
    return {
      ...base,
      left: isMobile ? "78%" : "73%",
      transform: `translateX(-50%) rotateY(-38deg) scale(${isMobile ? 0.6 : 0.72})`,
      filter: "blur(2px) brightness(0.7)",
      opacity: isMobile ? 0 : 0.5,
      zIndex: 10,
    };
  }

  return (
    <section
      aria-label="Sabores i.sí"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: current.bg,
        transition: `background-color ${DURATION}ms ${EASE}`,
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={(e) => {
        swipeRef.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipeRef.current == null) return;
        const dx = e.clientX - swipeRef.current;
        if (Math.abs(dx) > 48) navigate(dx < 0 ? "next" : "prev");
        swipeRef.current = null;
      }}
    >
      <div className="relative h-[100svh] min-h-[620px] w-full">
        {/* Brilho radial do sabor, atrás do card central */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "70vw",
            height: "70vw",
            maxWidth: 900,
            maxHeight: 900,
            background: `radial-gradient(circle, ${current.glow}44 0%, transparent 60%)`,
            transition: `background ${DURATION}ms ${EASE}`,
            zIndex: 1,
          }}
        />

        {/* Palavra gigante fantasma ao fundo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
          style={{ top: "16%", zIndex: 2 }}
        >
          {FLAVORS.map((f, i) => (
            <span
              key={f.key}
              className="font-serif absolute whitespace-nowrap uppercase"
              style={{
                fontSize: "clamp(72px, 20vw, 320px)",
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                opacity: i === active ? 0.08 : 0,
                transition: `opacity ${DURATION}ms ${EASE}`,
              }}
            >
              {f.word}
            </span>
          ))}
        </div>

        {/* Coverflow 3D */}
        <div
          className="absolute inset-0"
          style={{ perspective: 1800, zIndex: 3 }}
        >
          {FLAVORS.map((f, i) => {
            const role = roleFor(i, active);
            return (
              <button
                key={f.key}
                type="button"
                aria-label={`Ver sabor ${f.name}`}
                tabIndex={role === "center" ? -1 : 0}
                onClick={() => {
                  if (role === "center") return;
                  navigate(role === "right" ? "next" : "prev");
                }}
                className="absolute top-1/2 origin-center cursor-pointer rounded-[1.4rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{
                  ...styleForRole(role),
                  transform: `${(styleForRole(role).transform as string) ?? ""} translateY(-50%)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <span
                  className="relative block h-full w-full overflow-hidden rounded-[1.4rem]"
                  style={{
                    boxShadow:
                      role === "center"
                        ? `0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px ${current.glow}55`
                        : "0 20px 40px -16px rgba(0,0,0,0.6)",
                  }}
                >
                  <Image
                    src={f.src || "/placeholder.svg"}
                    alt={f.alt}
                    fill
                    priority={i === 0}
                    draggable={false}
                    sizes="(max-width: 640px) 80vw, 620px"
                    className="object-cover"
                  />
                  {/* Vinheta sutil para fundir a base preta da foto no card */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.35) 100%)",
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Eyebrow topo-centro (abaixo do header fixo) */}
        <div
          className="absolute inset-x-0 flex justify-center"
          style={{ top: "6.5rem", zIndex: 40 }}
        >
          <p
            className="font-sans text-[0.68rem] font-medium uppercase tracking-eyebrow text-white"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
          >
            Gelato artesanal — feito para combinar
          </p>
        </div>

        {/* Bloco inferior esquerdo: nome do sabor + descrição + navegação */}
        <div
          className="absolute bottom-8 left-4 sm:bottom-16 sm:left-16"
          style={{ zIndex: 60, maxWidth: 360 }}
        >
          <div className="relative min-h-[4.6rem] sm:min-h-[3.4rem]">
            {FLAVORS.map((f, i) => (
              <div
                key={f.key}
                className="absolute inset-0"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform:
                    i === active ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
                  pointerEvents: i === active ? "auto" : "none",
                }}
              >
                <p
                  className="font-serif text-2xl leading-none sm:text-4xl"
                  style={{ color: "#fff" }}
                >
                  {f.name}
                </p>
                <p
                  className="mt-2 font-sans text-xs uppercase tracking-wide-editorial"
                  style={{ color: f.glow }}
                >
                  {f.tagline}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-5 mt-16 hidden max-w-[320px] font-sans text-sm leading-relaxed text-white/80 sm:block">
            {current.description}
          </p>

          <div className="mt-8 flex items-center gap-3 sm:mt-0">
            <button
              type="button"
              onClick={() => navigate("prev")}
              aria-label="Sabor anterior"
              className="flex size-12 items-center justify-center rounded-full border-2 border-white/70 text-white transition-all duration-150 hover:scale-110 hover:bg-white/10 sm:size-14"
            >
              <ArrowLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => navigate("next")}
              aria-label="Próximo sabor"
              className="flex size-12 items-center justify-center rounded-full border-2 border-white/70 text-white transition-all duration-150 hover:scale-110 hover:bg-white/10 sm:size-14"
            >
              <ArrowRight className="size-6" />
            </button>

            {/* Indicadores */}
            <div className="ml-2 flex items-center gap-1.5">
              {FLAVORS.map((f, i) => (
                <span
                  key={f.key}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 22 : 8,
                    backgroundColor:
                      i === active ? current.glow : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA inferior direito */}
        <a
          href="#formulario"
          className={cn(
            "group absolute bottom-8 right-4 flex items-center gap-2 sm:bottom-16 sm:right-12",
            "font-serif uppercase text-white/90 transition-opacity duration-200 hover:text-white",
          )}
          style={{
            zIndex: 60,
            fontSize: "clamp(18px, 3.4vw, 44px)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          <span className="relative inline-block whitespace-nowrap">
            {/* Camada base — texto suave */}
            <span className="text-white/90">Seja parceiro</span>
            {/* Camada de brilho — cópia na cor do sabor, mascarada pela varredura */}
            <span
              aria-hidden="true"
              className="shiny-sweep pointer-events-none absolute inset-0"
              style={{ color: current.glow }}
            >
              Seja parceiro
            </span>
          </span>
          <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1 sm:size-8" />
        </a>
      </div>
    </section>
  );
}
