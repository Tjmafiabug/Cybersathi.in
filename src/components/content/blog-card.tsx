import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type BlogCardData = {
  slug: string
  title: string
  metaDescription: string | null
  coverImageUrl: string | null
  author: string
  publishedAt: Date | null
  categorySlug: string | null
  categoryName: string | null
}

export function BlogCard({
  blog,
  className,
}: {
  blog: BlogCardData
  className?: string
}) {
  return (
    <article
      className={cn(
        "group flex flex-col gap-3 rounded-2xl p-2 transition-colors hover:bg-muted/60",
        className,
      )}
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="relative block aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted"
      >
        {blog.coverImageUrl ? (
          <Image
            src={blog.coverImageUrl}
            alt={blog.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {blog.categoryName && blog.categorySlug ? (
          <div className="absolute left-3 top-3">
            <Badge
              variant="default"
              className="bg-background/80 text-foreground backdrop-blur"
            >
              {blog.categoryName}
            </Badge>
          </div>
        ) : null}
      </Link>

      <div className="space-y-2 px-1 pb-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
          <span>{blog.author}</span>
          {blog.publishedAt ? (
            <>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <time dateTime={blog.publishedAt.toISOString()}>
                {format(blog.publishedAt, "MMM d, yyyy")}
              </time>
            </>
          ) : null}
        </div>
        <Link href={`/blog/${blog.slug}`} className="block">
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {blog.title}
          </h2>
        </Link>
        {blog.metaDescription ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {blog.metaDescription}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function BlogGrid({ blogs }: { blogs: BlogCardData[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((b) => (
        <BlogCard key={b.slug} blog={b} />
      ))}
    </div>
  )
}
