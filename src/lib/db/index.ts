import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

// Reuse the Postgres client across hot reloads in dev.
declare global {
  var __pgClient: ReturnType<typeof postgres> | undefined
}

const client =
  globalThis.__pgClient ??
  postgres(connectionString, { prepare: false, max: 1 })

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgClient = client
}

export const db = drizzle(client, { schema, casing: "snake_case" })
export { schema }
