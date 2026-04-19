import { config } from "dotenv"
config({ path: ".env.local" })
import { isNull } from "drizzle-orm"
import { db, schema } from "../src/lib/db"

async function main() {
  const deleted = await db
    .delete(schema.newsArticles)
    .where(isNull(schema.newsArticles.imageUrl))
    .returning({ id: schema.newsArticles.id })
  console.log(`Deleted ${deleted.length} articles with no image.`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
