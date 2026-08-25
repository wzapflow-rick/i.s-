"use server"

import { revalidatePath } from "next/cache"
import { isAuthenticated } from "@/lib/auth/admin"
import { updateLeadStatus } from "@/lib/leads/repository"
import type { LeadStatus } from "@/lib/leads/types"

const VALID: LeadStatus[] = [
  "new",
  "analyzing",
  "contacted",
  "qualified",
  "rejected",
  "converted",
]

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus,
): Promise<{ ok: boolean }> {
  if (!(await isAuthenticated())) {
    return { ok: false }
  }
  if (!VALID.includes(status)) {
    return { ok: false }
  }

  try {
    await updateLeadStatus(id, status)
    revalidatePath("/admin")
    return { ok: true }
  } catch (error) {
    console.error("[v0] Erro ao atualizar status do lead:", error)
    return { ok: false }
  }
}
