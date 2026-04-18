import type { Metadata } from "next"

import { CategoryChipBar } from "@/components/content/category-chip-bar"
import { NewsList } from "@/components/content/news-card"
import { SitePagination } from "@/components/content/site-pagination"
import {
  listCategoriesWithCounts,
  listPublishedNews,
} from "@/lib/content/queries"

export const metadata: Metadata = {
  title: "News — CyberSathi",
  description:
    "The latest cyber-crime headlines from India and the world, rewritten into short summaries with links back to the original source.",
}

export const revalidate = 300

export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageRaw, category } = await searchParams
  const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1)

  const [{ rows, totalPages }, categories] = await Promise.all([
    listPublishedNews({ page, categorySlug: category }),
    listCategoriesWithCounts(),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          News
        </h1>
        <p className="mt-2 text-muted-foreground">
          Short summaries of the cyber-crime stories moving in India and
          globally. We link back to the original source — always.
        </p>
      </header>

      <div className="mb-6">
        <CategoryChipBar
          categories={categories
            .filter((c) => c.count > 0)
            .map((c) => ({ slug: c.slug, name: c.name }))}
          activeSlug={category ?? null}
          basePath="/news"
        />
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No news in this category yet. Check back soon.
        </p>
      ) : (
        <NewsList news={rows} />
      )}

      <SitePagination
        basePath="/news"
        page={page}
        totalPages={totalPages}
        extraParams={{ category }}
      />
    </div>
  )
}
