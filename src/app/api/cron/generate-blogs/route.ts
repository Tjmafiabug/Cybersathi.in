import { NextRequest, NextResponse } from "next/server"
import { and, asc, eq, isNull, or } from "drizzle-orm"
import pLimit from "p-limit"
import { db, schema } from "@/lib/db"
import { generateBlog } from "@/lib/pipelines/blog-generator"
import { failJob, finishJob, startJob } from "@/lib/pipelines/job-logger"

const MAX_BLOGS_PER_RUN = Number(process.env.MAX_BLOGS_PER_RUN ?? "3")

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const jobId = await startJob("generate_blogs")

  try {
    const [topics, categories] = await Promise.all([
      db
        .select()
        .from(schema.topicQueue)
        .where(eq(schema.topicQueue.active, true))
        .orderBy(
          asc(schema.topicQueue.lastUsedAt),
          asc(schema.topicQueue.priority),
        )
        .limit(MAX_BLOGS_PER_RUN),
      db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder)),
    ])

    if (categories.length === 0) {
      await finishJob(jobId, 0)
      return NextResponse.json({ success: true, itemsProcessed: 0 })
    }

    const limit = pLimit(1)
    const errors: Array<{ message: string; stack?: string }> = []
    let itemsProcessed = 0

    await Promise.all(
      topics.map((topic) =>
        limit(async () => {
          try {
            await generateBlog(topic, categories)
            itemsProcessed++
          } catch (err) {
            const e = err instanceof Error ? err : new Error(String(err))
            errors.push({ message: `[${topic.keyword}] ${e.message}`, stack: e.stack })
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
