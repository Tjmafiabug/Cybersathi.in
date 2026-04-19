import { config } from "dotenv"
config({ path: ".env.local" })
import { asc, eq } from "drizzle-orm"
import pLimit from "p-limit"
import { db, schema } from "../src/lib/db"
import { scrapeSource } from "../src/lib/pipelines/news-scraper"
import { failJob, finishJob, startJob } from "../src/lib/pipelines/job-logger"

const MAX = Number(process.env.MAX_NEWS_PER_SCRAPE_RUN ?? "10")

async function main() {
  const [sources, categories] = await Promise.all([
    db.select().from(schema.newsSources).where(eq(schema.newsSources.active, true)),
    db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
  ])

  console.log(`Sources: ${sources.length} | Max per run: ${MAX}`)

  const jobId = await startJob("scrape_news")
  const perSource = Math.max(1, Math.ceil(MAX / sources.length))
  const limit = pLimit(2)
  let total = 0

  await Promise.all(
    sources.map((s) =>
      limit(async () => {
        try {
          const n = await scrapeSource(s, categories, perSource)
          total += n
          console.log(`  [${s.name}] +${n}`)
        } catch (e) {
          console.error(`  [${s.name}] ERROR:`, e)
        }
      }),
    ),
  )

  await finishJob(jobId, total)
  console.log(`Done. Total inserted: ${total}`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
