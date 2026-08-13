import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  tone?: "ink" | "cream";
}

/**
 * Wordmark i.sí — recriação tipográfica do lettering serif da marca.
 * O ponto do "i" e o acento agudo do "í" usam o dourado da identidade.
 */
export function Logo({ className, showTagline = false, tone = "ink" }: LogoProps) {
  const color = tone === "cream" ? "text-ink-foreground" : "text-foreground";
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span
        className={cn(
          "font-serif tracking-tight leading-none",
          color,
        )}
        aria-hidden="true"
      >
        <span className="relative">
          i
          <span className="absolute -top-[0.12em] left-[0.06em] size-[0.14em] rounded-full bg-accent" />
        </span>
        <span className="text-accent">.</span>
        <span className="relative">
          si
          <span className="absolute -top-[0.28em] right-[-0.02em] block h-[0.14em] w-[0.28em] -rotate-12 rounded-full bg-accent" />
        </span>
      </span>
      <span className="sr-only">i.sí Gelato</span>
      {showTagline && (
        <span
          className={cn(
            "mt-2 font-sans text-[0.5em] uppercase tracking-eyebrow",
            tone === "cream" ? "text-ink-foreground/60" : "text-muted-foreground",
          )}
        >
          Gelato
        </span>
      )}
    </span>
  );
}
