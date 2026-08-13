"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Conceito", href: "#conceito" },
  { label: "Para quem", href: "#audiencia" },
  { label: "Produtos", href: "#produtos" },
  { label: "Como funciona", href: "#como-funciona" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center" aria-label="i.sí Gelato — início">
          <Logo className="text-2xl" />
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-sans text-[0.72rem] uppercase tracking-wide-editorial text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#formulario"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-[0.68rem] uppercase tracking-wide-editorial text-ink-foreground transition-colors duration-500 hover:bg-foreground"
          >
            Quero ser parceiro
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex size-10 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span
            className={cn(
              "h-px w-6 bg-foreground transition-all duration-300",
              open && "translate-y-[6px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-foreground transition-all duration-300",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-foreground transition-all duration-300",
              open && "-translate-y-[6px] -rotate-45",
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pt-28 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
                  className="border-b border-border/60 py-5 font-serif text-3xl text-foreground"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <motion.a
              href="#formulario"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-sans text-xs uppercase tracking-wide-editorial text-ink-foreground"
            >
              Quero ser parceiro →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
