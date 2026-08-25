import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Classe aplicada à imagem — use para definir a altura (ex.: "h-8"). */
  className?: string;
  showTagline?: boolean;
  /** ink = marca escura (sobre fundo claro) · cream = marca clara (sobre fundo escuro) */
  tone?: "ink" | "cream";
  align?: "center" | "start";
}

/**
 * Wordmark oficial i.sí — imagem da marca (serif "i.sí" + traço sorriso).
 * Dois tons transparentes: `ink` para fundos claros e `cream` para escuros.
 */
export function Logo({
  className,
  showTagline = false,
  tone = "ink",
  align = "center",
}: LogoProps) {
  const src =
    tone === "cream" ? "/brand/isi-mark-cream.png" : "/brand/isi-mark-ink.png";
  return (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        align === "start" ? "items-start" : "items-center",
      )}
    >
      <Image
        src={src}
        alt="i.sí Gelato"
        width={484}
        height={432}
        priority
        className={cn("w-auto object-contain", className)}
      />
      {showTagline && (
        <span
          className={cn(
            "mt-2 font-sans text-[0.6rem] uppercase tracking-eyebrow",
            tone === "cream" ? "text-ink-foreground/60" : "text-muted-foreground",
          )}
        >
          Gelato
        </span>
      )}
    </span>
  );
}
