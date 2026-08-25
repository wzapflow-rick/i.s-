import type { LeadInput } from "./types";

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

// Campos exigidos por etapa (índice 0 = seção 1). Instagram é opcional.
export const STEP_FIELDS: (keyof LeadInput)[][] = [
  // 1 — Sobre a empresa
  [
    "company",
    "responsibleName",
    "whatsapp",
    "cityState",
    "businessAge",
    "operationModel",
    "serviceType",
    "units",
  ],
  // 2 — Posicionamento da loja
  ["positioning", "mainAudience", "averageTicket", "currentBrands", "supplierValue"],
  // 3 — Perfil de consumo
  [
    "mainProduct",
    "monthlyVolume",
    "simultaneousFlavors",
    "higherValueProducts",
    "averagePortionPrice",
  ],
  // 4 — Estrutura e operação
  ["freezers", "restockFrequency", "salesTeam", "premiumSpace", "displayDetails", "staffInfo"],
  // 5 — Compra e potencial comercial
  ["purchaseExpectation", "firstPurchaseTime", "exclusiveFlavors", "brandStrategy"],
  // 6 — Perfil financeiro e comercial
  ["supplierFrequency", "paymentMethod", "dependsOnTerm"],
  // 7 — Identificação do perfil i.sí
  [
    "expectation",
    "premiumMeaning",
    "innovationImportance",
    "willingHigherPrice",
    "interestLaunches",
    "followBrandGuidelines",
    "whyMatch",
  ],
];

// Rótulos amigáveis para mensagens de campo obrigatório.
const LABELS: Partial<Record<keyof LeadInput, string>> = {
  company: "Nome da empresa",
  responsibleName: "Nome do responsável",
  cityState: "Cidade/Estado",
  businessAge: "Tempo de funcionamento",
  operationModel: "Modelo da operação",
  serviceType: "Tipo de operação",
  units: "Número de unidades",
  positioning: "Posicionamento",
  mainAudience: "Público principal",
  averageTicket: "Ticket médio",
  currentBrands: "Marcas atuais",
  supplierValue: "O que valoriza no fornecedor",
  mainProduct: "Principal produto",
  monthlyVolume: "Volume mensal",
  simultaneousFlavors: "Sabores simultâneos",
  higherValueProducts: "Produtos de maior valor",
  averagePortionPrice: "Preço médio da porção",
  freezers: "Freezers/expositores",
  restockFrequency: "Reposição de estoque",
  salesTeam: "Equipe de vendas",
  premiumSpace: "Espaço para linha premium",
  displayDetails: "Detalhes da exposição e atendimento",
  staffInfo: "Funcionários e cargos",
  purchaseExpectation: "Expectativa de compra",
  firstPurchaseTime: "Prazo da primeira compra",
  exclusiveFlavors: "Interesse em sabores exclusivos",
  brandStrategy: "Estratégia da marca",
  supplierFrequency: "Frequência de compra",
  paymentMethod: "Forma de pagamento",
  dependsOnTerm: "Depende de prazo",
  innovationImportance: "Importância da inovação",
  willingHigherPrice: "Disposição a preço superior",
  interestLaunches: "Interesse em lançamentos",
  followBrandGuidelines: "Seguir orientações da marca",
};

function required(value: string, label: string): string | undefined {
  if (!value || !value.trim()) return `${label} é obrigatório.`;
  return undefined;
}

/** Valida apenas os campos de uma etapa específica. */
export function validateStep(step: number, data: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  const fields = STEP_FIELDS[step] ?? [];

  for (const field of fields) {
    // Campos com tratamento especial.
    if (field === "whatsapp") {
      if (!data.whatsapp || data.whatsapp.replace(/\D/g, "").length < 10) {
        errors.whatsapp = "Informe um WhatsApp válido com DDD.";
      }
      continue;
    }
    if (field === "displayDetails") {
      if (!data.displayDetails || data.displayDetails.trim().length < 10) {
        errors.displayDetails = "Conte um pouco mais (mínimo 10 caracteres).";
      }
      continue;
    }
    if (field === "whyMatch") {
      if (!data.whyMatch || data.whyMatch.trim().length < 10) {
        errors.whyMatch = "Conte um pouco mais (mínimo 10 caracteres).";
      }
      continue;
    }

    const msg = required(String(data[field] ?? ""), LABELS[field] ?? "Campo");
    if (msg) errors[field] = msg;
  }

  return errors;
}

export function isStepValid(step: number, data: LeadInput): boolean {
  return Object.keys(validateStep(step, data)).length === 0;
}

export const EMPTY_LEAD: LeadInput = {
  company: "",
  responsibleName: "",
  whatsapp: "",
  instagram: "",
  cityState: "",
  businessAge: "",
  operationModel: "",
  serviceType: "",
  units: "",
  positioning: "",
  mainAudience: "",
  averageTicket: "",
  currentBrands: "",
  supplierValue: "",
  mainProduct: "",
  monthlyVolume: "",
  simultaneousFlavors: "",
  higherValueProducts: "",
  averagePortionPrice: "",
  freezers: "",
  restockFrequency: "",
  salesTeam: "",
  premiumSpace: "",
  displayDetails: "",
  staffInfo: "",
  purchaseExpectation: "",
  firstPurchaseTime: "",
  exclusiveFlavors: "",
  brandStrategy: "",
  supplierFrequency: "",
  paymentMethod: "",
  dependsOnTerm: "",
  expectation: "",
  premiumMeaning: "",
  innovationImportance: "",
  willingHigherPrice: "",
  interestLaunches: "",
  followBrandGuidelines: "",
  whyMatch: "",
};
