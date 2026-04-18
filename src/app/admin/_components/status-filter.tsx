import Link from "next/link"

import { cn } from "@/lib/utils"

const STATUSES = [
  { value: "all", label: "All" },
  { value: "pending_review", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
] as const

export type StatusFilterValue = (typeof STATUSES)[number]["value"]

export function StatusFilter({
  basePath,
  current,
  counts,
}: {
  basePath: string
  current: StatusFilterValue
  counts: Partial<Record<StatusFilterValue, number>>
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1">
      {STATUSES.map((s) => {
        const active = current === s.value
        const href = s.value === "all" ? basePath : `${basePath}?status=${s.value}`
        const count = counts[s.value]
        return (
          <Link
            key={s.value}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
            {typeof count === "number" ? (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[0.7rem] leading-tight",
                  active
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}

export function parseStatusParam(value: string | undefined): StatusFilterValue {
  if (
    value === "pending_review" ||
    value === "published" ||
    value === "rejected" ||
    value === "archived"
  ) {
    return value
  }
  return "all"
}
