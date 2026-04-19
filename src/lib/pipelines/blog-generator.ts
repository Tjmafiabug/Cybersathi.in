import OpenAI from "openai"
import { eq } from "drizzle-orm"
import { db, schema } from "@/lib/db"
import { getCoverImage } from "./cover-image"

let _openai: OpenAI | null = null
function getOpenAI() {
  _openai ??= new OpenAI()
  return _openai
}

const SYSTEM_PROMPT = `You are a cybersecurity content writer for CyberSathi.in, an Indian cyber-crime awareness portal.
Write factual, SEO-optimized content in plain English targeting Indian readers.
Never give legal advice. Always maintain a helpful, educational tone.
All content must be original and not reproduce copyrighted material.`

type TopicRow = typeof schema.topicQueue.$inferSelect
type CategoryRow = typeof schema.categories.$inferSelect

type BlogDraft = {
  title: string
  slug: string
  metaDescription: string
  bodyMd: string
  tags: string[]
  coverImagePrompt: string
  categorySlug: string
}

async function callOpenAI(
  topic: string,
  categories: CategoryRow[],
): Promise<BlogDraft> {
  const categoryList = categories.map((c) => `${c.slug}: ${c.name}`).join("\n")

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Write a comprehensive blog post for the following topic.

Topic: ${topic}

Available categories (pick the best fit):
${categoryList}

Return ONLY valid JSON with this exact shape:
{
  "title": "SEO-optimized headline (60-70 chars)",
  "slug": "kebab-case-url-slug",
  "metaDescription": "150-160 char meta description",
  "bodyMd": "Full markdown article body (800-1200 words). Include H2/H3 headings, practical tips, and a conclusion.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "coverImagePrompt": "Short Unsplash search query for cover image",
  "categorySlug": "one-of-the-slugs-above"
}`,
      },
    ],
  })

  const text = response.choices[0].message.content ?? ""
  return JSON.parse(text) as BlogDraft
}

async function upsertTags(tagNames: string[]): Promise<string[]> {
  const ids: string[] = []
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const existing = await db.query.tags.findFirst({
      where: eq(schema.tags.slug, slug),
      columns: { id: true },
    })
    if (existing) {
      ids.push(existing.id)
    } else {
      const [created] = await db
        .insert(schema.tags)
        .values({ slug, name })
        .returning({ id: schema.tags.id })
      ids.push(created.id)
    }
  }
  return ids
}

export async function generateBlog(
  topic: TopicRow,
  categories: CategoryRow[],
): Promise<void> {
  const draft = await callOpenAI(topic.keyword, categories)
  const category =
    categories.find((c) => c.slug === draft.categorySlug) ?? categories[0]
  const coverImageUrl = await getCoverImage(draft.coverImagePrompt, category.slug)

  const [blog] = await db
    .insert(schema.blogs)
    .values({
      slug: draft.slug,
      title: draft.title,
      metaDescription: draft.metaDescription,
      bodyMd: draft.bodyMd,
      coverImageUrl,
      categoryId: category.id,
      status: "pending_review",
      aiGenerated: 1,
      aiModel: "gpt-4o",
      aiPromptVersion: "blog-v1.0",
    })
    .returning({ id: schema.blogs.id })

  const tagIds = await upsertTags(draft.tags)
  if (tagIds.length > 0) {
    await db.insert(schema.blogTags).values(
      tagIds.map((tagId) => ({ blogId: blog.id, tagId })),
    )
  }

  await db
    .update(schema.topicQueue)
    .set({ lastUsedAt: new Date() })
    .where(eq(schema.topicQueue.id, topic.id))
}
