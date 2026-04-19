import { NextRequest, NextResponse } from "next/server"
import { asc, eq } from "drizzle-orm"
import pLimit from "p-limit"
import { db, schema } from "@/lib/db"
import { scrapeSource } from "@/lib/pipelines/news-scraper"
import { failJob, finishJob, startJob } from "@/lib/pipelines/job-logger"

export async function POST(req: NextRequest) {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const jobId = await startJob("scrape_news")

  try {
    const [sources, categories] = await Promise.all([
      db.select().from(schema.newsSources).where(eq(schema.newsSources.active, true)),
      db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
    ])

    if (sources.length === 0) {
      await finishJob(jobId, 0)
      return NextResponse.json({ success: true, itemsProcessed: 0 })
    }

    const limit = pLimit(2)
    const errors: Array<{ message: string; stack?: string }> = []
    let itemsProcessed = 0

    await Promise.all(
      sources.map((source) =>
        limit(async () => {
          try {
            const count = await scrapeSource(source, categories)
            itemsProcessed += count
          } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err))
            errors.push({ message: `[${source.name}] ${e.message}`, stack: e.stack })
          }
        }),
      ),
    )

    await finishJob(jobId, itemsProcessed, errors)
    return NextResponse.json({ success: true, itemsProcessed, errors })
  } catch (err) {
    await failJob(jobId, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
