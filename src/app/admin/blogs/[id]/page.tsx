import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"

import { db, schema } from "@/lib/db"
import { getAdminSession } from "@/lib/auth/dal"
import { MarkdownBody } from "@/components/content/markdown-body"
import { StatusBadge } from "../../_components/status-badge"
import { BlogRowActions } from "../row-actions"

type Props = { params: Promise<{ id: string }> }

export const dynamic = "force-dynamic"

export default async function AdminBlogPreviewPage({ params }: Props) {
  const { id } = await params

  const session = await getAdminSession()
  if (!session) return null

  const blog = await db.query.blogs.findFirst({
    where: eq(schema.blogs.id, id),
  })
  if (!blog) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blogs"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to blogs
        </Link>
        <BlogRowActions id={blog.id} status={blog.status} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={blog.status} />
          {blog.aiGenerated ? (
            <span className="text-xs text-muted-foreground">AI-generated · {blog.aiModel}</span>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold leading-tight">{blog.title}</h1>
        {blog.metaDescription ? (
          <p className="text-muted-foreground">{blog.metaDescription}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          /{blog.slug} · created {format(blog.createdAt, "MMM d, yyyy HH:mm")}
        </p>
      </div>

      {blog.coverImageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={blog.coverImageUrl}
            alt={blog.title}
            fill
            sizes="720px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-card p-6">
        <MarkdownBody source={blog.bodyMd} />
      </div>
    </div>
  )
}
