import { Pool } from "pg"

// Reutiliza o pool entre hot-reloads em desenvolvimento para evitar
// esgotar as conexões do Postgres.
const globalForDb = globalThis as unknown as {
  __isiPgPool?: Pool
}

function createPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL não está configurada no ambiente do projeto.")
  }

  return new Pool({
    connectionString,
    // A maioria dos Postgres gerenciados exige SSL. Deixamos permissivo
    // para funcionar tanto localmente quanto em provedores gerenciados.
    ssl: connectionString.includes("sslmode=disable")
      ? false
      : { rejectUnauthorized: false },
    max: 5,
  })
}

export const pool = globalForDb.__isiPgPool ?? createPool()

if (process.env.NODE_ENV !== "production") {
  globalForDb.__isiPgPool = pool
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await pool.query(text, params as never[])
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 }
}
