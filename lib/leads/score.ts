import type { LeadInput } from "./types";

/**
 * Cálculo de score do lead — ESTRUTURA PROVISÓRIA.
 *
 * ⚠️ As regras reais de negócio serão definidas após o briefing do cliente.
 * Este módulo é intencionalmente modular e configurável: ajuste `SCORE_WEIGHTS`
 * e as funções de sinal sem tocar no restante do app.
 *
 * Retorna um número de 0 a 100.
 */

export interface ScoreWeights {
  hasSegment: number;
  multipleUnits: number;
  establishedBusiness: number;
  higherRevenue: number;
  alreadySellsCategory: number;
  clearObjective: number;
  hasOnlinePresence: number;
  detailedMotivation: number;
}

// Pesos placeholder — somam 100 quando todos os sinais são positivos.
export const SCORE_WEIGHTS: ScoreWeights = {
  hasSegment: 10,
  multipleUnits: 20,
  establishedBusiness: 15,
  higherRevenue: 20,
  alreadySellsCategory: 10,
  clearObjective: 10,
  hasOnlinePresence: 5,
  detailedMotivation: 10,
};

function parseFirstNumber(value: string): number {
  const match = value.replace(/\./g, "").match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

/**
 * Calcula o score do lead a partir dos dados do formulário.
 * TODO(cliente): substituir pela régua real de qualificação comercial.
 */
export function calculateLeadScore(data: LeadInput): number {
  const w = SCORE_WEIGHTS;
  let score = 0;

  if (data.segment) score += w.hasSegment;

  // Mais unidades tende a indicar operação maior.
  if (parseFirstNumber(data.units) >= 2) score += w.multipleUnits;

  // Tempo de operação (heurística: contém "ano").
  if (/ano/i.test(data.businessAge) || parseFirstNumber(data.businessAge) >= 1) {
    score += w.establishedBusiness;
  }

  // Faturamento — heurística simples por presença de valor relevante.
  if (parseFirstNumber(data.averageRevenue) >= 20) score += w.higherRevenue;

  if (data.currentProducts === "sim") score += w.alreadySellsCategory;

  if (data.objective) score += w.clearObjective;

  if ((data.instagram && data.instagram.trim()) || (data.website && data.website.trim())) {
    score += w.hasOnlinePresence;
  }

  if (data.motivation.trim().length >= 40) score += w.detailedMotivation;

  return Math.max(0, Math.min(100, score));
}
