import "server-only"
import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"

const COOKIE_NAME = "isi_admin"
const MAX_AGE = 60 * 60 * 12 // 12 horas

function getSecret(): string {
  // Deriva a chave de assinatura a partir da própria senha admin,
  // então nenhuma senha em texto puro fica no cookie.
  const pwd = process.env.ADMIN_PASSWORD
  if (!pwd) {
    throw new Error("ADMIN_PASSWORD_MISSING")
  }
  return pwd
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

function makeToken(): string {
  // O payload é fixo; o valor do cookie é payload.assinatura.
  const payload = "ok"
  return `${payload}.${sign(payload)}`
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, sig] = token.split(".")
  if (payload !== "ok" || !sig) return false
  const expected = sign(payload)
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/** Compara a senha informada com a senha configurada (tempo constante). */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies()
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false
  const store = await cookies()
  return isValidToken(store.get(COOKIE_NAME)?.value)
}
