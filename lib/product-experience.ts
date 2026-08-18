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
  /** Microelemento editorial — palavra-humor discreta (ex.: "INTENSO"). */
  mood: string;
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
    description: "Intenso, cremoso e marcante.",
    mood: "INTENSO",
    kind: "flavor",
    image: {
      src: "/products/tub-chocolate.png",
      alt: "Pote i.sí de gelato de chocolate com montanha de gelato e pedaços de chocolate voando",
      objectPosition: "center",
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
    description: "Vivo, delicado e fresco.",
    mood: "FRESCO",
    kind: "flavor",
    image: {
      src: "/products/tub-morango.png",
      alt: "Pote i.sí de gelato de morango com morangos ao redor",
      objectPosition: "center",
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
    description: "Elegante e aveludado.",
    mood: "ELEGANTE",
    kind: "flavor",
    image: {
      src: "/products/tub-pistache.png",
      alt: "Pote i.sí de gelato de pistache com pistaches e folhas de hortelã ao redor",
      objectPosition: "center",
    },
    bg: "#2e3b29",
    accent: "#a9c58c",
  },
  {
    id: "mais-sabores",
    index: "04",
    name: "Mais sabores",
    navLabel: "Mais sabores",
    wordmark: "PORTFÓLIO",
    description: "Novas possibilidades, sempre com critério.",
    mood: "SURPREENDENTE",
    kind: "flavor",
    image: {
      src: "/products/tub-mais-sabores.png",
      alt: "Pote i.sí de gelato de caramelo e cookies com pedaços ao redor",
      objectPosition: "center",
    },
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
    mood: "PARCERIA",
    kind: "partner",
    image: null,
    bg: "#171310",
    accent: "#c9ad78",
  },
];
