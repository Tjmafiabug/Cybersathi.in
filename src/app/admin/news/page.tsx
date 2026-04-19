import Link from "next/link"
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
import { NewsRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

export const metadata = { title: "News — Admin · CyberSathi" }

export default async function AdminNewsPage({
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
        status: schema.newsArticles.status,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.newsArticles)
      .groupBy(schema.newsArticles.status),
    db
      .select({
        id: schema.newsArticles.id,
        title: schema.newsArticles.title,
        slug: schema.newsArticles.slug,
        status: schema.newsArticles.status,
        sourceUrl: schema.newsArticles.sourceUrl,
        sourceName: schema.newsSources.name,
        createdAt: schema.newsArticles.createdAt,
        sourcePublishedAt: schema.newsArticles.sourcePublishedAt,
      })
      .from(schema.newsArticles)
      .leftJoin(
        schema.newsSources,
        eq(schema.newsSources.id, schema.newsArticles.sourceId),
      )
      .where(
        current === "all"
          ? undefined
          : eq(schema.newsArticles.status, current),
      )
      .orderBy(desc(schema.newsArticles.createdAt))
      .limit(50),
  ])

  const countMap: Partial<Record<StatusFilterValue, number>> = {
    all: counts.reduce((sum, r) => sum + r.count, 0),
  }
  for (const r of counts) countMap[r.status] = r.count

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="News"
        description="Rewritten items pulled from RSS + NewsAPI. Latest 50 shown."
      />

      <StatusFilter basePath="/admin/news" current={current} counts={countMap} />

      {rows.length === 0 ? (
        <EmptyState
          title="No news yet"
          description="The scraper will populate this tab on its next run."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px]">Source</TableHead>
                <TableHead className="w-[160px]">Fetched</TableHead>
                <TableHead className="w-[260px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[420px] truncate">
                    <Link
                      href={`/admin/news/${r.id}`}
                      className="font-medium hover:underline underline-offset-4"
                    >
                      {r.title}
                    </Link>
                    <span className="ml-2 text-xs text-muted-foreground">
                      /{r.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {r.sourceName ?? new URL(r.sourceUrl).hostname}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(r.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <NewsRowActions id={r.id} status={r.status} />
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
