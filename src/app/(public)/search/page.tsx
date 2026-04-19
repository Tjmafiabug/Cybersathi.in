import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { SearchIcon } from "lucide-react"

import { ContentBreadcrumb } from "@/components/content/content-breadcrumb"
import { Badge } from "@/components/ui/badge"
import { searchContent } from "@/lib/content/queries"

export const metadata: Metadata = {
  title: "Search — CyberSathi",
  description: "Search blogs, news and videos on cyber crime and online safety.",
}

type Props = { searchParams: Promise<{ q?: string }> }

const typeLabel: Record<string, string> = {
  blog: "Blog",
  news: "News",
  video: "Video",
}

const typeHref = (type: string, slug: string) => {
  if (type === "blog") return `/blog/${slug}`
  if (type === "news") return `/news/${slug}`
  return `/video/${slug}`
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const results = query.length >= 2 ? await searchContent(query) : []

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <ContentBreadcrumb
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Search</h1>

      <form method="get" action="/search" className="mt-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search blogs, news, videos…"
            autoFocus
            className="w-full bg-transparent py-1 text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </form>

      {query.length >= 2 && (
        <p className="mt-4 text-sm text-muted-foreground">
          {results.length === 0
            ? `No results for "${query}"`
            : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-6 flex flex-col divide-y divide-border">
          {results.map((item) => (
            <li key={`${item.type}-${item.slug}`}>
              <Link
                href={typeHref(item.type, item.slug)}
                className="flex items-start gap-4 py-4 transition-colors hover:bg-muted/40 rounded-xl px-2"
              >
                {item.imageUrl ? (
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-24 shrink-0 rounded-lg border border-border bg-muted" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {typeLabel[item.type]}
                    </Badge>
                    {item.publishedAt && (
                      <span className="text-xs text-muted-foreground">
                        {format(item.publishedAt, "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                  <p className="font-medium leading-snug text-foreground line-clamp-2">
                    {item.title}
                  </p>
                  {item.excerpt && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
