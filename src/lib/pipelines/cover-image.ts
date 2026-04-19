import OpenAI from "openai"
import { createServiceRoleClient } from "@/lib/supabase/server"

const BUCKET = "covers"

let _openai: OpenAI | null = null
function getOpenAI() {
  _openai ??= new OpenAI()
  return _openai
}

async function ensureBucket() {
  const supabase = createServiceRoleClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true })
  }
}

async function generateWithDallE(prompt: string): Promise<string | null> {
  try {
    const response = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt: `Cybersecurity themed image for an Indian awareness blog: ${prompt}. Clean, professional, no text.`,
      size: "1792x1024",
      response_format: "b64_json",
      n: 1,
    })

    const b64 = response.data?.[0]?.b64_json
    if (!b64) return null

    const buffer = Buffer.from(b64, "base64")
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`

    await ensureBucket()

    const supabase = createServiceRoleClient()
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType: "image/png", upsert: false })

    if (error) return null

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return data.publicUrl
  } catch {
    return null
  }
}

export async function getCoverImage(
  prompt: string,
  categorySlug: string,
): Promise<string> {
  const fallback = `/images/categories/${categorySlug}.jpg`
  const url = await generateWithDallE(prompt)
  return url ?? fallback
}
