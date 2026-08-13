"use server";

import { calculateLeadScore } from "@/lib/leads/score";
import type { Lead, LeadInput } from "@/lib/leads/types";
import { validateStep } from "@/lib/leads/validation";

export interface SubmitLeadResult {
  ok: boolean;
  message: string;
  lead?: Pick<Lead, "id" | "score" | "status" | "createdAt">;
}

/**
 * Recebe o lead do formulário público.
 *
 * V1: valida no servidor, calcula o score e devolve um recibo.
 * A persistência real (DB) e o encaminhamento comercial serão plugados aqui —
 * a estrutura já está pronta para um painel administrativo posterior.
 */
export async function submitLead(data: LeadInput): Promise<SubmitLeadResult> {
  // Revalida todas as etapas no servidor (nunca confiar só no cliente).
  const allErrors = Array.from({ length: 6 }, (_, i) => validateStep(i, data));
  const hasErrors = allErrors.some((e) => Object.keys(e).length > 0);

  if (hasErrors) {
    return {
      ok: false,
      message: "Alguns campos precisam de atenção. Revise e tente novamente.",
    };
  }

  const score = calculateLeadScore(data);

  const lead: Lead = {
    ...data,
    id: crypto.randomUUID(),
    score,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  // TODO(persistência): salvar `lead` em um banco de dados e disparar
  // a análise comercial. Nesta V1 apenas registramos no log do servidor.
  console.log("[v0] Novo lead i.sí recebido:", {
    id: lead.id,
    company: lead.company,
    segment: lead.segment,
    score: lead.score,
  });

  // Simula latência de rede para uma transição de loading realista.
  await new Promise((r) => setTimeout(r, 900));

  return {
    ok: true,
    message: "Lead recebido com sucesso.",
    lead: {
      id: lead.id,
      score: lead.score,
      status: lead.status,
      createdAt: lead.createdAt,
    },
  };
}
