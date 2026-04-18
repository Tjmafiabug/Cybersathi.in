import { desc, eq } from "drizzle-orm"
import { format, formatDistanceToNow } from "date-fns"
import { CheckCircle2, Clock3, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"
import { cn } from "@/lib/utils"

import { EmptyState } from "../_components/empty-state"
import { PageHeader } from "../_components/page-header"

export const dynamic = "force-dynamic"

export const metadata = { title: "Jobs — Admin · CyberSathi" }

type JobTypeFilter =
  | "all"
  | "generate_blogs"
  | "scrape_news"
  | "fetch_videos"
  | "revalidate"

const JOB_TYPES: Array<{ value: JobTypeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "generate_blogs", label: "Blogs" },
  { value: "scrape_news", label: "News" },
  { value: "fetch_videos", label: "Videos" },
  { value: "revalidate", label: "Revalidate" },
]

function parseType(v: string | undefined): JobTypeFilter {
  if (
    v === "generate_blogs" ||
    v === "scrape_news" ||
    v === "fetch_videos" ||
    v === "revalidate"
  ) {
    return v
  }
  return "all"
}

function durationMs(start: Date, end: Date | null): string {
  if (!end) return "running"
  const ms = end.getTime() - start.getTime()
  if (ms < 1000) return `${ms}ms`
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const session = await getAdminSession()
  if (!session) return null

  const { type: rawType } = await searchParams
  const current = parseType(rawType)

  const rows = await db
    .select()
    .from(schema.jobRuns)
    .where(
      current === "all" ? undefined : eq(schema.jobRuns.jobType, current),
    )
    .orderBy(desc(schema.jobRuns.startedAt))
    .limit(100)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Jobs"
        description="History of automation runs. Latest 100 shown."
      />

      <nav className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1 self-start">
        {JOB_TYPES.map((t) => {
          const active = current === t.value
          const href =
            t.value === "all" ? "/admin/jobs" : `/admin/jobs?type=${t.value}`
          return (
            <a
              key={t.value}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </a>
          )
        })}
      </nav>

      {rows.length === 0 ? (
        <EmptyState
          title="No job runs recorded"
          description="Cron jobs will log their runs here once pipelines are wired."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Job</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px]">Items</TableHead>
                <TableHead className="w-[120px]">Duration</TableHead>
                <TableHead className="w-[200px]">Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const Icon =
                  r.status === "succeeded"
                    ? CheckCircle2
                    : r.status === "failed"
                      ? XCircle
                      : Clock3
                const iconClass =
                  r.status === "succeeded"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : r.status === "failed"
                      ? "text-destructive"
                      : "text-muted-foreground"
                const errCount = r.errorsJson?.length ?? 0
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Icon className={cn("h-4 w-4", iconClass)} />
                    </TableCell>
                    <TableCell className="font-medium">{r.jobType}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent",
                          r.status === "succeeded" &&
                            "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
                          r.status === "failed" &&
                            "bg-destructive/10 text-destructive",
                          r.status === "running" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {r.status}
                        {errCount > 0 ? ` · ${errCount} err` : ""}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.itemsProcessed}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {durationMs(r.startedAt, r.finishedAt)}
                    </TableCell>
                    <TableCell
                      className="text-sm text-muted-foreground"
                      title={format(r.startedAt, "PPpp")}
                    >
                      {formatDistanceToNow(r.startedAt, { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
