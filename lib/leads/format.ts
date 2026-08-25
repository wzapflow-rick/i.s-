import type { LeadInput, LeadStatus } from "./types"

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Novo",
  analyzing: "Em análise",
  contacted: "Contatado",
  qualified: "Qualificado",
  rejected: "Recusado",
  converted: "Convertido",
}

/** Monta um link wa.me a partir do WhatsApp informado (assume Brasil). */
export function whatsappLink(raw: string, message?: string): string {
  const digits = raw.replace(/\D/g, "")
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`
  const base = `https://wa.me/${withCountry}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Normaliza o @ do Instagram e devolve o link do perfil, se houver. */
export function instagramLink(raw?: string): string | null {
  if (!raw) return null
  const handle = raw.trim().replace(/^@/, "").replace(/\s+/g, "")
  if (!handle) return null
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://instagram.com/${handle}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Estrutura os campos do lead em seções (para exibição no drawer),
 * espelhando as 7 seções do cadastro. Só usa campos reais do LeadInput.
 */
export interface LeadSection {
  title: string
  fields: { label: string; key: keyof LeadInput }[]
}

export const LEAD_SECTIONS: LeadSection[] = [
  {
    title: "Sobre a empresa",
    fields: [
      { label: "Empresa", key: "company" },
      { label: "Responsável", key: "responsibleName" },
      { label: "WhatsApp", key: "whatsapp" },
      { label: "Instagram", key: "instagram" },
      { label: "Cidade / Estado", key: "cityState" },
      { label: "Tempo de operação", key: "businessAge" },
      { label: "Modelo de operação", key: "operationModel" },
      { label: "Tipo de serviço", key: "serviceType" },
      { label: "Unidades", key: "units" },
    ],
  },
  {
    title: "Posicionamento da loja",
    fields: [
      { label: "Posicionamento", key: "positioning" },
      { label: "Público principal", key: "mainAudience" },
      { label: "Ticket médio", key: "averageTicket" },
      { label: "Marcas atuais", key: "currentBrands" },
      { label: "O que valoriza no fornecedor", key: "supplierValue" },
    ],
  },
  {
    title: "Perfil de consumo",
    fields: [
      { label: "Produto principal", key: "mainProduct" },
      { label: "Volume mensal", key: "monthlyVolume" },
      { label: "Sabores simultâneos", key: "simultaneousFlavors" },
      { label: "Vende produtos de maior valor", key: "higherValueProducts" },
      { label: "Preço médio da porção", key: "averagePortionPrice" },
    ],
  },
  {
    title: "Estrutura e operação",
    fields: [
      { label: "Freezers", key: "freezers" },
      { label: "Frequência de reposição", key: "restockFrequency" },
      { label: "Equipe de vendas", key: "salesTeam" },
      { label: "Espaço premium", key: "premiumSpace" },
      { label: "Detalhes de exposição", key: "displayDetails" },
      { label: "Funcionários e cargos", key: "staffInfo" },
    ],
  },
  {
    title: "Compra e potencial comercial",
    fields: [
      { label: "Expectativa de compra", key: "purchaseExpectation" },
      { label: "Prazo da 1ª compra", key: "firstPurchaseTime" },
      { label: "Sabores exclusivos", key: "exclusiveFlavors" },
      { label: "Estratégia da marca", key: "brandStrategy" },
    ],
  },
  {
    title: "Perfil financeiro e comercial",
    fields: [
      { label: "Frequência de compra", key: "supplierFrequency" },
      { label: "Forma de pagamento", key: "paymentMethod" },
      { label: "Depende de prazo", key: "dependsOnTerm" },
    ],
  },
  {
    title: "Perfil i.sí",
    fields: [
      { label: "Expectativa", key: "expectation" },
      { label: "O que é premium", key: "premiumMeaning" },
      { label: "Importância da inovação", key: "innovationImportance" },
      { label: "Aceita preço maior", key: "willingHigherPrice" },
      { label: "Interesse em lançamentos", key: "interestLaunches" },
      { label: "Segue diretrizes da marca", key: "followBrandGuidelines" },
      { label: "Por que combina", key: "whyMatch" },
    ],
  },
]
