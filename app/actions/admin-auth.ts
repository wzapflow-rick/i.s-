"use server"

import { redirect } from "next/navigation"
import {
  checkPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminConfigured,
} from "@/lib/auth/admin"

export interface LoginState {
  error?: string
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "A senha de acesso ainda não foi configurada (variável ADMIN_PASSWORD).",
    }
  }

  const password = String(formData.get("password") ?? "")
  if (!password) {
    return { error: "Informe a senha de acesso." }
  }

  // Pequeno atraso para dificultar tentativas por força bruta.
  await new Promise((r) => setTimeout(r, 400))

  if (!checkPassword(password)) {
    return { error: "Senha incorreta." }
  }

  await createAdminSession()
  redirect("/admin")
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession()
  redirect("/admin/login")
}
