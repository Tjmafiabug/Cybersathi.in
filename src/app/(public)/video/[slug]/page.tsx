import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { ContentBreadcrumb } from "@/components/content/content-breadcrumb"
import { ShareRow } from "@/components/content/share-row"
import { getVideoBySlug } from "@/lib/content/queries"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) return { title: "Not found" }
  return {
    title: `${video.title} — CyberSathi`,
    description: video.summary ?? video.description ?? undefined,
    openGraph: {
      title: video.title,
      description: video.summary ?? undefined,
      type: "video.other",
      images: video.thumbnailUrl ? [video.thumbnailUrl] : undefined,
    },
  }
}

function formatTimestamp(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  return `${m}:${s.toString().padStart(2, "0")}`
}

export const revalidate = 600

export default async function VideoDetailPage({ params }: Props) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) notFound()

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cybersathi.in"
  const shareUrl = `${siteUrl}/video/${video.slug}`

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <ContentBreadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Videos", href: "/videos" },
          ...(video.categoryName && video.categorySlug
            ? [
                {
                  label: video.categoryName,
                  href: `/category/${video.categorySlug}`,
                },
              ]
            : []),
          { label: video.title },
        ]}
      />

      <article className="mt-8">
        <header className="mb-6 space-y-3">
          {video.categoryName && video.categorySlug ? (
            <Link
              href={`/category/${video.categorySlug}`}
              className="inline-block"
            >
              <Badge variant="secondary">{video.categoryName}</Badge>
            </Link>
          ) : null}
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {video.channelName ? (
                <span className="font-medium text-foreground">
                  {video.channelName}
                </span>
              ) : null}
              {video.publishedAt ? (
                <>
                  <span className="size-1 rounded-full bg-muted-foreground" />
                  <time dateTime={video.publishedAt.toISOString()}>
                    {format(video.publishedAt, "MMM d, yyyy")}
                  </time>
                </>
              ) : null}
            </div>
            <ShareRow url={shareUrl} title={video.title} />
          </div>
        </header>

        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl border border-border bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        </div>

        {video.summary ? (
          <section className="mb-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Summary
            </h2>
            <p className="text-base leading-relaxed text-foreground/90">
              {video.summary}
            </p>
          </section>
        ) : null}

        {video.timestamps && video.timestamps.length > 0 ? (
          <section className="mb-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Chapters
            </h2>
            <ul className="flex flex-col gap-2">
              {video.timestamps.map((t) => (
                <li key={t.t}>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}&t=${t.t}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {formatTimestamp(t.t)}
                    </span>
                    <span className="text-foreground/90">{t.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {video.transcript ? (
          <details className="rounded-2xl border border-border bg-card p-6">
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Transcript
            </summary>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
              {video.transcript}
            </div>
          </details>
        ) : null}
      </article>
    </div>
  )
}
