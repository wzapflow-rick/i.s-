// Modelo de dados do lead B2B da i.sí.
// V1: estrutura pronta para receber persistência real (DB) e um painel
// administrativo posteriormente. Nada aqui é regra de negócio definitiva.

export type LeadStatus =
  | "new"
  | "analyzing"
  | "contacted"
  | "qualified"
  | "rejected"
  | "converted";

export type LeadSegment =
  | "acaiteria"
  | "sorveteria"
  | "gelateria"
  | "loja-sobremesas"
  | "cafeteria"
  | "mercado"
  | "outro";

export type LeadObjective =
  | "novo-fornecedor"
  | "melhorar-produtos"
  | "ampliar-mix"
  | "nova-unidade"
  | "trocar-fornecedor"
  | "outra-oportunidade";

export type LeadStructure =
  | "freezer-proprio"
  | "espaco-limitado"
  | "sem-estrutura"
  | "avaliar";

export type LeadStartIntent =
  | "imediato"
  | "30-dias"
  | "60-90-dias"
  | "avaliando";

/** Dados coletados pelo formulário público (etapas 1–6). */
export interface LeadInput {
  // Etapa 1 — Sobre você
  name: string;
  whatsapp: string;
  email: string;

  // Etapa 2 — Sobre a empresa
  company: string;
  city: string;
  state: string;
  instagram?: string;
  website?: string;

  // Etapa 3 — Seu negócio
  segment: LeadSegment | "";
  units: string;
  businessAge: string;

  // Etapa 4 — Sua operação
  averageRevenue: string;
  orderVolume: string;
  currentProducts: "sim" | "nao" | "";
  currentSupplier?: string;
  purchaseVolume: string;
  structure: LeadStructure | "";

  // Etapa 5 — O que você busca
  objective: LeadObjective | "";
  startIntent: LeadStartIntent | "";

  // Etapa 6 — Motivação
  motivation: string;
}

/** Lead persistido — inclui campos derivados/sistema. */
export interface Lead extends LeadInput {
  id: string;
  score: number;
  status: LeadStatus;
  createdAt: string; // ISO
}

export const SEGMENT_OPTIONS: { value: LeadSegment; label: string }[] = [
  { value: "acaiteria", label: "Açaíteria" },
  { value: "sorveteria", label: "Sorveteria" },
  { value: "gelateria", label: "Gelateria" },
  { value: "loja-sobremesas", label: "Loja de sobremesas" },
  { value: "cafeteria", label: "Cafeteria" },
  { value: "mercado", label: "Mercado" },
  { value: "outro", label: "Outro" },
];

export const OBJECTIVE_OPTIONS: { value: LeadObjective; label: string }[] = [
  { value: "novo-fornecedor", label: "Novo fornecedor" },
  { value: "melhorar-produtos", label: "Melhorar produtos" },
  { value: "ampliar-mix", label: "Ampliar mix" },
  { value: "nova-unidade", label: "Abrir nova unidade" },
  { value: "trocar-fornecedor", label: "Trocar fornecedor" },
  { value: "outra-oportunidade", label: "Outra oportunidade" },
];

export const STRUCTURE_OPTIONS: { value: LeadStructure; label: string }[] = [
  { value: "freezer-proprio", label: "Tenho freezer próprio" },
  { value: "espaco-limitado", label: "Espaço limitado" },
  { value: "sem-estrutura", label: "Ainda sem estrutura" },
  { value: "avaliar", label: "Preciso avaliar" },
];

export const START_INTENT_OPTIONS: { value: LeadStartIntent; label: string }[] = [
  { value: "imediato", label: "O quanto antes" },
  { value: "30-dias", label: "Em até 30 dias" },
  { value: "60-90-dias", label: "Em 60–90 dias" },
  { value: "avaliando", label: "Ainda avaliando" },
];
