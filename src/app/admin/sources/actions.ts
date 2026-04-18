"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"

const AddSchema = z.object({
  name: z
    .string()
    .min(2, { error: "At least 2 characters." })
    .max(120)
    .trim(),
  type: z.enum(["rss", "api"], { error: "Pick rss or api." }),
  url: z.url({ error: "Must be a valid URL." }).trim(),
})

export type AddSourceState =
  | {
      error?: string
      fieldErrors?: {
        name?: string[]
        type?: string[]
        url?: string[]
      }
    }
  | undefined

export async function addSource(
  _prev: AddSourceState,
  formData: FormData,
): Promise<AddSourceState> {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  const parsed = AddSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    url: formData.get("url"),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  try {
    await db.insert(schema.newsSources).values({
      name: parsed.data.name,
      type: parsed.data.type,
      url: parsed.data.url,
      active: true,
    })
  } catch {
    return { error: "Failed to add source." }
  }

  revalidatePath("/admin/sources")
  return {}
}

export async function toggleSourceActive(id: string, next: boolean) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  await db
    .update(schema.newsSources)
    .set({ active: next })
    .where(eq(schema.newsSources.id, id))

  revalidatePath("/admin/sources")
  return { ok: true }
}

export async function deleteSource(id: string) {
  const session = await getAdminSession()
  if (!session) return { error: "Not authorized." }

  await db.delete(schema.newsSources).where(eq(schema.newsSources.id, id))

  revalidatePath("/admin/sources")
  return { ok: true }
}
