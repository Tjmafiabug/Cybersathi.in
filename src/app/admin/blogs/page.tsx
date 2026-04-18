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
import { BlogRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

export const metadata = { title: "Blogs — Admin · CyberSathi" }

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await getAdminSession()
  if (!session) return null

  const { status: rawStatus } = await searchParams
  const current = parseStatusParam(rawStatus)

  const [counts, rows] = await Promise.all([
    db
      .select({
        status: schema.blogs.status,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.blogs)
      .groupBy(schema.blogs.status),
    db
      .select({
        id: schema.blogs.id,
        title: schema.blogs.title,
        slug: schema.blogs.slug,
        status: schema.blogs.status,
        author: schema.blogs.author,
        aiGenerated: schema.blogs.aiGenerated,
        createdAt: schema.blogs.createdAt,
        publishedAt: schema.blogs.publishedAt,
      })
      .from(schema.blogs)
      .where(current === "all" ? undefined : eq(schema.blogs.status, current))
      .orderBy(desc(schema.blogs.createdAt))
      .limit(50),
  ])

  const countMap: Partial<Record<StatusFilterValue, number>> = {
    all: counts.reduce((sum, r) => sum + r.count, 0),
  }
  for (const r of counts) countMap[r.status] = r.count

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Blogs"
        description="Review and publish generated blog drafts. Latest 50 shown."
      />

      <StatusFilter basePath="/admin/blogs" current={current} counts={countMap} />

      {rows.length === 0 ? (
        <EmptyState
          title="No blogs here yet"
          description="Once the generator runs, drafts will show up in the Pending tab."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[160px]">Author</TableHead>
                <TableHead className="w-[160px]">Created</TableHead>
                <TableHead className="w-[260px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[420px] truncate">
                    <span className="font-medium">{r.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      /{r.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.author}
                    {r.aiGenerated ? (
                      <span className="ml-1 text-[0.7rem]">· AI</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(r.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <BlogRowActions id={r.id} status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
