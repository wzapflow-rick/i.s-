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
      "Para quem quer explorar sabores, testar combinações e construir o mix com mais liberdade.",
    bestFor: "Mais variedade. Mais possibilidades.",
    image: SITE_IMAGES.gelato5L,
  },
  {
    slug: "caixa-10l",
    size: "10L",
    name: "Caixa de 10 litros",
    short: "Para quem já tem giro e quer escalar com margem.",
    description:
      "Para operações de maior giro que precisam de volume, eficiência e consistência.",
    bestFor: "Mais escala. Mais eficiência.",
    image: SITE_IMAGES.gelato10L,
  },
];
