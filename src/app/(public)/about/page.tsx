import type { Metadata } from "next"
import Link from "next/link"
import { ShieldHalf, ExternalLink } from "lucide-react"

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

        <h2>The people behind it</h2>

        <div className="not-prose mb-6 rounded-2xl border border-border bg-muted/40 p-6">
          <div className="flex flex-col gap-1">
            <a
              href="https://www.kunwersachdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              Kunwer Sachdev
              <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <p className="text-sm font-medium text-primary">Idea &amp; Vision</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Known as the Inverter Man of India, Kunwer Sachdev is the founder of Su-Kam Power Systems —
              one of India's most recognized names in power backup. The idea of CyberSathi grew from his
              conviction that digital safety awareness is the next frontier for everyday Indians.
              He brings the vision, the network, and a deep belief that no one should lose their
              savings or dignity to online fraud.
            </p>
          </div>
        </div>

        <div className="not-prose mb-8 rounded-2xl border border-border bg-muted/40 p-6">
          <div className="flex flex-col gap-1">
            <a
              href="https://www.tanishqjain.co"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              Tanishq Jain
              <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <p className="text-sm font-medium text-primary">Builder</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Ecosystem builder at Delhi Angels, India's leading angel investment network, and an
              AI enthusiast turning ideas into products. Tanishq designed and built CyberSathi from
              the ground up — the content pipeline, the editorial tooling, and every pixel of the
              platform — with a focus on speed, trust, and reach.
            </p>
          </div>
        </div>

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
