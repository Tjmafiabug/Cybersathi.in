"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"

type ContentStatus = "pending_review" | "published" | "rejected" | "archived"

export async function setBlogStatus(id: string, status: ContentStatus) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  const current = await db.query.blogs.findFirst({
    where: eq(schema.blogs.id, id),
    columns: { publishedAt: true },
  })
  if (!current) return { error: "Blog not found." }

  const now = new Date()
  await db
    .update(schema.blogs)
    .set({
      status,
      publishedAt:
        status === "published" ? (current.publishedAt ?? now) : current.publishedAt,
      updatedAt: now,
    })
    .where(eq(schema.blogs.id, id))

  revalidatePath("/admin/blogs")
  revalidatePath("/admin")
  return { ok: true }
}
