import type { Metadata } from "next"
import Link from "next/link"
import { ShieldHalf } from "lucide-react"

export const metadata: Metadata = {
  title: "About — CyberSathi",
  description:
    "CyberSathi is India's cyber-crime awareness portal — curated blogs, breaking news, and expert videos to keep you one step ahead of scammers.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-10 flex items-center gap-3">
        <ShieldHalf className="h-9 w-9 text-primary" aria-hidden />
        <h1 className="text-3xl font-bold tracking-tight">About CyberSathi</h1>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CyberSathi (<em>साथी</em> means "companion" in Hindi) is an independent
          cyber-crime awareness platform built for India. Our mission is simple:
          keep everyday people informed about the threats that target them —
          phishing, UPI fraud, ransomware, data breaches, and more.
        </p>

        <h2>What we publish</h2>
        <ul>
          <li>
            <strong>Blogs</strong> — In-depth, editorially reviewed guides on
            cyber-crime topics relevant to Indian users.
          </li>
          <li>
            <strong>News</strong> — Curated summaries of breaking cyber-security
            news from trusted sources, updated daily.
          </li>
          <li>
            <strong>Videos</strong> — Hand-picked YouTube content from reputable
            security researchers and educators.
          </li>
        </ul>

        <h2>Editorial standards</h2>
        <p>
          AI assists our content pipeline, but every article published on
          CyberSathi is reviewed by a human editor before going live. We clearly
          label AI-assisted content and link to primary sources wherever possible.
          We never republish full articles without permission — for news, we
          summarise and link back.
        </p>

        <h2>Privacy first</h2>
        <p>
          We do not sell your data. Our{" "}
          <Link href="/privacy">privacy policy</Link> explains exactly what we
          collect and why. The newsletter is opt-in only and you can unsubscribe
          at any time.
        </p>

        <h2>Contact</h2>
        <p>
          Questions, corrections, or partnership enquiries? Reach us on the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  )
}
