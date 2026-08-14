// Produto confirmado: gelato artesanal em caixas de 5L e 10L.
// A arquitetura abaixo está pronta para receber novas categorias no futuro,
// mas NÃO inventamos linhas ainda não confirmadas pelo cliente.
// As imagens vêm do manifesto central (lib/site-images.ts) — troque lá.

import { SITE_IMAGES, type SiteImage } from "@/lib/site-images";

export interface GelatoFormat {
  slug: string;
  size: string;
  name: string;
  short: string;
  description: string;
  bestFor: string;
  image: SiteImage;
}

/** Formatos disponíveis hoje — o coração da oferta. */
export const GELATO_FORMATS: GelatoFormat[] = [
  {
    slug: "caixa-5l",
    size: "5L",
    name: "Caixa de 5 litros",
    short: "O formato certo para vitrines enxutas e curadas.",
    description:
      "Gelato artesanal 100% leite integral em caixa de 5 litros. O formato ideal para manter uma vitrine selecionada, com variedade de sabores e a rotatividade que preserva a qualidade em cada colherada.",
    bestFor: "Vitrines selecionadas e giro controlado",
    image: SITE_IMAGES.gelato5L,
  },
  {
    slug: "caixa-10l",
    size: "10L",
    name: "Caixa de 10 litros",
    short: "Para quem já tem giro e quer escalar com margem.",
    description:
      "O mesmo gelato artesanal 100% leite integral, em caixa de 10 litros. Pensado para negócios com alto giro que buscam eficiência de operação e a melhor relação de custo por litro.",
    bestFor: "Alto giro e maior eficiência",
    image: SITE_IMAGES.gelato10L,
  },
];

/**
 * Portfólio ampliado — posicionamento premium.
 * Comunica curadoria e exclusividade, sem tom de "em construção"
 * e sem nomear linhas que ainda não foram confirmadas.
 */
export const FUTURE_CATEGORY = {
  label: "Portfólio",
  headline: "Um portfólio conduzido com critério.",
  detail:
    "Cada nova linha só entra na i.sí quando alcança o mesmo padrão do nosso gelato. Nossos parceiros são os primeiros a conhecer cada novidade.",
} as const;
