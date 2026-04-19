import { config } from "dotenv"
config({ path: ".env.local" })
import { load } from "cheerio"
import { eq } from "drizzle-orm"
import { db, schema } from "../src/lib/db"

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CyberSathi-Bot/1.0)" },
    })
    if (!res.ok) return null
    if (new URL(res.url).hostname.endsWith("google.com")) return null

    const html = await res.text()
    const $ = load(html)
    const img =
      $('meta[property="og:image"]').attr("content") ??
      $('meta[name="twitter:image"]').attr("content") ??
      null

    if (!img) return null
    try { return new URL(img, res.url).href } catch { return img }
  } catch {
    return null
  }
}

async function main() {
  const articles = await db
    .select({ id: schema.newsArticles.id, title: schema.newsArticles.title, sourceUrl: schema.newsArticles.sourceUrl })
    .from(schema.newsArticles)

  console.log(`Refetching images for ${articles.length} articles...`)

  for (const a of articles) {
    const img = await fetchOgImage(a.sourceUrl)
    await db
      .update(schema.newsArticles)
      .set({ imageUrl: img })
      .where(eq(schema.newsArticles.id, a.id))
    console.log(img ? `  ✓ ${a.title.slice(0, 60)}` : `  ✗ no image — ${a.title.slice(0, 60)}`)
  }

  console.log("Done.")
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
