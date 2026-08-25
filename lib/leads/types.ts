// Modelo de dados do lead B2B da i.sí.
// Estrutura espelha o documento "Cadastro de Interesse Comercial i.sí"
// (7 seções) já com os ajustes pedidos pelo cliente. Pronta para receber
// persistência real (DB) e um painel administrativo posteriormente.

export type LeadStatus =
  | "new"
  | "analyzing"
  | "contacted"
  | "qualified"
  | "rejected"
  | "converted";

/** Dados coletados pelo formulário público (7 seções do cadastro). */
export interface LeadInput {
  // 1 — Sobre a empresa
  company: string;
  responsibleName: string;
  whatsapp: string;
  instagram?: string;
  cityState: string;
  businessAge: string;
  operationModel: string;
  serviceType: string; // NOVO: self service / à la carte
  units: string;

  // 2 — Posicionamento da loja
  positioning: string;
  mainAudience: string;
  averageTicket: string;
  currentBrands: string;
  supplierValue: string;

  // 3 — Perfil de consumo
  mainProduct: string;
  monthlyVolume: string; // agora em caixas/mês
  simultaneousFlavors: string;
  higherValueProducts: string; // sim / não
  averagePortionPrice: string;

  // 4 — Estrutura e operação
  freezers: string;
  restockFrequency: string;
  salesTeam: string; // sim / não
  premiumSpace: string; // sim / não / parcialmente
  displayDetails: string; // NOVO
  staffInfo: string; // NOVO — quantidade de funcionários e cargos

  // 5 — Compra e potencial comercial
  purchaseExpectation: string; // baldes/mês
  firstPurchaseTime: string;
  exclusiveFlavors: string; // sim / não
  brandStrategy: string; // principal / complementar / testar

  // 6 — Perfil financeiro e comercial
  supplierFrequency: string;
  paymentMethod: string;
  dependsOnTerm: string; // ALTERADO: depende de prazo para compra? sim / não

  // 7 — Identificação do perfil i.sí
  expectation: string;
  premiumMeaning: string;
  innovationImportance: string; // baixa / média / alta / essencial
  willingHigherPrice: string; // sim / não
  interestLaunches: string; // sim / não
  followBrandGuidelines: string; // sim / não
  whyMatch: string;
}

/** Lead persistido — inclui campos derivados/sistema. */
export interface Lead extends LeadInput {
  id: string;
  score: number;
  status: LeadStatus;
  createdAt: string; // ISO
}

/** Helper: transforma uma lista de rótulos em opções {value,label}. */
function opts(...labels: string[]): { value: string; label: string }[] {
  return labels.map((label) => ({ value: label, label }));
}

// ————— Listas de opções (value = label; V1 sem persistência) —————

export const SERVICE_TYPE_OPTIONS = opts("Self service", "À la carte");

export const OPERATION_MODEL_OPTIONS = opts(
  "Loja de açaí",
  "Sorveteria",
  "Gelateria",
  "Cafeteria",
  "Restaurante",
  "Hotel",
  "Empório",
  "Distribuidor",
  "Outro",
);

export const POSITIONING_OPTIONS = opts(
  "Popular",
  "Intermediário",
  "Premium",
  "Alto padrão",
);

export const AUDIENCE_OPTIONS = opts(
  "Preço",
  "Custo-benefício",
  "Qualidade",
  "Experiência",
  "Produtos premium",
);

export const SUPPLIER_VALUE_OPTIONS = opts(
  "Preço",
  "Qualidade",
  "Exclusividade",
  "Padronização",
  "Inovação",
  "Atendimento",
  "Prazo",
  "Logística",
);

// Volume mensal — agora em CAIXAS (antes era em quilos).
export const MONTHLY_VOLUME_OPTIONS = opts(
  "1 a 20 caixas",
  "20 a 40 caixas",
  "40 a 60 caixas",
  "60+ caixas",
);

export const RESTOCK_OPTIONS = opts(
  "Semanal",
  "Quinzenal",
  "Mensal",
  "Conforme necessidade",
);

export const PREMIUM_SPACE_OPTIONS = opts("Sim", "Não", "Parcialmente");

// Expectativa de compra — reduzida para 4 faixas (baldes/mês).
export const PURCHASE_EXPECTATION_OPTIONS = opts(
  "1 a 5",
  "6 a 10",
  "11 a 20",
  "20+",
);

export const FIRST_PURCHASE_OPTIONS = opts(
  "Imediatamente",
  "Até 7 dias",
  "Até 30 dias",
  "Ainda estou avaliando",
);

export const BRAND_STRATEGY_OPTIONS = opts(
  "Linha principal",
  "Linha complementar",
  "Testar inicialmente",
);

export const PAYMENT_OPTIONS = opts(
  "PIX",
  "Transferência",
  "Cartão",
  "Boleto",
  "Outro",
);

export const INNOVATION_OPTIONS = opts(
  "Baixa",
  "Média",
  "Alta",
  "Essencial",
);

export const YES_NO_OPTIONS = opts("Sim", "Não");
