import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ContentStatus = "pending_review" | "published" | "rejected" | "archived"

const STATUS_META: Record<ContentStatus, { label: string; className: string }> = {
  pending_review: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  },
  published: {
    label: "Published",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-destructive/10 text-destructive",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground",
  },
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  const meta = STATUS_META[status]
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className)}>
      {meta.label}
    </Badge>
  )
}
