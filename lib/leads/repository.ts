import "server-only"
import { query } from "@/lib/db"
import type { Lead, LeadInput, LeadStatus } from "./types"

// Mapeamento camelCase (app) <-> snake_case (colunas do Postgres).
// Mantido explícito para espelhar fielmente os campos reais do formulário.
const COLUMNS: { col: string; key: keyof LeadInput }[] = [
  { col: "company", key: "company" },
  { col: "responsible_name", key: "responsibleName" },
  { col: "whatsapp", key: "whatsapp" },
  { col: "instagram", key: "instagram" },
  { col: "city_state", key: "cityState" },
  { col: "business_age", key: "businessAge" },
  { col: "operation_model", key: "operationModel" },
  { col: "service_type", key: "serviceType" },
  { col: "units", key: "units" },
  { col: "positioning", key: "positioning" },
  { col: "main_audience", key: "mainAudience" },
  { col: "average_ticket", key: "averageTicket" },
  { col: "current_brands", key: "currentBrands" },
  { col: "supplier_value", key: "supplierValue" },
  { col: "main_product", key: "mainProduct" },
  { col: "monthly_volume", key: "monthlyVolume" },
  { col: "simultaneous_flavors", key: "simultaneousFlavors" },
  { col: "higher_value_products", key: "higherValueProducts" },
  { col: "average_portion_price", key: "averagePortionPrice" },
  { col: "freezers", key: "freezers" },
  { col: "restock_frequency", key: "restockFrequency" },
  { col: "sales_team", key: "salesTeam" },
  { col: "premium_space", key: "premiumSpace" },
  { col: "display_details", key: "displayDetails" },
  { col: "staff_info", key: "staffInfo" },
  { col: "purchase_expectation", key: "purchaseExpectation" },
  { col: "first_purchase_time", key: "firstPurchaseTime" },
  { col: "exclusive_flavors", key: "exclusiveFlavors" },
  { col: "brand_strategy", key: "brandStrategy" },
  { col: "supplier_frequency", key: "supplierFrequency" },
  { col: "payment_method", key: "paymentMethod" },
  { col: "depends_on_term", key: "dependsOnTerm" },
  { col: "expectation", key: "expectation" },
  { col: "premium_meaning", key: "premiumMeaning" },
  { col: "innovation_importance", key: "innovationImportance" },
  { col: "willing_higher_price", key: "willingHigherPrice" },
  { col: "interest_launches", key: "interestLaunches" },
  { col: "follow_brand_guidelines", key: "followBrandGuidelines" },
  { col: "why_match", key: "whyMatch" },
]

interface LeadRow {
  id: string
  score: number
  status: LeadStatus
  created_at: Date
  [key: string]: unknown
}

function rowToLead(row: LeadRow): Lead {
  const lead: Record<string, unknown> = {
    id: String(row.id),
    score: Number(row.score),
    status: row.status,
    createdAt: (row.created_at instanceof Date
      ? row.created_at
      : new Date(row.created_at as string)
    ).toISOString(),
  }

  for (const { col, key } of COLUMNS) {
    lead[key] = (row[col] ?? "") as string
  }

  return lead as unknown as Lead
}

export async function insertLead(
  data: LeadInput,
  score: number,
): Promise<string> {
  const insertCols = COLUMNS.map((c) => c.col)
  const values: unknown[] = COLUMNS.map((c) => {
    const v = data[c.key]
    return v === undefined ? null : v
  })

  // score é o último parâmetro
  values.push(score)

  const allCols = [...insertCols, "score"]
  const placeholders = allCols.map((_, i) => `$${i + 1}`).join(", ")

  const { rows } = await query<{ id: string }>(
    `INSERT INTO leads (${allCols.join(", ")})
     VALUES (${placeholders})
     RETURNING id`,
    values,
  )

  return String(rows[0].id)
}

const SELECT_COLS = `id, score, status, created_at, ${COLUMNS.map((c) => c.col).join(", ")}`

export async function listLeads(): Promise<Lead[]> {
  const { rows } = await query<LeadRow>(
    `SELECT ${SELECT_COLS} FROM leads ORDER BY score DESC, created_at DESC`,
  )
  return rows.map(rowToLead)
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const { rows } = await query<LeadRow>(
    `SELECT ${SELECT_COLS} FROM leads WHERE id = $1`,
    [id],
  )
  return rows[0] ? rowToLead(rows[0]) : null
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<void> {
  await query(`UPDATE leads SET status = $1 WHERE id = $2`, [status, id])
}
