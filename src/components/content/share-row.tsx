"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function ShareRow({
  url,
  title,
  className,
}: {
  url: string
  title: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const twitter = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const whatsapp = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const base =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">Share</span>
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={cn(base, "text-[13px] font-semibold")}
      >
        𝕏
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={cn(base, "text-[11px] font-semibold tracking-tight")}
      >
        in
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={cn(base, "text-[10px] font-semibold tracking-wider")}
      >
        WA
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className={cn(base, copied && "border-emerald-500/40 text-emerald-600")}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  )
}
