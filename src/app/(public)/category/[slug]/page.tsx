import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogGrid } from "@/components/content/blog-card"
import { ContentBreadcrumb } from "@/components/content/content-breadcrumb"
import { NewsList } from "@/components/content/news-card"
import { VideoGrid } from "@/components/content/video-card"
import {
  getCategoryBySlug,
  listPublishedBlogs,
  listPublishedNews,
  listPublishedVideos,
} from "@/lib/content/queries"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Not found" }
  return {
    title: `${category.name} — CyberSathi`,
    description: category.description ?? undefined,
  }
}

export const revalidate = 600

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [{ rows: blogs }, { rows: news }, { rows: videos }] = await Promise.all([
    listPublishedBlogs({ page: 1, categorySlug: slug }),
    listPublishedNews({ page: 1, categorySlug: slug }),
    listPublishedVideos({ page: 1, categorySlug: slug }),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <ContentBreadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Topics", href: "/blog" },
          { label: category.name },
        ]}
      />

      <header className="mb-10 mt-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        ) : null}
      </header>

      {blogs.length + news.length + videos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing published in this category yet.
        </p>
      ) : null}

      {blogs.length > 0 ? (
        <section className="mb-14">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Blogs</h2>
            <a
              href={`/blog?category=${slug}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              All {category.name.toLowerCase()} blogs
            </a>
          </div>
          <BlogGrid blogs={blogs.slice(0, 6)} />
        </section>
      ) : null}

      {news.length > 0 ? (
        <section className="mb-14">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight">News</h2>
            <a
              href={`/news?category=${slug}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              All {category.name.toLowerCase()} news
            </a>
          </div>
          <NewsList news={news.slice(0, 4)} />
        </section>
      ) : null}

      {videos.length > 0 ? (
        <section className="mb-14">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Videos</h2>
            <a
              href={`/videos?category=${slug}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              All {category.name.toLowerCase()} videos
            </a>
          </div>
          <VideoGrid videos={videos.slice(0, 6)} />
        </section>
      ) : null}
    </div>
  )
}
