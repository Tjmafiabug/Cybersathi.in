import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { format } from "date-fns"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"
import { StatusBadge } from "../../_components/status-badge"
import { NewsRowActions } from "../row-actions"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export default async function AdminNewsPreviewPage({ params }: Props) {
  const { id } = await params

  const session = await getAdminSession()
  if (!session) return null

  const row = await db
    .select({
      id: schema.newsArticles.id,
      slug: schema.newsArticles.slug,
      title: schema.newsArticles.title,
      summary: schema.newsArticles.summary,
      sourceUrl: schema.newsArticles.sourceUrl,
      sourcePublishedAt: schema.newsArticles.sourcePublishedAt,
      imageUrl: schema.newsArticles.imageUrl,
      status: schema.newsArticles.status,
      aiRewritten: schema.newsArticles.aiRewritten,
      createdAt: schema.newsArticles.createdAt,
      sourceName: schema.newsSources.name,
      categoryName: schema.categories.name,
    })
    .from(schema.newsArticles)
    .leftJoin(schema.newsSources, eq(schema.newsSources.id, schema.newsArticles.sourceId))
    .leftJoin(schema.categories, eq(schema.categories.id, schema.newsArticles.categoryId))
    .where(eq(schema.newsArticles.id, id))
    .limit(1)
    .then((r) => r[0])

  if (!row) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/news"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to news
        </Link>
        <NewsRowActions id={row.id} status={row.status} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={row.status} />
          {row.aiRewritten ? (
            <span className="text-xs text-muted-foreground">AI-rewritten</span>
          ) : null}
          {row.categoryName ? (
            <span className="text-xs text-muted-foreground">· {row.categoryName}</span>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold leading-tight">{row.title}</h1>
        <p className="text-xs text-muted-foreground">
          /{row.slug} · fetched {format(row.createdAt, "MMM d, yyyy HH:mm")}
          {row.sourcePublishedAt
            ? ` · published ${format(row.sourcePublishedAt, "MMM d, yyyy")}`
            : null}
        </p>
      </div>

      {row.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.imageUrl}
          alt={row.title}
          className="aspect-[16/9] w-full rounded-xl border border-border object-cover"
        />
      ) : null}

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <p className="text-sm leading-relaxed">{row.summary}</p>
        <a
          href={row.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          <ExternalLink className="size-3.5" />
          {row.sourceName ?? new URL(row.sourceUrl).hostname}
        </a>
      </div>
    </div>
  )
}
