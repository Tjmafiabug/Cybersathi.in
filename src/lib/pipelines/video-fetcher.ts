import OpenAI from "openai"
import slugify from "slugify"
import { Innertube } from "youtubei.js"
import { YoutubeTranscript } from "youtube-transcript"
import { eq } from "drizzle-orm"
import { db, schema } from "@/lib/db"

let _yt: Innertube | null = null
async function getYT() {
  _yt ??= await Innertube.create({ retrieve_player: false })
  return _yt
}

let _openai: OpenAI | null = null
function getOpenAI() {
  _openai ??= new OpenAI()
  return _openai
}

type CategoryRow = typeof schema.categories.$inferSelect

async function fetchTranscript(videoId: string): Promise<string | null> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId)
    return segments.map((s) => s.text).join(" ")
  } catch {
    return null
  }
}

async function summariseTranscript(
  title: string,
  transcript: string,
  categories: CategoryRow[],
): Promise<{ summary: string; categorySlug: string }> {
  const categoryList = categories.map((c) => `${c.slug}: ${c.name}`).join("\n")

  // Chunk if too long — summarise chunks then consolidate
  const MAX_CHARS = 30_000
  let condensed = transcript

  if (transcript.length > MAX_CHARS) {
    const chunks: string[] = []
    for (let i = 0; i < transcript.length; i += MAX_CHARS) {
      chunks.push(transcript.slice(i, i + MAX_CHARS))
    }
    const chunkSummaries = await Promise.all(
      chunks.map((chunk) =>
        getOpenAI()
          .chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Summarise in 3-4 sentences:\n\n${chunk}` }],
            max_tokens: 200,
          })
          .then((r) => r.choices[0].message.content ?? ""),
      ),
    )
    condensed = chunkSummaries.join("\n")
  }

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You summarise cybersecurity YouTube videos for CyberSathi.in, an Indian cyber-crime awareness portal. Write clear, educational summaries for Indian readers.`,
      },
      {
        role: "user",
        content: `Video title: ${title}
Transcript: ${condensed.slice(0, 8000)}

Available categories:
${categoryList}

Return JSON:
{
  "summary": "150-200 word educational summary of key takeaways for Indian readers",
  "categorySlug": "best matching slug from above"
}`,
      },
    ],
  })

  return JSON.parse(response.choices[0].message.content ?? "{}") as {
    summary: string
    categorySlug: string
  }
}

export async function fetchVideos(
  keyword: string,
  categories: CategoryRow[],
  maxItems: number,
): Promise<number> {
  const yt = await getYT()

  const searchResults = await yt.search(
    `${keyword} India cybersecurity cyber crime`,
    { type: "video" },
  )

  const videos = searchResults.results
    ?.filter((r) => r.type === "Video")
    .slice(0, maxItems) ?? []

  if (videos.length === 0) return 0

  let inserted = 0

  for (const result of videos) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = result as any
    const youtubeId: string | undefined = r.video_id
    if (!youtubeId) continue

    const existing = await db.query.videos.findFirst({
      where: eq(schema.videos.youtubeId, youtubeId),
      columns: { id: true },
    })
    if (existing) continue

    const info = await yt.getBasicInfo(youtubeId)
    const bi = info.basic_info

    const title = bi.title ?? r.title?.toString() ?? "Untitled"
    const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`

    const transcript = await fetchTranscript(youtubeId)

    const { summary, categorySlug } = await summariseTranscript(
      title,
      transcript ?? title,
      categories,
    )

    const category = categories.find((c) => c.slug === categorySlug) ?? categories[0]

    const baseSlug = slugify(title, { lower: true, strict: true })
    const slug = `${baseSlug}-${youtubeId}`

    await db.insert(schema.videos).values({
      slug,
      youtubeId,
      title,
      description: bi.short_description?.slice(0, 500) ?? null,
      channelName: bi.channel?.name ?? null,
      channelId: bi.channel?.id ?? null,
      publishedAt: null,
      durationSeconds: bi.duration ?? null,
      thumbnailUrl,
      transcript,
      summary,
      categoryId: category.id,
      status: "pending_review",
    })

    inserted++
  }

  return inserted
}
