import "server-only"

import { and, desc, eq, ne, notInArray, sql } from "drizzle-orm"

import { db, schema } from "@/lib/db"

const PER_PAGE = 12

export async function listPublishedBlogs({
  page = 1,
  categorySlug,
}: {
  page?: number
  categorySlug?: string
} = {}) {
  const offset = (page - 1) * PER_PAGE
  const where = categorySlug
    ? and(
        eq(schema.blogs.status, "published"),
        eq(schema.categories.slug, categorySlug),
      )
    : eq(schema.blogs.status, "published")

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: schema.blogs.id,
        slug: schema.blogs.slug,
        title: schema.blogs.title,
        metaDescription: schema.blogs.metaDescription,
        coverImageUrl: schema.blogs.coverImageUrl,
        author: schema.blogs.author,
        publishedAt: schema.blogs.publishedAt,
        categorySlug: schema.categories.slug,
        categoryName: schema.categories.name,
      })
      .from(schema.blogs)
      .leftJoin(
        schema.categories,
        eq(schema.categories.id, schema.blogs.categoryId),
      )
      .where(where)
      .orderBy(desc(schema.blogs.publishedAt))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.blogs)
      .leftJoin(
        schema.categories,
        eq(schema.categories.id, schema.blogs.categoryId),
      )
      .where(where),
  ])

  return {
    rows,
    total: totalRow[0]?.count ?? 0,
    page,
    perPage: PER_PAGE,
    totalPages: Math.max(1, Math.ceil((totalRow[0]?.count ?? 0) / PER_PAGE)),
  }
}

export async function getBlogBySlug(slug: string) {
  const [row] = await db
    .select({
      id: schema.blogs.id,
      slug: schema.blogs.slug,
      title: schema.blogs.title,
      metaDescription: schema.blogs.metaDescription,
      bodyMd: schema.blogs.bodyMd,
      coverImageUrl: schema.blogs.coverImageUrl,
      author: schema.blogs.author,
      publishedAt: schema.blogs.publishedAt,
      aiGenerated: schema.blogs.aiGenerated,
      categoryId: schema.blogs.categoryId,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
    })
    .from(schema.blogs)
    .leftJoin(
      schema.categories,
      eq(schema.categories.id, schema.blogs.categoryId),
    )
    .where(
      and(eq(schema.blogs.slug, slug), eq(schema.blogs.status, "published")),
    )
    .limit(1)

  return row ?? null
}

export async function getRelatedBlogs(params: {
  excludeId: string
  categoryId: string | null
  limit?: number
}) {
  const { excludeId, categoryId, limit = 3 } = params
  const rows = await db
    .select({
      id: schema.blogs.id,
      slug: schema.blogs.slug,
      title: schema.blogs.title,
      coverImageUrl: schema.blogs.coverImageUrl,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
      publishedAt: schema.blogs.publishedAt,
    })
    .from(schema.blogs)
    .leftJoin(
      schema.categories,
      eq(schema.categories.id, schema.blogs.categoryId),
    )
    .where(
      and(
        eq(schema.blogs.status, "published"),
        ne(schema.blogs.id, excludeId),
        categoryId ? eq(schema.blogs.categoryId, categoryId) : undefined,
      ),
    )
    .orderBy(desc(schema.blogs.publishedAt))
    .limit(limit)

  if (rows.length >= limit) return rows

  // Pad with newest posts from any category.
  const fillIds = [excludeId, ...rows.map((r) => r.id)]
  const extra = await db
    .select({
      id: schema.blogs.id,
      slug: schema.blogs.slug,
      title: schema.blogs.title,
      coverImageUrl: schema.blogs.coverImageUrl,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
      publishedAt: schema.blogs.publishedAt,
    })
    .from(schema.blogs)
    .leftJoin(
      schema.categories,
      eq(schema.categories.id, schema.blogs.categoryId),
    )
    .where(
      and(
        eq(schema.blogs.status, "published"),
        notInArray(schema.blogs.id, fillIds),
      ),
    )
    .orderBy(desc(schema.blogs.publishedAt))
    .limit(limit - rows.length)

  return [...rows, ...extra]
}

