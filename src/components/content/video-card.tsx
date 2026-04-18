import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type VideoCardData = {
  slug: string
  youtubeId: string
  title: string
  summary: string | null
  channelName: string | null
  thumbnailUrl: string | null
  durationSeconds: number | null
  publishedAt: Date | null
  categorySlug: string | null
  categoryName: string | null
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VideoCard({
  video,
  className,
}: {
  video: VideoCardData
  className?: string
}) {
  const duration = formatDuration(video.durationSeconds)
  const thumb =
    video.thumbnailUrl ?? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`

  return (
    <article
      className={cn(
        "group flex flex-col gap-3 rounded-2xl p-2 transition-colors hover:bg-muted/60",
        className,
      )}
    >
      <Link
        href={`/video/${video.slug}`}
        className="relative block aspect-video overflow-hidden rounded-xl border border-border bg-muted"
      >
        <Image
          src={thumb}
          alt={video.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-transform duration-200 group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-[1px] fill-current" />
          </div>
        </div>
        {duration ? (
          <div className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </div>
        ) : null}
        {video.categoryName ? (
          <div className="absolute left-3 top-3">
            <Badge
              variant="default"
              className="bg-background/80 text-foreground backdrop-blur"
            >
              {video.categoryName}
            </Badge>
          </div>
        ) : null}
      </Link>

      <div className="space-y-1.5 px-1 pb-2">
        <Link href={`/video/${video.slug}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {video.title}
          </h3>
        </Link>
        {video.channelName ? (
          <p className="text-xs text-muted-foreground">{video.channelName}</p>
        ) : null}
        {video.summary ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {video.summary}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function VideoGrid({ videos }: { videos: VideoCardData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <VideoCard key={v.slug} video={v} />
      ))}
    </div>
  )
}
