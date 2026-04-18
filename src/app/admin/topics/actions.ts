"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"

const AddSchema = z.object({
  keyword: z
    .string()
    .min(2, { error: "At least 2 characters." })
    .max(120, { error: "Keep it under 120 characters." })
    .trim(),
  priority: z.coerce.number().int().min(0).max(1000).default(50),
})

export type AddTopicState =
  | {
      error?: string
      fieldErrors?: { keyword?: string[]; priority?: string[] }
    }
  | undefined

export async function addTopic(
  _prev: AddTopicState,
  formData: FormData,
): Promise<AddTopicState> {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  const parsed = AddSchema.safeParse({
    keyword: formData.get("keyword"),
    priority: formData.get("priority"),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  try {
    await db.insert(schema.topicQueue).values({
      keyword: parsed.data.keyword,
      priority: parsed.data.priority,
      active: true,
    })
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "That keyword is already in the queue." }
    }
    return { error: "Failed to add topic." }
  }

  revalidatePath("/admin/topics")
  return {}
}

export async function toggleTopicActive(id: string, next: boolean) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  await db
    .update(schema.topicQueue)
    .set({ active: next })
    .where(eq(schema.topicQueue.id, id))

  revalidatePath("/admin/topics")
  return { ok: true }
}

export async function deleteTopic(id: string) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  await db.delete(schema.topicQueue).where(eq(schema.topicQueue.id, id))

  revalidatePath("/admin/topics")
  return { ok: true }
}
