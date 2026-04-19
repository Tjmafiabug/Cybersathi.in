import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ContentBreadcrumb } from "@/components/content/content-breadcrumb"
import { ShareRow } from "@/components/content/share-row"
import { JsonLd } from "@/components/seo/json-ld"
import { getNewsBySlug, listAllPublishedSlugs } from "@/lib/content/queries"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsBySlug(slug)
  if (!news) return { title: "Not found" }
  return {
    title: `${news.title} — CyberSathi`,
    description: news.summary,
    openGraph: {
      title: news.title,
      description: news.summary,
      type: "article",
      images: news.imageUrl ? [news.imageUrl] : undefined,
    },
  }
}

export async function generateStaticParams() {
  const { news } = await listAllPublishedSlugs()
  return news.map((n) => ({ slug: n.slug }))
}

export const revalidate = 300

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)
  if (!news) notFound()

  const when = news.sourcePublishedAt ?? news.createdAt
  const sourceHost = news.sourceName ?? new URL(news.sourceUrl).hostname
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cybersathi.in"
  const shareUrl = `${siteUrl}/news/${news.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.summary ?? undefined,
    image: news.imageUrl ?? undefined,
    datePublished: when.toISOString(),
    url: shareUrl,
    publisher: {
      "@type": "Organization",
      name: "CyberSathi",
      url: siteUrl,
    },
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <ContentBreadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          ...(news.categoryName && news.categorySlug
            ? [
                {
                  label: news.categoryName,
                  href: `/category/${news.categorySlug}`,
                },
              ]
            : []),
          { label: news.title },
        ]}
      />

      <article className="mt-8">
        <header className="space-y-4">
          {news.categoryName && news.categorySlug ? (
            <Link
              href={`/category/${news.categorySlug}`}
              className="inline-block"
            >
              <Badge variant="secondary">{news.categoryName}</Badge>
            </Link>
          ) : null}
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {news.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                via <span className="font-medium text-foreground">{sourceHost}</span>
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <time dateTime={when.toISOString()}>
                {format(when, "MMM d, yyyy · h:mm a")}
              </time>
            </div>
            <ShareRow url={shareUrl} title={news.title} />
          </div>
        </header>

        {news.imageUrl ? (
          <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              sizes="(min-width: 1024px) 768px, 90vw"
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        <p className="text-lg leading-relaxed text-foreground/90">
          {news.summary}
        </p>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Read the full story</p>
            <p className="text-xs text-muted-foreground">
              Original reporting by {sourceHost}. We only summarise — never
              republish.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={
              <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            Open source <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </article>
    </div>
  )
}
