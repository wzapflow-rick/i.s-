// Deriva a "prioridade" do lead a partir do score (0–100) já calculado.
// Não altera a régua de score existente — apenas classifica em faixas
// para facilitar a leitura no painel administrativo.

export type LeadPriority = "high" | "medium" | "low"

export function priorityFromScore(score: number): LeadPriority {
  if (score >= 60) return "high"
  if (score >= 35) return "medium"
  return "low"
}

export const PRIORITY_LABEL: Record<LeadPriority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
}
