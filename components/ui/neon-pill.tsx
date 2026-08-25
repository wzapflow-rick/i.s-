"use client";

import NeonBorder from "@/components/ui/neon-border";

// Dourado da identidade i.sí (--accent-soft) em hex — o NeonBorder desenha em
// conic-gradient e só entende hex ou rgb(), não variáveis CSS.
export const NEON_BRAND_COLOR = "#c9ad78";

/**
 * Camada de borda "neon" para botões em formato de pílula (rounded-full).
 *
 * Renderiza como overlay absoluto e não-interativo. O botão hospedeiro deve ser
 * `position: relative` e NÃO ter `overflow-hidden` (o glow extravasa a borda).
 * Mantenha o conteúdo do botão em uma camada com z-index acima (ex.: z-10).
 */
export function NeonPill({
  color = NEON_BRAND_COLOR,
  thickness = 2,
  borderSize = 42,
  glow = 70,
  speed = 9,
}: {
  color?: string;
  thickness?: number;
  borderSize?: number;
  glow?: number;
  speed?: number;
}) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <NeonBorder
        color={color}
        rounded={100}
        thickness={thickness}
        borderSize={borderSize}
        glow={glow}
        speed={speed}
      />
    </span>
  );
}