export async function listPublishedNews({
  page = 1,
  categorySlug,
}: {
  page?: number
  categorySlug?: string
} = {}) {
  const offset = (page - 1) * PER_PAGE
  const where = categorySlug
    ? and(
        eq(schema.newsArticles.status, "published"),
        eq(schema.categories.slug, categorySlug),
      )
    : eq(schema.newsArticles.status, "published")

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: schema.newsArticles.id,
        slug: schema.newsArticles.slug,
        title: schema.newsArticles.title,
        summary: schema.newsArticles.summary,
        imageUrl: schema.newsArticles.imageUrl,
        sourceUrl: schema.newsArticles.sourceUrl,
        sourceName: schema.newsSources.name,
        sourcePublishedAt: schema.newsArticles.sourcePublishedAt,
        createdAt: schema.newsArticles.createdAt,
        categorySlug: schema.categories.slug,
        categoryName: schema.categories.name,
      })
      .from(schema.newsArticles)
      .leftJoin(
        schema.categories,
        eq(schema.categories.id, schema.newsArticles.categoryId),
      )
      .leftJoin(
        schema.newsSources,
        eq(schema.newsSources.id, schema.newsArticles.sourceId),
      )
      .where(where)
      .orderBy(
        desc(
          sql`coalesce(${schema.newsArticles.sourcePublishedAt}, ${schema.newsArticles.createdAt})`,
        ),
      )
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.newsArticles)
      .leftJoin(
        schema.categories,
        eq(schema.categories.id, schema.newsArticles.categoryId),
      )
      .where(where),
  ])

  return {
    rows,
    total: totalRow[0]?.count ?? 0,
    page,
    perPage: PER_PAGE,
    totalPages: Math.max(1, Math.ceil((totalRow[0]?.count ?? 0) / PER_PAGE)),
  }
}

export async function getNewsBySlug(slug: string) {
  const [row] = await db
    .select({
      id: schema.newsArticles.id,
      slug: schema.newsArticles.slug,
      title: schema.newsArticles.title,
      summary: schema.newsArticles.summary,
      imageUrl: schema.newsArticles.imageUrl,
      sourceUrl: schema.newsArticles.sourceUrl,
      sourceName: schema.newsSources.name,
      sourcePublishedAt: schema.newsArticles.sourcePublishedAt,
      createdAt: schema.newsArticles.createdAt,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
    })
    .from(schema.newsArticles)
    .leftJoin(
      schema.categories,
      eq(schema.categories.id, schema.newsArticles.categoryId),
    )
    .leftJoin(
      schema.newsSources,
      eq(schema.newsSources.id, schema.newsArticles.sourceId),
    )
    .where(
      and(
        eq(schema.newsArticles.slug, slug),
        eq(schema.newsArticles.status, "published"),
      ),
    )
    .limit(1)

  return row ?? null
}

export async function listPublishedVideos({
  page = 1,
  categorySlug,
}: {
  page?: number
  categorySlug?: string
} = {}) {
  const offset = (page - 1) * PER_PAGE
  const where = categorySlug
    ? and(
        eq(schema.videos.status, "published"),
        eq(schema.categories.slug, categorySlug),
      )
    : eq(schema.videos.status, "published")

  const [rows, totalRow] = await Promise.all([
    db
      .select({
        id: schema.videos.id,
        slug: schema.videos.slug,
        youtubeId: schema.videos.youtubeId,
        title: schema.videos.title,
        summary: schema.videos.summary,
        channelName: schema.videos.channelName,
        thumbnailUrl: schema.videos.thumbnailUrl,
        durationSeconds: schema.videos.durationSeconds,
        publishedAt: schema.videos.publishedAt,
        categorySlug: schema.categories.slug,
        categoryName: schema.categories.name,
      })
      .from(schema.videos)
      .leftJoin(
        schema.categories,
        eq(schema.categories.id, schema.videos.categoryId),
      )
      .where(where)
      .orderBy(
        desc(
          sql`coalesce(${schema.videos.publishedAt}, ${schema.videos.createdAt})`,
        ),
      )
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.videos)
      .leftJoin(
        schema.categories,
        eq(schema.categories.id, schema.videos.categoryId),
      )
      .where(where),
  ])

  return {
    rows,
    total: totalRow[0]?.count ?? 0,
    page,
    perPage: PER_PAGE,
    totalPages: Math.max(1, Math.ceil((totalRow[0]?.count ?? 0) / PER_PAGE)),
  }
}

