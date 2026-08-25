"use client"

import { useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import type { Lead, LeadStatus } from "@/lib/leads/types"
import {
  priorityFromScore,
  PRIORITY_LABEL,
} from "@/lib/leads/priority"
import {
  LEAD_SECTIONS,
  STATUS_LABEL,
  formatDateTime,
  instagramLink,
  whatsappLink,
} from "@/lib/leads/format"
import { updateLeadStatusAction } from "@/app/actions/update-lead-status"

export function LeadDrawer({
  lead,
  onClose,
}: {
  lead: Lead | null
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState<LeadStatus | null>(null)

  useEffect(() => {
    setLocalStatus(lead?.status ?? null)
  }, [lead])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (lead) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lead, onClose])

  if (!lead) return null

  const priority = priorityFromScore(lead.score)
  const ig = instagramLink(lead.instagram)
  const waMessage = `Olá, ${lead.responsibleName?.split(" ")[0] || ""}! Aqui é da i.sí Gelato. Recebemos o cadastro da ${lead.company} e gostaríamos de conversar.`
  const status = localStatus ?? lead.status

  function changeStatus(next: LeadStatus) {
    setLocalStatus(next)
    startTransition(async () => {
      const res = await updateLeadStatusAction(lead!.id, next)
      if (!res.ok) setLocalStatus(lead!.status)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <aside className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-ink-foreground/10 bg-ink shadow-2xl">
        {/* Cabeçalho */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-foreground/10 bg-ink/95 px-6 py-5 backdrop-blur">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-sans text-[0.7rem] uppercase tracking-wide-editorial",
                  priority === "high"
                    ? "border-accent/30 bg-accent/20 text-accent-soft"
                    : "border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground/70",
                )}
              >
                Prioridade {PRIORITY_LABEL[priority]}
              </span>
              <span className="font-sans text-xs text-ink-foreground/40">
                {lead.score} pts
              </span>
            </div>
            <h2 className="font-serif text-2xl text-ink-foreground">
              {lead.company || "—"}
            </h2>
            <p className="mt-1 font-sans text-sm text-ink-foreground/50">
              {lead.responsibleName}
              {lead.cityState ? ` · ${lead.cityState}` : ""}
            </p>
            <p className="mt-1 font-sans text-xs text-ink-foreground/30">
              Recebido em {formatDateTime(lead.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink-foreground/15 px-3 py-1.5 font-sans text-xs text-ink-foreground/60 transition-colors hover:border-ink-foreground/30"
          >
            Fechar
          </button>
        </div>

        {/* Ações rápidas */}
        <div className="flex flex-wrap gap-2 border-b border-ink-foreground/10 px-6 py-4">
          <a
            href={whatsappLink(lead.whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Falar no WhatsApp
          </a>
          {ig ? (
            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-ink-foreground/15 px-4 py-2 font-sans text-sm text-ink-foreground/70 transition-colors hover:border-ink-foreground/30"
            >
              Instagram
            </a>
          ) : null}
        </div>

        {/* Status */}
        <div className="border-b border-ink-foreground/10 px-6 py-4">
          <p className="mb-2 font-sans text-[0.68rem] uppercase tracking-eyebrow text-ink-foreground/40">
            Status {pending ? "· salvando…" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_LABEL) as LeadStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => changeStatus(s)}
                className={cn(
                  "rounded-full border px-3 py-1 font-sans text-xs transition-colors",
                  status === s
                    ? "border-accent bg-accent text-ink"
                    : "border-ink-foreground/15 text-ink-foreground/60 hover:border-ink-foreground/30",
                )}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes completos */}
        <div className="flex flex-col gap-8 px-6 py-6">
          {LEAD_SECTIONS.map((section) => (
            <section key={section.title}>
              <h3 className="mb-3 font-sans text-[0.68rem] uppercase tracking-eyebrow text-accent-soft">
                {section.title}
              </h3>
              <dl className="flex flex-col gap-3">
                {section.fields.map((field) => {
                  const value = lead[field.key]
                  if (!value) return null
                  return (
                    <div
                      key={String(field.key)}
                      className="grid grid-cols-[40%_60%] gap-3 border-b border-ink-foreground/[0.06] pb-3 last:border-b-0"
                    >
                      <dt className="font-sans text-xs text-ink-foreground/40">
                        {field.label}
                      </dt>
                      <dd className="font-sans text-sm text-ink-foreground/80">
                        {String(value)}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </section>
          ))}
        </div>
      </aside>
    </div>
  )
}
