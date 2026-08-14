// Rolagem suave por offset absoluto.
// A página tem uma seção "sticky" alta (o conceito), e nesse cenário o
// scrollIntoView / âncora nativa do navegador calcula o destino errado e para
// antes da seção. Calcular o offsetTop absoluto e usar window.scrollTo é
// determinístico e sempre para logo abaixo do header fixo.

/** Altura reservada para o header fixo (mantém o título visível). 5.5rem. */
export const HEADER_OFFSET = 88;

/** offsetTop absoluto de um elemento, somando a cadeia de offsetParent. */
function absoluteTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/** Rola suavemente até a seção de id informado, parando abaixo do header. */
export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  if (id === "top" || id === "") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const target = Math.max(0, absoluteTop(el) - HEADER_OFFSET);
  window.scrollTo({ top: target, behavior: "smooth" });
}
