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

  // Só habilita SSL quando a connection string pede explicitamente
  // (sslmode=require/verify-*). Servidores locais/self-hosted que não
  // suportam SSL funcionam com ssl desligado.
  const wantsSsl = /sslmode=(require|verify-ca|verify-full)/.test(
    connectionString,
  )

  return new Pool({
    connectionString,
    ssl: wantsSsl ? { rejectUnauthorized: false } : false,
    max: 5,
  })
}

// Cria o pool sob demanda (lazy). Isso evita que o build do Next.js quebre
// ao "collect page data", quando o módulo é importado sem DATABASE_URL
// disponível. A conexão só é aberta quando uma query é realmente executada.
function getPool(): Pool {
  if (!globalForDb.__isiPgPool) {
    globalForDb.__isiPgPool = createPool()
  }
  return globalForDb.__isiPgPool
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[]; rowCount: number }> {
  const result = await getPool().query(text, params as never[])
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 }
}
