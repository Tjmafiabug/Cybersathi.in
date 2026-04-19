import type { Metadata } from "next"

import { BlogGrid } from "@/components/content/blog-card"
import { CategoryChipBar } from "@/components/content/category-chip-bar"
import { SitePagination } from "@/components/content/site-pagination"
import {
  listCategoriesWithCounts,
  listPublishedBlogs,
} from "@/lib/content/queries"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cybersathi.in"

export const metadata: Metadata = {
  title: "Blog — CyberSathi",
  description:
    "Long-form guides on cyber-crime, scams, and how to defend against them. Updated often.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog — CyberSathi",
    description:
      "Long-form guides on cyber-crime, scams, and how to defend against them. Updated often.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "CyberSathi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — CyberSathi",
    description:
      "Long-form guides on cyber-crime, scams, and how to defend against them. Updated often.",
  },
}

export const revalidate = 600

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageRaw, category } = await searchParams
  const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1)

  const [{ rows, totalPages }, categories] = await Promise.all([
    listPublishedBlogs({ page, categorySlug: category }),
    listCategoriesWithCounts(),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Long-form guides on cyber-crime patterns in India — phishing, UPI
          fraud, ransomware, identity theft, and the scams you haven&apos;t
          heard of yet.
        </p>
      </header>

      <div className="mb-6">
        <CategoryChipBar
          categories={categories
            .filter((c) => c.count > 0)
            .map((c) => ({ slug: c.slug, name: c.name }))}
          activeSlug={category ?? null}
          basePath="/blog"
        />
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No posts in this category yet. Check back soon.
        </p>
      ) : (
        <BlogGrid blogs={rows} />
      )}

      <SitePagination
        basePath="/blog"
        page={page}
        totalPages={totalPages}
        extraParams={{ category }}
      />
    </div>
  )
}
