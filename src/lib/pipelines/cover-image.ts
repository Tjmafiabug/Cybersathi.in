const UNSPLASH_BASE = "https://api.unsplash.com"

async function fetchUnsplashImage(prompt: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) return null

  try {
    const url = new URL(`${UNSPLASH_BASE}/search/photos`)
    url.searchParams.set("query", prompt)
    url.searchParams.set("per_page", "1")
    url.searchParams.set("orientation", "landscape")
    url.searchParams.set("client_id", key)

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null

    const json = await res.json()
    return (json.results?.[0]?.urls?.regular as string) ?? null
  } catch {
    return null
  }
}

export async function getCoverImage(
  prompt: string,
  categorySlug: string,
): Promise<string> {
  const fallback = `/images/categories/${categorySlug}.jpg`
  const url = await fetchUnsplashImage(prompt)
  return url ?? fallback
}
