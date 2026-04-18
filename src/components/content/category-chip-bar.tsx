import Link from "next/link"

import { cn } from "@/lib/utils"

export type CategoryChip = { slug: string; name: string }

export function CategoryChipBar({
  categories,
  activeSlug,
  basePath,
  className,
}: {
  categories: CategoryChip[]
  activeSlug?: string | null
  /** "/blog" means the "All" link goes to "/blog" and a chip to "/blog?category=phishing" */
  basePath: string
  className?: string
}) {
  return (
    <nav
      aria-label="Category filter"
      className={cn(
        "-mx-1 flex items-center gap-1 overflow-x-auto px-1 py-1",
        className,
      )}
    >
      <Link
        href={basePath}
        className={cn(
          "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors",
          !activeSlug
            ? "border-foreground/80 bg-foreground text-background"
            : "border-border bg-background text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </Link>
      {categories.map((c) => {
        const active = activeSlug === c.slug
        return (
          <Link
            key={c.slug}
            href={`${basePath}?category=${c.slug}`}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              active
                ? "border-foreground/80 bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {c.name}
          </Link>
        )
      })}
    </nav>
  )
}
