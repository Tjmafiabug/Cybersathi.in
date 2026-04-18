import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { ContentBreadcrumb } from "@/components/content/content-breadcrumb"
import { MarkdownBody } from "@/components/content/markdown-body"
import { ReadNext } from "@/components/content/read-next"
import { ShareRow } from "@/components/content/share-row"
import {
  TableOfContents,
  extractTocHeadings,
} from "@/components/content/toc"
import { getBlogBySlug, getRelatedBlogs } from "@/lib/content/queries"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) return { title: "Not found" }
  return {
    title: `${blog.title} — CyberSathi`,
    description: blog.metaDescription ?? undefined,
    openGraph: {
      title: blog.title,
      description: blog.metaDescription ?? undefined,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [blog.author],
      images: blog.coverImageUrl ? [blog.coverImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.metaDescription ?? undefined,
      images: blog.coverImageUrl ? [blog.coverImageUrl] : undefined,
    },
  }
}

export const revalidate = 600

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()

  const [related, headings] = await Promise.all([
    getRelatedBlogs({
      excludeId: blog.id,
      categoryId: blog.categoryId,
      limit: 3,
    }),
    Promise.resolve(extractTocHeadings(blog.bodyMd)),
  ])

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cybersathi.in"
  const shareUrl = `${siteUrl}/blog/${blog.slug}`

  return (
    <div className="container mx-auto px-4 py-8">
      <ContentBreadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          ...(blog.categoryName && blog.categorySlug
            ? [
                {
                  label: blog.categoryName,
                  href: `/category/${blog.categorySlug}`,
                },
              ]
            : []),
          { label: blog.title },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0">
          <header className="mb-6 space-y-4">
            {blog.categoryName && blog.categorySlug ? (
              <Link
                href={`/category/${blog.categorySlug}`}
                className="inline-block"
              >
                <Badge variant="secondary">{blog.categoryName}</Badge>
              </Link>
            ) : null}
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {blog.title}
            </h1>
            {blog.metaDescription ? (
              <p className="text-lg text-muted-foreground">
                {blog.metaDescription}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {blog.author}
                </span>
                {blog.publishedAt ? (
                  <>
                    <span className="size-1 rounded-full bg-muted-foreground" />
                    <time dateTime={blog.publishedAt.toISOString()}>
                      {format(blog.publishedAt, "MMM d, yyyy")}
                    </time>
                  </>
                ) : null}
                {blog.aiGenerated ? (
                  <>
                    <span className="size-1 rounded-full bg-muted-foreground" />
                    <span className="text-xs">
                      AI-assisted · editorially reviewed
                    </span>
                  </>
                ) : null}
              </div>
              <ShareRow url={shareUrl} title={blog.title} />
            </div>
          </header>

          {blog.coverImageUrl ? (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={blog.coverImageUrl}
                alt={blog.title}
                fill
                sizes="(min-width: 1024px) 800px, 90vw"
                priority
                className="object-cover"
              />
            </div>
          ) : null}

          <MarkdownBody source={blog.bodyMd} />

          <ReadNext items={related} basePath="/blog" />
        </article>

        <aside className="order-first lg:order-last">
          <div className="sticky top-20">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  )
}
