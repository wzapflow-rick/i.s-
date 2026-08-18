// ============================================================================
// PRODUCT EXPERIENCE — dados configuráveis
// ----------------------------------------------------------------------------
// Cada "estado" é uma cena completa: produto + ambiente (cor de fundo),
// detalhe gráfico (accent), texto e assinatura vertical.
//
// COMO ADICIONAR / TROCAR UM SABOR:
//   1. Adicione (ou edite) um objeto neste array.
//   2. `kind: "flavor"` usa a foto em `image`. Se ainda não houver foto real,
//      use `image: null` — o componente mostra um placeholder elegante.
//   3. `kind: "teaser"` = cena de portfólio (sem produto).
//   4. `kind: "partner"` = desfecho de parceria (i.sí + seu negócio).
//   5. As cores são deep tones sofisticados; o texto é sempre claro (creme).
//
// O componente NÃO depende da ordem/quantidade — a barra de progresso e a
// navegação se ajustam automaticamente ao tamanho do array.
// ============================================================================

import { SITE_IMAGES } from "@/lib/site-images";

export interface ExperienceProductImage {
  src: string;
  alt: string;
  /** Foco do enquadramento (CSS object-position). */
  objectPosition: string;
}

export interface ExperienceState {
  /** Identificador estável. */
  id: string;
  /** Número editorial exibido na navegação (ex.: "01"). */
  index: string;
  /** Nome exibido (sabor / estado). */
  name: string;
  /** Rótulo curto na navegação inferior. */
  navLabel: string;
  /** Palavra vertical de assinatura (lateral). */
  wordmark: string;
  /** Copy visual provisória — NÃO são especificações técnicas do cliente. */
  description: string;
  kind: "flavor" | "teaser" | "partner";
  /** Foto real do produto. `null` = placeholder configurável. */
  image: ExperienceProductImage | null;
  /** Cor do ambiente (fundo da cena). */
  bg: string;
  /** Tom do detalhe gráfico da cena. */
  accent: string;
}

export const EXPERIENCE_STATES: ExperienceState[] = [
  {
    id: "chocolate",
    index: "01",
    name: "Chocolate",
    navLabel: "Chocolate",
    wordmark: "CHOCOLATE",
    description: "Intenso, cremoso e pensado para destacar a experiência.",
    kind: "flavor",
    image: {
      src: SITE_IMAGES.hero.src,
      alt: SITE_IMAGES.hero.alt,
      objectPosition: SITE_IMAGES.hero.objectPosition,
    },
    bg: "#3b2118",
    accent: "#c9ad78",
  },
  {
    id: "morango",
    index: "02",
    name: "Morango",
    navLabel: "Morango",
    wordmark: "MORANGO",
    description: "Vivo e delicado, para composições que pedem frescor.",
    kind: "flavor",
    image: {
      src: SITE_IMAGES.gelato10L.src,
      alt: SITE_IMAGES.gelato10L.alt,
      objectPosition: SITE_IMAGES.gelato10L.objectPosition,
    },
    bg: "#6e2233",
    accent: "#e8a6b0",
  },
  {
    id: "pistache",
    index: "03",
    name: "Pistache",
    navLabel: "Pistache",
    wordmark: "PISTACHE",
    description: "Em breve no portfólio i.sí.",
    kind: "flavor",
    // Sem fotografia real ainda — placeholder elegante e configurável.
    image: null,
    bg: "#2e3b29",
    accent: "#a9c58c",
  },
  {
    id: "mais-sabores",
    index: "04",
    name: "Mais sabores",
    navLabel: "Mais sabores",
    wordmark: "PORTFÓLIO",
    description: "O portfólio i.sí cresce com critério.",
    kind: "teaser",
    image: null,
    bg: "#201a14",
    accent: "#c9ad78",
  },
  {
    id: "seu-negocio",
    index: "05",
    name: "Seu negócio",
    navLabel: "Seu negócio",
    wordmark: "PARCERIA",
    description: "E com o seu negócio?",
    kind: "partner",
    image: null,
    bg: "#171310",
    accent: "#c9ad78",
  },
];
