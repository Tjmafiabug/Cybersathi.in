import { desc, eq, sql } from "drizzle-orm"
import { formatDistanceToNow } from "date-fns"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SitePagination } from "@/components/content/site-pagination"
import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"

import { EmptyState } from "../_components/empty-state"
import { PageHeader } from "../_components/page-header"
import { StatusBadge } from "../_components/status-badge"
import {
  StatusFilter,
  parseStatusParam,
  type StatusFilterValue,
} from "../_components/status-filter"
import { VideoRowActions } from "./row-actions"

export const dynamic = "force-dynamic"
export const metadata = { title: "Videos — Admin · CyberSathi" }

const PAGE_SIZE = 25

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—"
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const session = await getAdminSession()
  if (!session) return null

  const { status: rawStatus, page: pageRaw } = await searchParams
  const current = parseStatusParam(rawStatus)
  const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1)

  const statusFilter = current === "all" ? undefined : eq(schema.videos.status, current)

  const [counts, rows, [{ total }]] = await Promise.all([
    db
      .select({ status: schema.videos.status, count: sql<number>`count(*)::int` })
      .from(schema.videos)
      .groupBy(schema.videos.status),
    db
      .select({
        id: schema.videos.id,
        title: schema.videos.title,
        slug: schema.videos.slug,
        youtubeId: schema.videos.youtubeId,
        channelName: schema.videos.channelName,
        durationSeconds: schema.videos.durationSeconds,
        status: schema.videos.status,
        createdAt: schema.videos.createdAt,
      })
      .from(schema.videos)
      .where(statusFilter)
      .orderBy(desc(schema.videos.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(schema.videos)
      .where(statusFilter),
  ])

  const countMap: Partial<Record<StatusFilterValue, number>> = {
    all: counts.reduce((sum, r) => sum + r.count, 0),
  }
  for (const r of counts) countMap[r.status] = r.count

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Videos"
        description="Curated YouTube videos with AI summaries."
      />

      <StatusFilter basePath="/admin/videos" current={current} counts={countMap} />

      {rows.length === 0 ? (
        <EmptyState
          title="No videos yet"
          description="The YouTube pipeline will populate this once wired up."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px]">Channel</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead className="w-[160px]">Added</TableHead>
                <TableHead className="w-[260px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[360px] truncate">
                    <a
                      href={`https://www.youtube.com/watch?v=${r.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {r.title}
                    </a>
                    <span className="ml-2 text-xs text-muted-foreground">
                      /{r.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                    {r.channelName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDuration(r.durationSeconds)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(r.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <VideoRowActions id={r.id} status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <SitePagination
        basePath="/admin/videos"
        page={page}
        totalPages={totalPages}
        extraParams={{ status: current === "all" ? undefined : current }}
      />
    </div>
  )
}
