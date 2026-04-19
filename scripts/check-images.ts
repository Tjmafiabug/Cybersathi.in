import { config } from "dotenv"
config({ path: ".env.local" })
import { db, schema } from "../src/lib/db"

async function main() {
  const rows = await db.select({
    imageUrl: schema.newsArticles.imageUrl,
    sourceUrl: schema.newsArticles.sourceUrl,
  }).from(schema.newsArticles)

  for (const r of rows) {
    console.log("IMG:", r.imageUrl)
    console.log("SRC:", r.sourceUrl)
    console.log("---")
  }
  process.exit(0)
}

main()
