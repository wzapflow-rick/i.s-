"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import type { Lead, LeadStatus } from "@/lib/leads/types"
import {
  priorityFromScore,
  PRIORITY_LABEL,
  type LeadPriority,
} from "@/lib/leads/priority"
import { STATUS_LABEL, formatDate } from "@/lib/leads/format"
import { LeadDrawer } from "./lead-drawer"

type PriorityFilter = LeadPriority | "all"
type StatusFilter = LeadStatus | "all"

const PRIORITY_STYLES: Record<LeadPriority, string> = {
  high: "bg-accent/20 text-accent-soft border-accent/30",
  medium: "bg-ink-foreground/10 text-ink-foreground/80 border-ink-foreground/20",
  low: "bg-ink-foreground/5 text-ink-foreground/50 border-ink-foreground/10",
}

export function LeadsDashboard({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("")
  const [priority, setPriority] = useState<PriorityFilter>("all")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const summary = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 }
    for (const lead of leads) counts[priorityFromScore(lead.score)]++
    const newCount = leads.filter((l) => l.status === "new").length
    return { total: leads.length, ...counts, newCount }
  }, [leads])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((lead) => {
      if (priority !== "all" && priorityFromScore(lead.score) !== priority) {
        return false
      }
      if (status !== "all" && lead.status !== status) return false
      if (!q) return true
      const haystack = [
        lead.company,
        lead.responsibleName,
        lead.whatsapp,
        lead.instagram,
        lead.cityState,
        lead.operationModel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [leads, search, priority, status])

  const selected = leads.find((l) => l.id === selectedId) ?? null

  return (
    <div className="flex flex-col gap-8">
      {/* Resumo */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Total de leads" value={summary.total} />
        <SummaryCard label="Prioridade alta" value={summary.high} accent />
        <SummaryCard label="Prioridade média" value={summary.medium} />
        <SummaryCard label="Novos" value={summary.newCount} />
      </div>

      {/* Filtros + busca */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "high", "medium", "low"] as PriorityFilter[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-sans text-xs uppercase tracking-wide-editorial transition-colors",
                priority === p
                  ? "border-accent bg-accent text-ink"
                  : "border-ink-foreground/15 text-ink-foreground/60 hover:border-ink-foreground/30",
              )}
            >
              {p === "all" ? "Todas" : PRIORITY_LABEL[p]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-md border border-ink-foreground/15 bg-ink-foreground/[0.04] px-3 py-2 font-sans text-sm text-ink-foreground outline-none focus:border-accent"
          >
            <option value="all">Todos os status</option>
            {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por empresa, responsável, cidade…"
            className="w-full rounded-md border border-ink-foreground/15 bg-ink-foreground/[0.04] px-4 py-2 font-sans text-sm text-ink-foreground outline-none placeholder:text-ink-foreground/30 focus:border-accent sm:w-80"
          />
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-foreground/15 py-20 text-center">
          <p className="font-sans text-sm text-ink-foreground/50">
            {leads.length === 0
              ? "Nenhum lead cadastrado ainda. Assim que o formulário for enviado, os leads aparecem aqui."
              : "Nenhum lead corresponde aos filtros selecionados."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink-foreground/10">
          {/* Cabeçalho (desktop) */}
          <div className="hidden grid-cols-[1fr_1fr_auto_auto_auto] gap-4 border-b border-ink-foreground/10 bg-ink-foreground/[0.03] px-5 py-3 md:grid">
            <HeaderCell>Empresa</HeaderCell>
            <HeaderCell>Responsável</HeaderCell>
            <HeaderCell>Prioridade</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell>Recebido</HeaderCell>
          </div>

          <ul>
            {filtered.map((lead) => {
              const p = priorityFromScore(lead.score)
              return (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className="grid w-full grid-cols-1 gap-1 border-b border-ink-foreground/[0.06] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-ink-foreground/[0.03] md:grid-cols-[1fr_1fr_auto_auto_auto] md:items-center md:gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base text-ink-foreground">
                        {lead.company || "—"}
                      </span>
                      <span className="font-sans text-xs text-ink-foreground/40">
                        {lead.score} pts
                      </span>
                    </div>
                    <span className="font-sans text-sm text-ink-foreground/60">
                      {lead.responsibleName || "—"}
                      <span className="text-ink-foreground/30">
                        {lead.cityState ? ` · ${lead.cityState}` : ""}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "w-fit rounded-full border px-2.5 py-0.5 font-sans text-[0.7rem] uppercase tracking-wide-editorial",
                        PRIORITY_STYLES[p],
                      )}
                    >
                      {PRIORITY_LABEL[p]}
                    </span>
                    <span className="font-sans text-xs text-ink-foreground/60">
                      {STATUS_LABEL[lead.status]}
                    </span>
                    <span className="font-sans text-xs text-ink-foreground/40">
                      {formatDate(lead.createdAt)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <LeadDrawer lead={selected} onClose={() => setSelectedId(null)} />
    </div>
  )
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        accent
          ? "border-accent/30 bg-accent/[0.08]"
          : "border-ink-foreground/10 bg-ink-foreground/[0.03]",
      )}
    >
      <p className="font-sans text-[0.68rem] uppercase tracking-eyebrow text-ink-foreground/40">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-serif text-3xl",
          accent ? "text-accent-soft" : "text-ink-foreground",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-[0.68rem] uppercase tracking-eyebrow text-ink-foreground/40">
      {children}
    </span>
  )
}
