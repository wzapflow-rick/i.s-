// Catálogo provisório — estrutura pronta para receber dados reais do cliente.
// As descrições e itens são placeholders editoriais, não fatos definitivos.

export interface ProductLine {
  slug: string;
  name: string;
  short: string;
  image: string;
  accent: "acai" | "gelato" | "cafe" | "accent";
  description: string;
  /** Itens ilustrativos — substituir pela linha real posteriormente. */
  items: string[];
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    slug: "gelatos",
    name: "Gelatos",
    short: "Textura densa e cremosa, feita para experiências memoráveis.",
    image: "/images/product-gelato.png",
    accent: "gelato",
    description:
      "Uma linha de gelatos pensada para negócios que buscam consistência, cremosidade e sabores que se destacam na vitrine. Estrutura de sabores em definição — em breve com a linha completa.",
    items: ["Sabores clássicos", "Sabores autorais", "Bases especiais", "Edições sazonais"],
  },
  {
    slug: "acai",
    name: "Açaí",
    short: "Cremosidade e sabor para uma categoria que não para de crescer.",
    image: "/images/product-acai.png",
    accent: "acai",
    description:
      "Açaí encorpado e versátil, base ideal para montar tigelas, combinações e novas experiências no seu ponto de venda. Linha em definição.",
    items: ["Açaí tradicional", "Blends de fruta", "Opções encorpadas", "Complementos"],
  },
  {
    slug: "complementos",
    name: "Complementos",
    short: "O que transforma um produto bom em uma experiência completa.",
    image: "/images/product-complementos.png",
    accent: "accent",
    description:
      "Coberturas, caldas, crocantes e finalizações que ajudam a criar combinações e aumentar o valor percebido de cada pedido. Portfólio em definição.",
    items: ["Caldas", "Crocantes", "Coberturas", "Finalizações"],
  },
  {
    slug: "sobremesas",
    name: "Sobremesas",
    short: "Produtos que ampliam o mix e criam novas oportunidades de venda.",
    image: "/images/product-sobremesas.png",
    accent: "cafe",
    description:
      "Sobremesas e outros produtos pensados para expandir a oferta do seu negócio sem complicar a operação. Novas linhas em desenvolvimento.",
    items: ["Sobremesas geladas", "Produtos de vitrine", "Linhas para café", "Novidades"],
  },
];
