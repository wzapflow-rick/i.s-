import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Logo } from "@/components/brand/logo"
import { isAdminConfigured, isAuthenticated } from "@/lib/auth/admin"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Acesso restrito · i.sí",
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin")
  }

  const configured = isAdminConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <Logo tone="cream" className="h-12" />
          <p className="font-sans text-[0.7rem] uppercase tracking-eyebrow text-ink-foreground/40">
            Painel comercial
          </p>
        </div>

        <div className="rounded-lg border border-ink-foreground/10 bg-ink-foreground/[0.03] p-8">
          <h1 className="mb-6 font-serif text-2xl text-ink-foreground">
            Acesso restrito
          </h1>

          {configured ? (
            <LoginForm />
          ) : (
            <p className="font-sans text-sm leading-relaxed text-ink-foreground/60">
              A variável{" "}
              <code className="rounded bg-ink-foreground/10 px-1.5 py-0.5 text-accent-soft">
                ADMIN_PASSWORD
              </code>{" "}
              ainda não foi configurada no projeto. Defina-a nas variáveis de
              ambiente para habilitar o acesso ao painel.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
