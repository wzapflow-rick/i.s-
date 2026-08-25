"use server";

import { calculateLeadScore } from "@/lib/leads/score";
import { insertLead } from "@/lib/leads/repository";
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
 * Valida no servidor, calcula o score, PERSISTE no Postgres e devolve um recibo.
 * Os leads salvos ficam disponíveis no painel administrativo em /admin.
 */
export async function submitLead(data: LeadInput): Promise<SubmitLeadResult> {
  // Revalida todas as etapas no servidor (nunca confiar só no cliente).
  const allErrors = Array.from({ length: 7 }, (_, i) => validateStep(i, data));
  const hasErrors = allErrors.some((e) => Object.keys(e).length > 0);

  if (hasErrors) {
    return {
      ok: false,
      message: "Alguns campos precisam de atenção. Revise e tente novamente.",
    };
  }

  const score = calculateLeadScore(data);
  const createdAt = new Date().toISOString();

  try {
    const id = await insertLead(data, score);

    console.log("[v0] Novo lead i.sí salvo:", {
      id,
      company: data.company,
      operationModel: data.operationModel,
      score,
    });

    return {
      ok: true,
      message: "Lead recebido com sucesso.",
      lead: { id, score, status: "new", createdAt },
    };
  } catch (error) {
    console.error("[v0] Erro ao salvar lead:", error);
    return {
      ok: false,
      message:
        "Não foi possível registrar seu cadastro agora. Tente novamente em instantes.",
    };
  }
}
