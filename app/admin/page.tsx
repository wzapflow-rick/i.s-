import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Logo } from "@/components/brand/logo"
import { LeadsDashboard } from "@/components/admin/leads-dashboard"
import { logoutAction } from "@/app/actions/admin-auth"
import { isAuthenticated } from "@/lib/auth/admin"
import { listLeads } from "@/lib/leads/repository"
import type { Lead } from "@/lib/leads/types"

export const metadata: Metadata = {
  title: "Leads · Painel i.sí",
  robots: { index: false, follow: false },
}

// Sempre buscar dados frescos do banco.
export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login")
  }

  let leads: Lead[] = []
  let loadError = false
  try {
    leads = await listLeads()
  } catch (error) {
    console.error("[v0] Erro ao carregar leads:", error)
    loadError = true
  }

  return (
    <main className="min-h-screen bg-ink px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-ink-foreground/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo tone="cream" className="h-10" />
            <div className="border-l border-ink-foreground/15 pl-4">
              <h1 className="font-serif text-xl text-ink-foreground">
                Leads comerciais
              </h1>
              <p className="font-sans text-[0.7rem] uppercase tracking-eyebrow text-ink-foreground/40">
                Cadastros de interesse
              </p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-ink-foreground/15 px-4 py-2 font-sans text-xs uppercase tracking-wide-editorial text-ink-foreground/60 transition-colors hover:border-ink-foreground/30"
            >
              Sair
            </button>
          </form>
        </header>

        {loadError ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
            <p className="font-sans text-sm text-red-300">
              Não foi possível carregar os leads. Verifique se a tabela{" "}
              <code className="text-red-200">leads</code> foi criada no banco
              (rode o script SQL enviado) e se a variável{" "}
              <code className="text-red-200">DATABASE_URL</code> está correta.
            </p>
          </div>
        ) : (
          <LeadsDashboard leads={leads} />
        )}
      </div>
    </main>
  )
}
