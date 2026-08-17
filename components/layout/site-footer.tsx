import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const nav = [
  { label: "Produtos", href: "#produtos" },
  { label: "Diferencial", href: "#diferencial" },
  { label: "A marca", href: "#marca" },
  { label: "Seja parceiro", href: "#formulario" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:px-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <Logo tone="cream" showTagline className="items-start text-4xl" />
            <p className="max-w-sm text-pretty font-sans text-sm leading-relaxed text-ink-foreground/60">
              Sabores que despertam novas descobertas. Uma marca premium para
              negócios que querem crescer com experiências memoráveis.
            </p>
          </div>

          <nav aria-label="Rodapé" className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm uppercase tracking-[0.18em] text-ink-foreground/70 transition-colors hover:text-ink-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-ink-foreground/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-ink-foreground/45">
            © {new Date().getFullYear()} i.sí Gelato — Todos os direitos
            reservados
          </p>
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-ink-foreground/45">
            Parcerias comerciais selecionadas
          </p>
        </div>
      </div>
    </footer>
  );
}
