"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"

type ContentStatus = "pending_review" | "published" | "rejected" | "archived"

export async function setVideoStatus(id: string, status: ContentStatus) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  await db
    .update(schema.videos)
    .set({ status })
    .where(eq(schema.videos.id, id))

  revalidatePath("/admin/videos")
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/videos")
  return { ok: true }
}