export async function getVideoBySlug(slug: string) {
  const [row] = await db
    .select({
      id: schema.videos.id,
      slug: schema.videos.slug,
      youtubeId: schema.videos.youtubeId,
      title: schema.videos.title,
      description: schema.videos.description,
      summary: schema.videos.summary,
      transcript: schema.videos.transcript,
      timestamps: schema.videos.timestamps,
      channelName: schema.videos.channelName,
      thumbnailUrl: schema.videos.thumbnailUrl,
      durationSeconds: schema.videos.durationSeconds,
      publishedAt: schema.videos.publishedAt,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
    })
    .from(schema.videos)
    .leftJoin(
      schema.categories,
      eq(schema.categories.id, schema.videos.categoryId),
    )
    .where(
      and(
        eq(schema.videos.slug, slug),
        eq(schema.videos.status, "published"),
      ),
    )
    .limit(1)

  return row ?? null
}

export async function getCategoryBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug))
    .limit(1)
  return row ?? null
}

export async function searchContent(query: string, limit = 20) {
  const q = `%${query}%`
  const [blogs, news, videos] = await Promise.all([
    db
      .select({
        type: sql<"blog">`'blog'`,
        slug: schema.blogs.slug,
        title: schema.blogs.title,
        excerpt: schema.blogs.metaDescription,
        imageUrl: schema.blogs.coverImageUrl,
        publishedAt: schema.blogs.publishedAt,
      })
      .from(schema.blogs)
      .where(
        and(
          eq(schema.blogs.status, "published"),
          sql`(${schema.blogs.title} ilike ${q} or ${schema.blogs.metaDescription} ilike ${q})`,
        ),
      )
      .orderBy(desc(schema.blogs.publishedAt))
      .limit(limit),
    db
      .select({
        type: sql<"news">`'news'`,
        slug: schema.newsArticles.slug,
        title: schema.newsArticles.title,
        excerpt: schema.newsArticles.summary,
        imageUrl: schema.newsArticles.imageUrl,
        publishedAt: schema.newsArticles.sourcePublishedAt,
      })
      .from(schema.newsArticles)
      .where(
        and(
          eq(schema.newsArticles.status, "published"),
          sql`(${schema.newsArticles.title} ilike ${q} or ${schema.newsArticles.summary} ilike ${q})`,
        ),
      )
      .orderBy(desc(schema.newsArticles.sourcePublishedAt))
      .limit(limit),
    db
      .select({
        type: sql<"video">`'video'`,
        slug: schema.videos.slug,
        title: schema.videos.title,
        excerpt: schema.videos.summary,
        imageUrl: schema.videos.thumbnailUrl,
        publishedAt: schema.videos.publishedAt,
      })
      .from(schema.videos)
      .where(
        and(
          eq(schema.videos.status, "published"),
          sql`(${schema.videos.title} ilike ${q} or ${schema.videos.summary} ilike ${q})`,
        ),
      )
      .orderBy(desc(schema.videos.publishedAt))
      .limit(limit),
  ])
  return [...blogs, ...news, ...videos]
    .sort((a, b) => {
      const ta = a.publishedAt?.getTime() ?? 0
      const tb = b.publishedAt?.getTime() ?? 0
      return tb - ta
    })
    .slice(0, limit)
}

export async function listAllPublishedSlugs() {
  const [blogs, news, videos] = await Promise.all([
    db.select({ slug: schema.blogs.slug }).from(schema.blogs).where(eq(schema.blogs.status, "published")),
    db.select({ slug: schema.newsArticles.slug }).from(schema.newsArticles).where(eq(schema.newsArticles.status, "published")),
    db.select({ slug: schema.videos.slug }).from(schema.videos).where(eq(schema.videos.status, "published")),
  ])
  return { blogs, news, videos }
}

export async function listAllCategories() {
  return db.select({ slug: schema.categories.slug }).from(schema.categories)
}

export async function getTagBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(schema.tags)
    .where(eq(schema.tags.slug, slug))
    .limit(1)
  return row ?? null
}

