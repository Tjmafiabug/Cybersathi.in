import type { Metadata } from "next"

import { CategoryChipBar } from "@/components/content/category-chip-bar"
import { SitePagination } from "@/components/content/site-pagination"
import { VideoGrid } from "@/components/content/video-card"
import {
  listCategoriesWithCounts,
  listPublishedVideos,
} from "@/lib/content/queries"

export const metadata: Metadata = {
  title: "Videos — CyberSathi",
  description:
    "Curated YouTube videos on cyber-crime, with AI-generated summaries and timestamps so you can skip to the part that matters.",
}

export const revalidate = 600

export default async function VideosIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageRaw, category } = await searchParams
  const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1)

  const [{ rows, totalPages }, categories] = await Promise.all([
    listPublishedVideos({ page, categorySlug: category }),
    listCategoriesWithCounts(),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Videos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Hand-picked YouTube videos on cyber-crime, each with an AI summary
          and chapter timestamps.
        </p>
      </header>

      <div className="mb-6">
        <CategoryChipBar
          categories={categories
            .filter((c) => c.count > 0)
            .map((c) => ({ slug: c.slug, name: c.name }))}
          activeSlug={category ?? null}
          basePath="/videos"
        />
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No videos in this category yet. Check back soon.
        </p>
      ) : (
        <VideoGrid videos={rows} />
      )}

      <SitePagination
        basePath="/videos"
        page={page}
        totalPages={totalPages}
        extraParams={{ category }}
      />
    </div>
  )
}
