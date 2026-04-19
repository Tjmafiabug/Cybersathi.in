import crypto from "crypto"
import Parser from "rss-parser"
import OpenAI from "openai"
import slugify from "slugify"
import { load } from "cheerio"
import { eq } from "drizzle-orm"
import { db, schema } from "@/lib/db"

type FeedItem = Parser.Item & {
  "media:content"?: { $?: { url?: string } }
  enclosure?: { url?: string; type?: string }
}

const rssParser = new Parser<Record<string, unknown>, FeedItem>({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["enclosure", "enclosure"],
    ],
  },
})

let _openai: OpenAI | null = null
function getOpenAI() {
  _openai ??= new OpenAI()
  return _openai
}

type SourceRow = typeof schema.newsSources.$inferSelect
type CategoryRow = typeof schema.categories.$inferSelect

type ArticleDraft = {
  title: string
  summary: string
  categorySlug: string
}

const CYBER_KEYWORDS = [
  "cyber", "hack", "scam", "fraud", "phishing", "malware", "ransomware",
  "breach", "data leak", "data theft", "identity theft", "upi", "otp",
  "scammer", "cybercrime", "online fraud", "security", "vulnerability",
  "exploit", "dark web", "trojan", "spyware", "botnet", "ddos",
  "password", "credential", "deepfake", "sim swap", "vishing", "smishing",
  "cryptocurrency scam", "investment scam", "tech support scam",
]

function isCyberRelated(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase()
  return CYBER_KEYWORDS.some((kw) => text.includes(kw))
}

function hashUrl(url: string): string {
  return crypto.createHash("md5").update(url).digest("hex")
}

function extractImageFromFeed(item: FeedItem): string | null {
  const mc = item["media:content"]
  if (mc?.$?.url) return mc.$.url
  const enc = item.enclosure
  if (enc?.url && /\.(jpg|jpeg|png|webp|gif)/i.test(enc.url)) return enc.url
  return null
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CyberSathi-Bot/1.0)" },
    })
    if (!res.ok) return null

    // If redirect landed back on google.com (e.g. Google News interstitial), skip
    if (new URL(res.url).hostname.endsWith("google.com")) return null

    const html = await res.text()
    const $ = load(html)
    const img =
      $('meta[property="og:image"]').attr("content") ??
      $('meta[name="twitter:image"]').attr("content") ??
      null

    if (!img) return null

    // Resolve relative URLs
    try {
      return new URL(img, res.url).href
    } catch {
      return img
    }
  } catch {
    return null
  }
}

async function resolveImageUrl(item: FeedItem, articleUrl: string): Promise<string | null> {
  return extractImageFromFeed(item) ?? fetchOgImage(articleUrl)
}

async function rewriteArticle(
  title: string,
  content: string,
  categories: CategoryRow[],
): Promise<ArticleDraft> {
  const categoryList = categories.map((c) => `${c.slug}: ${c.name}`).join("\n")

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You rewrite cybersecurity news for CyberSathi.in, an Indian cyber-crime awareness portal.
Write neutral, factual summaries in plain English for Indian readers.
Never reproduce the original article verbatim. Keep summaries under 150 words.`,
      },
      {
        role: "user",
        content: `Original headline: ${title}
Content snippet: ${content.slice(0, 2000)}

Available categories:
${categoryList}

Return JSON:
{
  "title": "Rewritten headline (under 80 chars)",
  "summary": "Neutral 120-150 word summary for Indian readers. End with: Source: [publication name].",
  "categorySlug": "best matching slug from above"
}`,
      },
    ],
  })

  return JSON.parse(response.choices[0].message.content ?? "{}") as ArticleDraft
}

export async function scrapeSource(
  source: SourceRow,
  categories: CategoryRow[],
  maxItems: number,
): Promise<number> {
  const feed = await rssParser.parseURL(source.url)
  let inserted = 0

  for (const item of feed.items) {
    if (inserted >= maxItems) break

    const url = item.link ?? item.guid
    if (!url) continue

    const hash = hashUrl(url)

    const existing = await db.query.newsArticles.findFirst({
      where: eq(schema.newsArticles.sourceUrlHash, hash),
      columns: { id: true },
    })
    if (existing) continue

    const rawContent = item.contentSnippet ?? item.content ?? item.title ?? ""
    if (!isCyberRelated(item.title ?? "", rawContent)) continue

    const [draft, imageUrl] = await Promise.all([
      rewriteArticle(item.title ?? "Untitled", rawContent, categories),
      resolveImageUrl(item, url),
    ])

    const category =
      categories.find((c) => c.slug === draft.categorySlug) ?? categories[0]

    const baseSlug = slugify(draft.title, { lower: true, strict: true })
    const slug = `${baseSlug}-${Date.now()}`

    await db.insert(schema.newsArticles).values({
      slug,
      title: draft.title,
      summary: draft.summary,
      sourceId: source.id,
      sourceUrl: url,
      sourceUrlHash: hash,
      sourcePublishedAt: item.pubDate ? new Date(item.pubDate) : null,
      categoryId: category.id,
      imageUrl,
      status: "pending_review",
      aiRewritten: 1,
    })

    inserted++
  }

  await db
    .update(schema.newsSources)
    .set({ lastPolledAt: new Date() })
    .where(eq(schema.newsSources.id, source.id))

  return inserted
}
