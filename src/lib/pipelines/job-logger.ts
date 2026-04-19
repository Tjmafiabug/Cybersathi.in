import { eq } from "drizzle-orm"
import { db, schema } from "@/lib/db"

type JobType = (typeof schema.jobRuns.$inferInsert)["jobType"]
type ErrorItem = { message: string; stack?: string }

export async function startJob(jobType: JobType): Promise<string> {
  const [row] = await db
    .insert(schema.jobRuns)
    .values({ jobType, status: "running" })
    .returning({ id: schema.jobRuns.id })
  return row.id
}

export async function finishJob(
  id: string,
  itemsProcessed: number,
  errors: ErrorItem[] = [],
): Promise<void> {
  await db
    .update(schema.jobRuns)
    .set({
      status: itemsProcessed === 0 && errors.length > 0 ? "failed" : "succeeded",
      finishedAt: new Date(),
      itemsProcessed,
      errorsJson: errors.length > 0 ? errors : null,
    })
    .where(eq(schema.jobRuns.id, id))
}

export async function failJob(id: string, error: unknown): Promise<void> {
  const err = error instanceof Error ? error : new Error(String(error))
  await db
    .update(schema.jobRuns)
    .set({
      status: "failed",
      finishedAt: new Date(),
      errorsJson: [{ message: err.message, stack: err.stack }],
    })
    .where(eq(schema.jobRuns.id, id))
}
