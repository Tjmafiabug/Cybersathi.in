import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type NewsCardData = {
  slug: string
  title: string
  summary: string
  imageUrl: string | null
  sourceUrl: string
  sourceName: string | null
  sourcePublishedAt: Date | null
  createdAt: Date
  categorySlug: string | null
  categoryName: string | null
}

export function NewsCard({
  news,
  className,
}: {
  news: NewsCardData
  className?: string
}) {
  const when = news.sourcePublishedAt ?? news.createdAt
  const sourceHost = news.sourceName ?? new URL(news.sourceUrl).hostname

  return (
    <article
      className={cn(
        "group flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md md:flex-row",
        className,
      )}
    >
      <Link
        href={`/news/${news.slug}`}
        className="relative aspect-[16/9] w-full shrink-0 bg-muted md:aspect-auto md:h-auto md:w-56"
      >
        {news.imageUrl ? (
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="(min-width: 768px) 14rem, 100vw"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {news.categoryName ? (
              <Badge variant="secondary">{news.categoryName}</Badge>
            ) : null}
            <time
              dateTime={when.toISOString()}
              className="text-xs text-muted-foreground"
            >
              {formatDistanceToNow(when, { addSuffix: true })}
            </time>
          </div>
          <Link href={`/news/${news.slug}`}>
            <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {news.title}
            </h2>
          </Link>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {news.summary}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="max-w-[60%] truncate text-xs text-muted-foreground">
            via {sourceHost}
          </span>
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
          >
            Read source
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  )
}

export function NewsList({ news }: { news: NewsCardData[] }) {
  return (
    <div className="flex flex-col gap-4">
      {news.map((n) => (
        <NewsCard key={n.slug} news={n} />
      ))}
    </div>
  )
}
