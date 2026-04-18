import { cn } from "@/lib/utils"

export type TocHeading = { level: 2 | 3; text: string; id: string }

// Extracts h2/h3 headings from a markdown string. Matches `rehype-slug`'s
// default slug rules closely enough for our purposes.
export function extractTocHeadings(md: string): TocHeading[] {
  const lines = md.split(/\r?\n/)
  const headings: TocHeading[] = []
  let inFence = false

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^```/.test(line.trim())) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!m) continue
    const level = m[1].length as 2 | 3
    const text = m[2].replace(/[*_`]/g, "").trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
    if (id) headings.push({ level, text, id })
  }
  return headings
}

export function TableOfContents({
  headings,
  className,
}: {
  headings: TocHeading[]
  className?: string
}) {
  if (headings.length === 0) return null
  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "hidden rounded-2xl border border-border bg-card p-5 lg:block",
        className,
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            className={cn(h.level === 3 && "pl-3 text-[13px]")}
          >
            <a
              href={`#${h.id}`}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
