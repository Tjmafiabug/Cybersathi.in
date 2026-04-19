import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogGrid } from "@/components/content/blog-card"
import { ContentBreadcrumb } from "@/components/content/content-breadcrumb"
import { NewsList } from "@/components/content/news-card"
import { VideoGrid } from "@/components/content/video-card"
import {
  getTagBySlug,
  listAllTags,
  listBlogsByTag,
  listNewsByTag,
  listVideosByTag,
} from "@/lib/content/queries"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const tags = await listAllTags()
  return tags.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return { title: "Not found" }
  return {
    title: `${tag.name} — CyberSathi`,
    description: `Latest blogs, news, and videos tagged ${tag.name} on CyberSathi.`,
  }
}

export const revalidate = 600

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const [blogs, news, videos] = await Promise.all([
    listBlogsByTag(slug),
    listNewsByTag(slug),
    listVideosByTag(slug),
  ])

  const isEmpty = blogs.length + news.length + videos.length === 0

  return (
    <div className="container mx-auto px-4 py-8">
      <ContentBreadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Tags" },
          { label: tag.name },
        ]}
      />

      <header className="mb-10 mt-8 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Tag
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          #{tag.name}
        </h1>
      </header>

      {isEmpty ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing tagged {tag.name} yet.
        </p>
      ) : null}

      {blogs.length > 0 ? (
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Blogs</h2>
          <BlogGrid blogs={blogs} />
        </section>
      ) : null}

      {news.length > 0 ? (
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">News</h2>
          <NewsList news={news} />
        </section>
      ) : null}

      {videos.length > 0 ? (
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Videos</h2>
          <VideoGrid videos={videos} />
        </section>
      ) : null}
    </div>
  )
}
