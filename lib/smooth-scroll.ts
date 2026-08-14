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

let rafId: number | null = null;

/**
 * Anima o scroll via requestAnimationFrame em vez de behavior:"smooth".
 * Numa página longa com seção sticky, o smooth nativo é abortado quando o
 * scroll dispara re-renders (o conceito atualiza estado a cada frame). Uma
 * animação própria por rAF é imune a isso e sempre chega ao destino.
 */
function animateScrollTo(target: number) {
  if (rafId !== null) cancelAnimationFrame(rafId);
  const start = window.scrollY;
  const distance = target - start;
  const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.35));
  const startTime = performance.now();
  // easeInOutCubic — parte e chega suave, condução premium.
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    window.scrollTo(0, start + distance * ease(t));
    if (t < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }
  rafId = requestAnimationFrame(step);
}

/** Rola suavemente até a seção de id informado, parando abaixo do header. */
export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  if (id === "top" || id === "") {
    animateScrollTo(0);
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const target = Math.max(0, absoluteTop(el) - HEADER_OFFSET);
  animateScrollTo(target);
}
