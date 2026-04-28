import { NextRequest, NextResponse } from "next/server"
import { asc, count, eq } from "drizzle-orm"
import pLimit from "p-limit"
import { db, schema } from "@/lib/db"
import { scrapeSource } from "@/lib/pipelines/news-scraper"
import { failJob, finishJob, startJob } from "@/lib/pipelines/job-logger"

const MAX_NEWS_PER_RUN = Number(process.env.MAX_NEWS_PER_SCRAPE_RUN ?? "10")
const PENDING_NEWS_LIMIT = Number(process.env.PENDING_NEWS_LIMIT ?? "50")

export async function GET(req: NextRequest) {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const jobId = await startJob("scrape_news")

  try {
    const [{ pendingCount }] = await db
      .select({ pendingCount: count() })
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.status, "pending_review"))

    if (pendingCount >= PENDING_NEWS_LIMIT) {
      await finishJob(jobId, 0)
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: `${pendingCount} news articles pending review — clear queue first (limit: ${PENDING_NEWS_LIMIT})`,
      })
    }

    const [sources, categories] = await Promise.all([
      db.select().from(schema.newsSources).where(eq(schema.newsSources.active, true)),
      db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
    ])

    if (sources.length === 0) {
      await finishJob(jobId, 0)
      return NextResponse.json({ success: true, itemsProcessed: 0 })
    }

    const perSource = Math.max(1, Math.ceil(MAX_NEWS_PER_RUN / sources.length))
    const limit = pLimit(2)
    const errors: Array<{ message: string; stack?: string }> = []
    let itemsProcessed = 0

    await Promise.all(
      sources.map((source) =>
        limit(async () => {
          try {
            const count = await scrapeSource(source, categories, perSource)
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
