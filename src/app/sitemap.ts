import type { MetadataRoute } from "next"
import { db, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cybersathi.in"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, news, videos, categories] = await Promise.all([
    db.select({ slug: schema.blogs.slug, updatedAt: schema.blogs.updatedAt })
      .from(schema.blogs).where(eq(schema.blogs.status, "published")),
    db.select({ slug: schema.newsArticles.slug, updatedAt: schema.newsArticles.createdAt })
      .from(schema.newsArticles).where(eq(schema.newsArticles.status, "published")),
    db.select({ slug: schema.videos.slug, updatedAt: schema.videos.createdAt })
      .from(schema.videos).where(eq(schema.videos.status, "published")),
    db.select({ slug: schema.categories.slug }).from(schema.categories),
  ])

  const statics: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/news`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/videos`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ]

  return [
    ...statics,
    ...categories.map((c) => ({
      url: `${BASE_URL}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogs.map((b) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...news.map((n) => ({
      url: `${BASE_URL}/news/${n.slug}`,
      lastModified: n.updatedAt ?? undefined,
      changeFrequency: "never" as const,
      priority: 0.6,
    })),
    ...videos.map((v) => ({
      url: `${BASE_URL}/video/${v.slug}`,
      lastModified: v.updatedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
