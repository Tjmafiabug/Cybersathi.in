import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db, schema } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")?.trim().toLowerCase()

  if (!email) {
    return new NextResponse("Missing email", { status: 400 })
  }

  await db
    .update(schema.subscribers)
    .set({ unsubscribedAt: new Date() })
    .where(eq(schema.subscribers.email, email))

  return new NextResponse(
    `<html><body style="font-family:system-ui;text-align:center;padding:64px">
      <h2>You've been unsubscribed</h2>
      <p style="color:#555">You won't receive any more emails from CyberSathi.</p>
      <a href="https://cybersathi.in" style="color:#2563eb">Back to CyberSathi</a>
    </body></html>`,
    { headers: { "content-type": "text/html" } },
  )
}
