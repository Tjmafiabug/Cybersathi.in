import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db, schema } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export type AdminSession = {
  userId: string
  email: string
  displayName: string | null
}

export const getSession = cache(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
})

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const user = await getSession()
  if (!user) return null

  const profile = await db.query.profiles.findFirst({
    where: eq(schema.profiles.userId, user.id),
    columns: { role: true, displayName: true },
  })

  if (profile?.role !== "admin") return null

  return {
    userId: user.id,
    email: user.email ?? "",
    displayName: profile.displayName,
  }
})

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect("/login?next=/admin")
  return session
}
