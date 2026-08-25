"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import { SITE_IMAGES } from "@/lib/site-images";

/**
 * SEÇÃO 07 — A MARCA / POSICIONAMENTO
 * Composição editorial premium: preto profundo + fotografia real full bleed +
 * creme/off-white + dourado sutil. Pausa visual dentro da linguagem preta do
 * site. Copy de posicionamento no presente — sem narrativa de origem, números
 * ou anos inventados. Ampliar apenas com dados reais.
 */
export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax muito discreto na fotografia.
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="marca"
      className="border-t border-white/5"
      style={{ backgroundColor: "#0A0908" }}
    >
      <div className="grid gap-0 lg:grid-cols-[55fr_45fr]">
        {/* ESQUERDA — FOTOGRAFIA EM FULL BLEED (encosta na borda da viewport) */}
        <div
          ref={ref}
          className="relative min-h-[62vh] overflow-hidden lg:min-h-[88vh]"
        >
          <motion.div style={{ y: imgY }} className="absolute inset-[-6%]">
            <ImageReveal className="absolute inset-0">
              <Image
                src={SITE_IMAGES.texture.src}
                alt={SITE_IMAGES.texture.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                style={{
                  objectPosition: "center 72%",
                  // Tratamento cinematográfico neutro: pretos mais profundos,
                  // contraste maior, sombras densas, leve dessaturação e
                  // temperatura um pouco menos quente — preservando o brilho,
                  // a textura e a cor natural do chocolate.
                  filter:
                    "saturate(0.82) contrast(1.14) brightness(0.9) hue-rotate(-4deg)",
                }}
              />
            </ImageReveal>
          </motion.div>
          {/* Vinheta sutil integrando a foto ao fundo preto da direita */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,9,8,0.25) 0%, rgba(10,9,8,0) 30%, rgba(10,9,8,0) 70%, rgba(10,9,8,0.55) 100%)",
            }}
            aria-hidden
          />
          {SITE_IMAGES.texture.placeholder && (
            <span className="absolute left-5 top-5 rounded-full bg-black/60 px-3 py-1 font-sans text-[0.58rem] uppercase tracking-eyebrow text-white/70 backdrop-blur-sm">
              Foto ilustrativa
            </span>
          )}
        </div>

        {/* DIREITA — CONTEÚDO SOBRE PRETO */}
        <div className="flex items-center px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="max-w-md">
            <Reveal>
              {/* Cabeçalho editorial: A MARCA ──────── 04 */}
              <div className="mb-9 flex items-center gap-4">
                <span
                  className="font-sans text-[0.68rem] uppercase tracking-eyebrow"
                  style={{ color: "#c9ad78" }}
                >
                  A marca
                </span>
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: "rgba(201,173,120,0.28)" }}
                  aria-hidden
                />
                <span
                  className="font-sans text-[0.68rem] tracking-eyebrow"
                  style={{ color: "rgba(201,173,120,0.55)" }}
                >
                  04
                </span>
              </div>
              <h2
                className="font-serif text-[2.5rem] leading-[1.05] tracking-tight text-balance sm:text-5xl"
                style={{ color: "#efe9dd" }}
              >
                A i.sí nasceu para combinar.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div
                className="mt-7 max-w-sm space-y-4 font-sans text-[0.95rem] leading-relaxed"
                style={{ color: "#b3a898" }}
              >
                <p>
                  {/* Copy de posicionamento — sem narrativa de origem, anos ou
                      números. Ampliar apenas com fatos reais após briefing. */}
                  A i.sí é uma fabricante de gelato artesanal B2B. Trabalhamos
                  próximos de negócios que querem oferecer mais.
                </p>
                <p>
                  Trabalhamos com poucos parceiros, escolhidos com critério.
                  Porque proximidade também faz parte do nosso produto.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              {/* Assinatura editorial com linha vertical dourada */}
              <div className="mt-10 flex items-center gap-4">
                <span
                  className="h-11 w-px"
                  style={{ backgroundColor: "rgba(201,173,120,0.6)" }}
                  aria-hidden
                />
                <p
                  className="font-serif text-2xl italic leading-snug sm:text-[1.7rem]"
                  style={{ color: "#c9ad78" }}
                >
                  Poucos parceiros.
                  <br />
                  Muito cuidado.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
