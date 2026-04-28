"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"

type ContentStatus = "pending_review" | "published" | "rejected" | "archived"

export async function setVideoStatus(id: string, status: ContentStatus) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  const current = await db.query.videos.findFirst({
    where: eq(schema.videos.id, id),
    columns: { publishedAt: true },
  })
  if (!current) return { error: "Video not found." }

  const now = new Date()
  await db
    .update(schema.videos)
    .set({
      status,
      publishedAt:
        status === "published" ? (current.publishedAt ?? now) : current.publishedAt,
    })
    .where(eq(schema.videos.id, id))

  revalidatePath("/admin/videos")
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/videos")
  return { ok: true }
}
