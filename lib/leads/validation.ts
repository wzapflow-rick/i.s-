import type { LeadInput } from "./types";

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

// Campos exigidos por etapa (índice 0 = etapa 1).
export const STEP_FIELDS: (keyof LeadInput)[][] = [
  ["name", "whatsapp", "email"],
  ["company", "city", "state"],
  ["segment", "units", "businessAge"],
  ["averageRevenue", "orderVolume", "currentProducts"],
  ["objective"],
  ["motivation"],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string, label: string): string | undefined {
  if (!value || !value.trim()) return `${label} é obrigatório.`;
  return undefined;
}

/** Valida apenas os campos de uma etapa específica. */
export function validateStep(step: number, data: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  const set = (k: keyof LeadInput, msg?: string) => {
    if (msg) errors[k] = msg;
  };

  switch (step) {
    case 0:
      set("name", required(data.name, "Nome"));
      if (!data.whatsapp || data.whatsapp.replace(/\D/g, "").length < 10) {
        set("whatsapp", "Informe um WhatsApp válido com DDD.");
      }
      if (!EMAIL_RE.test(data.email)) set("email", "Informe um e-mail válido.");
      break;
    case 1:
      set("company", required(data.company, "Empresa"));
      set("city", required(data.city, "Cidade"));
      set("state", required(data.state, "Estado"));
      break;
    case 2:
      if (!data.segment) set("segment", "Selecione um segmento.");
      set("units", required(data.units, "Número de unidades"));
      set("businessAge", required(data.businessAge, "Tempo de operação"));
      break;
    case 3:
      set("averageRevenue", required(data.averageRevenue, "Faturamento médio"));
      set("orderVolume", required(data.orderVolume, "Volume de vendas"));
      if (!data.currentProducts) {
        set("currentProducts", "Selecione uma opção.");
      }
      break;
    case 4:
      if (!data.objective) set("objective", "Selecione o que você busca.");
      break;
    case 5:
      if (!data.motivation || data.motivation.trim().length < 10) {
        set("motivation", "Conte um pouco mais (mínimo 10 caracteres).");
      }
      break;
  }

  return errors;
}

export function isStepValid(step: number, data: LeadInput): boolean {
  return Object.keys(validateStep(step, data)).length === 0;
}

export const EMPTY_LEAD: LeadInput = {
  name: "",
  whatsapp: "",
  email: "",
  company: "",
  city: "",
  state: "",
  instagram: "",
  website: "",
  segment: "",
  units: "",
  businessAge: "",
  averageRevenue: "",
  orderVolume: "",
  currentProducts: "",
  currentSupplier: "",
  objective: "",
  motivation: "",
};
