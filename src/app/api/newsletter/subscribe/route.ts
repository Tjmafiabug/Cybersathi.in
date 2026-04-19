import { NextResponse } from "next/server"
import { Resend } from "resend"
import { db, schema } from "@/lib/db"

let _resend: Resend | null = null
function getResend() {
  _resend ??= new Resend(process.env.RESEND_API_KEY)
  return _resend
}
const FROM = "CyberSathi <newsletter@cybersathi.in>"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cybersathi.in"

export async function POST(req: Request) {
  let email: string
  try {
    const body = await req.json()
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 })
  }

  try {
    await db
      .insert(schema.subscribers)
      .values({ email })
      .onConflictDoNothing({ target: schema.subscribers.email })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }

  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to CyberSathi — you're subscribed",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px">
          <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Welcome to CyberSathi</h1>
          <p style="color:#555;line-height:1.6">
            You're now subscribed to our weekly cyber-crime digest — India-first,
            globally informed, no fluff.
          </p>
          <p style="color:#555;line-height:1.6">
            We'll be in your inbox every week with the scams, breaches, and threats
            worth knowing about.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="font-size:12px;color:#999">
            Don't want these?
            <a href="${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#999">
              Unsubscribe
            </a>
          </p>
        </div>
      `,
    })
  } catch {
    // Email delivery failure is non-fatal — subscriber is already saved.
  }

  return NextResponse.json({ ok: true })
}
