"use server"

import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db, schema } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
})

export type LoginState =
  | {
      error?: string
      fieldErrors?: {
        email?: string[]
        password?: string[]
      }
    }
  | undefined

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: "Invalid email or password." }
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(schema.profiles.userId, data.user.id),
    columns: { role: true },
  })

  if (profile?.role !== "admin") {
    await supabase.auth.signOut()
    return { error: "This account is not authorized for admin access." }
  }

  redirect("/admin")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin")
}
