// ============================================================================
// MANIFESTO DE IMAGENS — i.sí
// ----------------------------------------------------------------------------
// PONTO ÚNICO de todas as imagens do site. Os componentes NÃO usam caminhos
// fixos: todos leem deste arquivo.
//
// Cada foto real tem uma FUNÇÃO e é enquadrada de forma diferente por seção
// (crop/zoom/posição), para nunca parecer a mesma imagem repetida.
//
// COMO SUBSTITUIR/ATUALIZAR AS FOTOS:
//   1. Salve a foto em /public/images/.
//   2. Atualize o campo `src` do slot correspondente abaixo.
//   3. Ajuste o `alt` para descrever a foto.
//   4. `placeholder: false` esconde o selo "Foto ilustrativa".
//   5. `objectPosition` controla o foco do enquadramento por padrão.
// ============================================================================

export interface SiteImage {
  /** Caminho em /public. */
  src: string;
  /** Texto alternativo (acessibilidade). */
  alt: string;
  /** Proporção recomendada para o enquadramento. */
  ratio: string;
  /** Função da foto / o que ela comunica. */
  note: string;
  /** Foco padrão do enquadramento (CSS object-position). */
  objectPosition: string;
  /** true = ainda é placeholder (exibe selo "Foto ilustrativa"). */
  placeholder: boolean;
}

export const SITE_IMAGES = {
  /**
   * HERO — produto / desejo / textura.
   * Gelato de chocolate visto de cima, coberto de pérolas brilhantes.
   */
  hero: {
    src: "/images/chocolate-pearls.png",
    alt: "Gelato de chocolate i.sí coberto de pérolas de chocolate, visto de cima",
    ratio: "3:4 (retrato) ou 1:1",
    note: "Produto em destaque — textura cremosa e pérolas. Gera desejo.",
    objectPosition: "center 42%",
    placeholder: false,
  },

  /**
   * PROCESSO / ARTESANAL / FABRICAÇÃO.
   * Gelato de chocolate sendo despejado da máquina na caixa i.sí.
   * Usada em fundo (Qualidade) e como painel (A Marca), com crops distintos.
   */
  texture: {
    src: "/images/chocolate-pour.png",
    alt: "Gelato de chocolate sendo despejado da máquina em uma caixa i.sí",
    ratio: "3:4 (retrato)",
    note: "Processo de fabricação artesanal — o gelato saindo da máquina.",
    objectPosition: "center 35%",
    placeholder: false,
  },

  /**
   * PRODUTO — caixa de 5 litros.
   * Caixa real i.sí cheia de gelato de chocolate com pérolas.
   */
  gelato5L: {
    src: "/images/tub-5l.png",
    alt: "Pote i.sí de gelato artesanal no formato de 5 litros, embalagem branca com logo dourado",
    ratio: "1:1 (produto)",
    note: "Embalagem real de 5L — pote branco com a marca i.sí em dourado, sobre fundo escuro.",
    objectPosition: "center 50%",
    placeholder: false,
  },

  /**
   * PRODUTO — pote de 10 litros.
   * Embalagem preta i.sí, formato maior, para operações de alto giro.
   */
  gelato10L: {
    src: "/images/tub-10l.png",
    alt: "Pote i.sí de gelato artesanal no formato de 10 litros, embalagem preta com logo dourado",
    ratio: "1:1 (produto)",
    note: "Embalagem real de 10L — pote preto com a marca i.sí em dourado, sobre fundo escuro.",
    objectPosition: "center 50%",
    placeholder: false,
  },
} satisfies Record<string, SiteImage>;

export type SiteImageKey = keyof typeof SITE_IMAGES;