export async function listAllTags() {
  return db.select({ slug: schema.tags.slug }).from(schema.tags)
}

export async function listBlogsByTag(tagSlug: string) {
  return db
    .select({
      id: schema.blogs.id,
      slug: schema.blogs.slug,
      title: schema.blogs.title,
      metaDescription: schema.blogs.metaDescription,
      coverImageUrl: schema.blogs.coverImageUrl,
      author: schema.blogs.author,
      publishedAt: schema.blogs.publishedAt,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
    })
    .from(schema.blogs)
    .innerJoin(schema.blogTags, eq(schema.blogTags.blogId, schema.blogs.id))
    .innerJoin(schema.tags, eq(schema.tags.id, schema.blogTags.tagId))
    .leftJoin(schema.categories, eq(schema.categories.id, schema.blogs.categoryId))
    .where(and(eq(schema.blogs.status, "published"), eq(schema.tags.slug, tagSlug)))
    .orderBy(desc(schema.blogs.publishedAt))
    .limit(24)
}

export async function listNewsByTag(tagSlug: string) {
  return db
    .select({
      id: schema.newsArticles.id,
      slug: schema.newsArticles.slug,
      title: schema.newsArticles.title,
      summary: schema.newsArticles.summary,
      imageUrl: schema.newsArticles.imageUrl,
      sourceUrl: schema.newsArticles.sourceUrl,
      sourceName: schema.newsSources.name,
      sourcePublishedAt: schema.newsArticles.sourcePublishedAt,
      createdAt: schema.newsArticles.createdAt,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
    })
    .from(schema.newsArticles)
    .innerJoin(schema.newsTags, eq(schema.newsTags.newsId, schema.newsArticles.id))
    .innerJoin(schema.tags, eq(schema.tags.id, schema.newsTags.tagId))
    .leftJoin(schema.categories, eq(schema.categories.id, schema.newsArticles.categoryId))
    .leftJoin(schema.newsSources, eq(schema.newsSources.id, schema.newsArticles.sourceId))
    .where(and(eq(schema.newsArticles.status, "published"), eq(schema.tags.slug, tagSlug)))
    .orderBy(desc(sql`coalesce(${schema.newsArticles.sourcePublishedAt}, ${schema.newsArticles.createdAt})`))
    .limit(24)
}

export async function listVideosByTag(tagSlug: string) {
  return db
    .select({
      id: schema.videos.id,
      slug: schema.videos.slug,
      youtubeId: schema.videos.youtubeId,
      title: schema.videos.title,
      summary: schema.videos.summary,
      channelName: schema.videos.channelName,
      thumbnailUrl: schema.videos.thumbnailUrl,
      durationSeconds: schema.videos.durationSeconds,
      publishedAt: schema.videos.publishedAt,
      categorySlug: schema.categories.slug,
      categoryName: schema.categories.name,
    })
    .from(schema.videos)
    .innerJoin(schema.videoTags, eq(schema.videoTags.videoId, schema.videos.id))
    .innerJoin(schema.tags, eq(schema.tags.id, schema.videoTags.tagId))
    .leftJoin(schema.categories, eq(schema.categories.id, schema.videos.categoryId))
    .where(and(eq(schema.videos.status, "published"), eq(schema.tags.slug, tagSlug)))
    .orderBy(desc(sql`coalesce(${schema.videos.publishedAt}, ${schema.videos.createdAt})`))
    .limit(24)
}

export async function listCategoriesWithCounts() {
  const rows = await db
    .select({
      id: schema.categories.id,
      slug: schema.categories.slug,
      name: schema.categories.name,
      description: schema.categories.description,
      icon: schema.categories.icon,
      sortOrder: schema.categories.sortOrder,
      count: sql<number>`
        (select count(*) from public.blogs b
         where b.category_id = ${schema.categories.id} and b.status = 'published')
        + (select count(*) from public.news_articles n
           where n.category_id = ${schema.categories.id} and n.status = 'published')
        + (select count(*) from public.videos v
           where v.category_id = ${schema.categories.id} and v.status = 'published')
      `.mapWith(Number),
    })
    .from(schema.categories)
    .orderBy(schema.categories.sortOrder)
  return rows
}

