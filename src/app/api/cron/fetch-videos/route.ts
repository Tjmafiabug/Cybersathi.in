import { NextRequest, NextResponse } from "next/server"
import { asc, eq } from "drizzle-orm"
import { db, schema } from "@/lib/db"
import { fetchVideos } from "@/lib/pipelines/video-fetcher"
import { failJob, finishJob, startJob } from "@/lib/pipelines/job-logger"

const MAX_VIDEOS_PER_RUN = Number(process.env.MAX_VIDEOS_PER_RUN ?? "5")

export async function POST(req: NextRequest) {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const jobId = await startJob("fetch_videos")

  try {
    const [topics, categories] = await Promise.all([
      db
        .select()
        .from(schema.topicQueue)
        .where(eq(schema.topicQueue.active, true))
        .orderBy(asc(schema.topicQueue.lastUsedAt), asc(schema.topicQueue.priority))
        .limit(MAX_VIDEOS_PER_RUN),
      db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
    ])

    if (topics.length === 0 || categories.length === 0) {
      await finishJob(jobId, 0)
      return NextResponse.json({ success: true, itemsProcessed: 0 })
    }

    const errors: Array<{ message: string; stack?: string }> = []
    let itemsProcessed = 0

    for (const topic of topics) {
      if (itemsProcessed >= MAX_VIDEOS_PER_RUN) break
      try {
        const count = await fetchVideos(topic.keyword, categories, MAX_VIDEOS_PER_RUN - itemsProcessed)
        itemsProcessed += count
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err))
        errors.push({ message: `[${topic.keyword}] ${e.message}`, stack: e.stack })
      }
    }

    await finishJob(jobId, itemsProcessed, errors)
    return NextResponse.json({ success: true, itemsProcessed, errors })
  } catch (err) {
    await failJob(jobId, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
