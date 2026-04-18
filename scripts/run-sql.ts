import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import postgres from "postgres"

async function main() {
  const [, , file] = process.argv
  if (!file) {
    console.error("usage: tsx scripts/run-sql.ts <path/to/file.sql>")
    process.exit(1)
  }

  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("DATABASE_URL is not set — check .env.local")
    process.exit(1)
  }

  const sql = postgres(url, { max: 1, prepare: false })
  const contents = await readFile(resolve(file), "utf8")

  console.log(`Applying ${file}\u2026`)
  try {
    await sql.unsafe(contents)
    console.log("Done.")
  } catch (err) {
    console.error("SQL failed:", err)
    process.exitCode = 1
  } finally {
    await sql.end()
  }
}

main()
