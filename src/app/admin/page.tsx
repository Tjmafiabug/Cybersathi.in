import { desc, sql } from "drizzle-orm"
import { formatDistanceToNow } from "date-fns"
import {
  CheckCircle2,
  Clock3,
  FileText,
  Newspaper,
  PlayCircle,
  XCircle,
} from "lucide-react"

import { db, schema } from "@/lib/db"
import { requireAdmin } from "@/lib/auth/dal"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

type QueueCount = { total: number; pending: number; published: number }

async function countByStatus(
  table: typeof schema.blogs | typeof schema.newsArticles | typeof schema.videos,
): Promise<QueueCount> {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      pending: sql<number>`count(*) filter (where ${table.status} = 'pending_review')::int`,
      published: sql<number>`count(*) filter (where ${table.status} = 'published')::int`,
    })
    .from(table)
  return row ?? { total: 0, pending: 0, published: 0 }
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin()

  const [blogs, news, videos, recentJobs] = await Promise.all([
    countByStatus(schema.blogs),
    countByStatus(schema.newsArticles),
    countByStatus(schema.videos),
    db
      .select()
      .from(schema.jobRuns)
      .orderBy(desc(schema.jobRuns.startedAt))
      .limit(8),
  ])

  const firstName =
    session.displayName?.split(" ")[0] ?? session.email.split("@")[0]

  const cards: Array<{
    label: string
    icon: React.ComponentType<{ className?: string }>
    counts: QueueCount
  }> = [
    { label: "Blogs", icon: FileText, counts: blogs },
    { label: "News", icon: Newspaper, counts: news },
    { label: "Videos", icon: PlayCircle, counts: videos },
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Welcome back, {firstName}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, icon: Icon, counts }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {counts.total.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">
                  {counts.pending}
                </span>{" "}
                pending
              </span>
              <span>
                <span className="font-medium text-foreground">
                  {counts.published}
                </span>{" "}
                live
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">
            Recent job runs
          </h2>
          <span className="text-xs text-muted-foreground">
            Latest 8 automation runs
          </span>
        </header>
        {recentJobs.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No jobs have run yet. Cron pipelines will appear here once
            wired up.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentJobs.map((job) => {
              const StatusIcon =
                job.status === "succeeded"
                  ? CheckCircle2
                  : job.status === "failed"
                    ? XCircle
                    : Clock3
              const statusColor =
                job.status === "succeeded"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : job.status === "failed"
                    ? "text-destructive"
                    : "text-muted-foreground"
              return (
                <li
                  key={job.id}
                  className="flex items-center gap-3 px-5 py-3 text-sm"
                >
                  <StatusIcon
                    className={cn("h-4 w-4 shrink-0", statusColor)}
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="font-medium">{job.jobType}</span>
                    <span className="text-xs text-muted-foreground">
                      · {job.itemsProcessed} items
                    </span>
                  </div>
                  <time
                    dateTime={job.startedAt.toISOString()}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDistanceToNow(job.startedAt, { addSuffix: true })}
                  </time>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
