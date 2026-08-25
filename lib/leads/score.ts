import type { LeadInput } from "./types";

/**
 * Cálculo de score do lead — ESTRUTURA PROVISÓRIA.
 *
 * ⚠️ As regras reais de negócio serão definidas com o cliente. Este módulo é
 * intencionalmente modular: ajuste `SCORE_WEIGHTS` e os sinais sem tocar no
 * restante do app. Retorna um número de 0 a 100.
 */

export interface ScoreWeights {
  premiumPositioning: number;
  qualityAudience: number;
  higherVolume: number;
  strongPurchaseExpectation: number;
  sellsHigherValue: number;
  willingHigherPrice: number;
  multipleUnits: number;
  establishedBusiness: number;
  valuesInnovation: number;
  detailedWhyMatch: number;
}

// Pesos placeholder — somam 100 quando todos os sinais são positivos.
export const SCORE_WEIGHTS: ScoreWeights = {
  premiumPositioning: 15,
  qualityAudience: 10,
  higherVolume: 15,
  strongPurchaseExpectation: 15,
  sellsHigherValue: 10,
  willingHigherPrice: 10,
  multipleUnits: 10,
  establishedBusiness: 5,
  valuesInnovation: 5,
  detailedWhyMatch: 5,
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

  // Posicionamento premium/alto padrão.
  if (/premium|alto padr/i.test(data.positioning)) score += w.premiumPositioning;

  // Público que valoriza qualidade/experiência/premium.
  if (/qualidade|experi|premium/i.test(data.mainAudience)) {
    score += w.qualityAudience;
  }

  // Volume mensal mais alto (40+ caixas).
  if (/40 a 60|60\+/i.test(data.monthlyVolume)) score += w.higherVolume;

  // Expectativa de compra forte (11+ baldes/mês).
  if (/11 a 20|20\+/i.test(data.purchaseExpectation)) {
    score += w.strongPurchaseExpectation;
  }

  if (/sim/i.test(data.higherValueProducts)) score += w.sellsHigherValue;

  if (/sim/i.test(data.willingHigherPrice)) score += w.willingHigherPrice;

  // Mais de uma unidade indica operação maior.
  if (parseFirstNumber(data.units) >= 2) score += w.multipleUnits;

  // Negócio estabelecido (heurística: contém "ano").
  if (/ano/i.test(data.businessAge) || parseFirstNumber(data.businessAge) >= 1) {
    score += w.establishedBusiness;
  }

  // Valoriza inovação (alta/essencial).
  if (/alta|essencial/i.test(data.innovationImportance)) {
    score += w.valuesInnovation;
  }

  if (data.whyMatch.trim().length >= 40) score += w.detailedWhyMatch;

  return Math.max(0, Math.min(100, score));
}
