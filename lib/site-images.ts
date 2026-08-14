// ============================================================================
// MANIFESTO DE IMAGENS — i.sí
// ----------------------------------------------------------------------------
// PONTO ÚNICO de todas as imagens do site. Os componentes NÃO usam caminhos
// fixos: todos leem deste arquivo.
//
// COMO SUBSTITUIR OS PLACEHOLDERS PELAS FOTOS REAIS DO CLIENTE:
//   1. Salve a foto real em /public/images/ (ex.: hero.jpg).
//   2. Atualize o campo `src` do slot correspondente abaixo.
//   3. Ajuste o `alt` para descrever a foto real.
//   4. Marque `placeholder: false` — isso remove automaticamente o selo
//      "Foto ilustrativa" exibido sobre a imagem.
//   5. Mantenha a proporção recomendada (`ratio`) para o enquadramento.
//
// Não é necessário editar nenhum componente para trocar as imagens.
// ============================================================================

export interface SiteImage {
  /** Caminho em /public. Troque por foto real do cliente. */
  src: string;
  /** Texto alternativo (acessibilidade). Descreva a foto real. */
  alt: string;
  /** Proporção recomendada para o enquadramento da foto real. */
  ratio: string;
  /** O que a foto real deve mostrar (guia para o cliente/fotógrafo). */
  note: string;
  /** true = ainda é placeholder (exibe selo "Foto ilustrativa"). */
  placeholder: boolean;
}

export const SITE_IMAGES = {
  /** Hero — foto principal, ocupa ~metade da tela. Vertical/retrato no desktop. */
  hero: {
    src: "/images/hero-gelato.png",
    alt: "Close-up editorial de gelato artesanal i.sí com textura cremosa",
    ratio: "3:4 (retrato) ou 1:1",
    note: "Foto premium do gelato em destaque — textura cremosa, luz suave, fundo neutro/off-white.",
    placeholder: true,
  },

  /** Textura decorativa usada em fundos escuros (Qualidade) e na Marca. */
  texture: {
    src: "/images/story-texture.png",
    alt: "Textura macro de gelato artesanal cremoso",
    ratio: "16:9 ou maior (usada como fundo)",
    note: "Macro da textura do gelato — dobras e brilho suave. Serve de plano de fundo.",
    placeholder: true,
  },

  /** Produto — caixa de 5 litros. */
  gelato5L: {
    src: "/images/product-gelato.png",
    alt: "Gelato artesanal i.sí — caixa de 5 litros",
    ratio: "16:10 (paisagem)",
    note: "Foto do gelato/caixa de 5L. Pode ser o produto na embalagem ou servido.",
    placeholder: true,
  },

  /** Produto — caixa de 10 litros. */
  gelato10L: {
    src: "/images/product-gelato.png",
    alt: "Gelato artesanal i.sí — caixa de 10 litros",
    ratio: "16:10 (paisagem)",
    note: "Foto do gelato/caixa de 10L. Pode ser o produto na embalagem ou servido.",
    placeholder: true,
  },
} satisfies Record<string, SiteImage>;

export type SiteImageKey = keyof typeof SITE_IMAGES;
