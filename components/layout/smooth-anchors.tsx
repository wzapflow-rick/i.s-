"use client";

import { useEffect } from "react";
import { scrollToId } from "@/lib/smooth-scroll";

/**
 * Intercepta cliques em qualquer link interno (href="#secao") e faz a rolagem
 * suave por offset absoluto — contornando o cálculo incorreto do navegador em
 * páginas com seções sticky. Links já tratados (defaultPrevented, ex.: menu
 * mobile) são ignorados para evitar rolagem dupla.
 */
export function SmoothAnchors() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const id = href.slice(1);
      e.preventDefault();
      scrollToId(id);
      history.replaceState(null, "", href);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
