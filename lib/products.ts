// Produto confirmado: gelato artesanal em caixas de 5L e 10L.
// A arquitetura abaixo está pronta para receber novas categorias no futuro,
// mas NÃO inventamos linhas ainda não confirmadas pelo cliente.

export interface GelatoFormat {
  slug: string;
  size: string;
  name: string;
  short: string;
  description: string;
  bestFor: string;
  image: string;
}

/** Formatos disponíveis hoje — o coração da oferta. */
export const GELATO_FORMATS: GelatoFormat[] = [
  {
    slug: "caixa-5l",
    size: "5L",
    name: "Caixa de 5 litros",
    short: "O formato ideal para começar e testar a operação.",
    description:
      "Gelato artesanal 100% leite integral em caixa de 5 litros. O ponto de partida perfeito para o parceiro validar sabores, entender o giro e montar a vitrine sem sobrecarregar o estoque.",
    bestFor: "Primeiros passos e operações em crescimento",
    image: "/images/product-gelato.png",
  },
  {
    slug: "caixa-10l",
    size: "10L",
    name: "Caixa de 10 litros",
    short: "Para quem já tem giro e quer escalar com margem.",
    description:
      "O mesmo gelato artesanal 100% leite integral, em caixa de 10 litros. Pensado para negócios com alto giro que buscam eficiência de operação e a melhor relação de custo por litro.",
    bestFor: "Alto giro e maior eficiência",
    image: "/images/product-gelato.png",
  },
];

/**
 * Categorias futuras — placeholder honesto.
 * Não nomeamos linhas que ainda não foram confirmadas.
 */
export const FUTURE_CATEGORY = {
  label: "Novas categorias",
  headline: "Novas linhas em desenvolvimento.",
  detail:
    "Estamos construindo o portfólio ao lado dos primeiros parceiros. Novas categorias serão anunciadas conforme a produção evoluir.",
} as const;
