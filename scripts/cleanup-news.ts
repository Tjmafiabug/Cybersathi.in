import { config } from "dotenv"
config({ path: ".env.local" })
import { load } from "cheerio"
import { desc, eq, notInArray } from "drizzle-orm"
import { db, schema } from "../src/lib/db"

const KEEP = 10

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "CyberSathi-Bot/1.0 (+https://cybersathi.in)" },
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = load(html)
    return (
      $('meta[property="og:image"]').attr("content") ??
      $('meta[name="twitter:image"]').attr("content") ??
      null
    )
  } catch {
    return null
  }
}

async function main() {
  const all = await db
    .select({ id: schema.newsArticles.id, title: schema.newsArticles.title, sourceUrl: schema.newsArticles.sourceUrl })
    .from(schema.newsArticles)
    .orderBy(desc(schema.newsArticles.createdAt))

  const keep = all.slice(0, KEEP)
  const deleteIds = all.slice(KEEP).map((r) => r.id)

  console.log(`Total: ${all.length} | Keeping: ${keep.length} | Deleting: ${deleteIds.length}`)

  if (deleteIds.length > 0) {
    await db.delete(schema.newsArticles).where(notInArray(schema.newsArticles.id, keep.map((r) => r.id)))
    console.log(`Deleted ${deleteIds.length} articles.`)
  }

  console.log("Fetching og:images for remaining articles...")
  for (const article of keep) {
    const img = await fetchOgImage(article.sourceUrl)
    if (img) {
      await db
        .update(schema.newsArticles)
        .set({ imageUrl: img })
        .where(eq(schema.newsArticles.id, article.id))
      console.log(`  ✓ ${article.title.slice(0, 60)}`)
    } else {
      console.log(`  ✗ no image — ${article.title.slice(0, 60)}`)
    }
  }

  console.log("Done.")
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
