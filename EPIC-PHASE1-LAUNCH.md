# CyberSathi.in — Phase 1 Launch Epic Plan

**Date:** 2026-04-19  
**Status:** Planning  
**Goal:** Reach M7 (live site, indexed, automated pipelines running)

---

## 1. Epic Overview

**Purpose:** Complete Phase 1 of CyberSathi.in — an automated India-focused cyber-crime knowledge portal. Milestones M0–M2 are done (scaffold, schema, admin, public pages). This epic covers M3–M7: content automation pipelines, SEO hardening, missing pages, and launch readiness.

**User Value:** Site becomes self-sustaining — content publishes automatically, ranks on Google for cyber-crime keywords, drives organic traffic without daily manual intervention.

**Scope (IN):**
- Blog generation pipeline (Claude + Cron)
- News scraping pipeline (RSS + rewrite)
- Video pipeline (YouTube API + transcript + summary)
- SEO: JSON-LD, sitemap, static params, IndexNow
- Missing public pages: about, contact, privacy, terms, disclaimer
- Home page wired to real DB data
- Newsletter: Resend integration
- Analytics: Vercel Analytics + GA4 in layouts
- Sentry setup
- Dark/light mode (next-themes)
- View count increment
- Search page (Supabase FTS)
- Tag pages
- `vercel.json` cron schedule

**Scope (OUT):**
- Phase 2 complaint product
- User accounts
- Hindi content
- Admin analytics embed

---

## 2. Goals & Success Metrics

**Primary Goal:** Automated content pipeline running in production; site indexable and SEO-ready.

**Success Metrics:**
- All 3 cron pipelines execute without error in production
- 50+ published posts indexed by Google within 2 weeks of M7
- Lighthouse SEO score ≥ 95
- LCP < 2.5s on mobile 4G
- Core Web Vitals green
- Newsletter signup functional (Resend delivery confirmed)
- Zero broken 404 links in footer/navbar

---

## 3. Requirements Summary

### Functional
- `POST /api/cron/generate-blogs` — pull N topics from `topic_queue`, call Claude, insert blog with `status='pending_review'`
- `POST /api/cron/scrape-news` — iterate `news_sources`, parse RSS, dedupe by `source_url_hash`, rewrite via Claude, insert news
- `POST /api/cron/fetch-videos` — YouTube search by keyword, fetch transcript, summarise via Claude, insert video
- `POST /api/newsletter/subscribe` — validate email, insert into `subscribers`, send welcome via Resend
- All cron routes gated by `CRON_SECRET` header
- `vercel.json` schedules all three crons
- `generateStaticParams` on blog/news/video detail pages
- `sitemap.xml` + `robots.txt` via `next-sitemap`
- JSON-LD `schema.org/Article`, `VideoObject`, `NewsArticle`, `BreadcrumbList` on all detail pages
- IndexNow ping on every publish
- Home page `BlogsAndNews` and `FeaturedVideos` pull from DB
- Public pages: `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`
- Search page: `/search?q=` backed by Supabase full-text search
- Tag pages: `/tag/[slug]`
- View count increment on page visit (server action or route handler)
- Dark/light mode toggle
- Vercel Analytics + GA4 in root layout
- Sentry `sentry.client.config.ts` + `sentry.server.config.ts`

### Non-Functional
- Cron endpoints must use `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS for writes)
- Each cron job must log a `job_runs` row (start, finish, status, items_processed, errors_json)
- Blog generation: max 3 blogs per cron run, `p-limit(1)` to avoid rate limits
- News scraping: dedupe BEFORE LLM call to avoid wasting tokens
- YouTube pipeline: skip videos already in DB (`youtubeId` unique constraint)
- Cover images: Unsplash API first, fallback to category-default `/images/categories/{slug}.jpg`
- No full article bodies republished in news (summary only, always link source)
- `CRON_SECRET` must match Vercel Cron `Authorization: Bearer` header

### Business Rules
- Auto-publish flag controlled by env var `AUTO_PUBLISH=true|false` (default false)
- LLM-generated blogs must include `ai_generated=1`, `ai_model`, `ai_prompt_version`
- News items must have `source_url` + `source_id` set; never null
- Transcript too long (>100k chars): chunk and summarize chunks, then summarize summaries

### Edge Cases
- RSS feed returns 0 new items → log success with `items_processed=0`, no error
- YouTube transcript unavailable → insert video without transcript, set `transcript=null`
- Claude API timeout → catch, log error in `job_runs.errors_json`, continue next item
- Unsplash API limit hit → fall back to category default image silently
- Duplicate `source_url_hash` on insert → catch unique violation, skip silently

---

## 4. Technical Change Overview

| Component | Type | Description | Risk | Dependencies |
|-----------|------|-------------|------|--------------|
| `/api/cron/generate-blogs/route.ts` | New | Blog gen pipeline | High | Claude API key, topic_queue data |
| `/api/cron/scrape-news/route.ts` | New | RSS scrape + rewrite | High | news_sources data, Claude API |
| `/api/cron/fetch-videos/route.ts` | New | YouTube + transcript | High | YouTube API key, Claude API |
| `/api/revalidate/route.ts` | New | On-demand ISR trigger | Low | None |
| `/api/newsletter/subscribe/route.ts` | New | Email subscribe + Resend | Med | Resend API key |
| `src/lib/pipelines/blog-generator.ts` | New | Claude prompt + insert logic | High | Drizzle schema |
| `src/lib/pipelines/news-scraper.ts` | New | RSS parse + dedup + rewrite | High | rss-parser, cheerio |
| `src/lib/pipelines/video-fetcher.ts` | New | YouTube search + transcript | High | googleapis, youtube-transcript |
| `src/lib/pipelines/cover-image.ts` | New | Unsplash + fallback logic | Low | unsplash-js |
| `src/lib/pipelines/job-logger.ts` | New | Wraps job_runs insert/update | Low | Drizzle schema |
| `vercel.json` | New | Cron schedules | Med | Vercel Pro plan |
| `next-sitemap.config.js` | New | Sitemap generation | Low | None |
| `next.config.ts` | Enhancement | CSP headers, more image domains | Low | None |
| `src/app/(public)/page.tsx` | Enhancement | Wire BlogsAndNews + FeaturedVideos to DB | Med | content/queries.ts |
| `src/components/landing/blogs-and-news.tsx` | Enhancement | Remove hardcoded data, accept props | Med | None |
| `src/components/landing/featured-videos.tsx` | Enhancement | Remove hardcoded data, accept props | Med | None |
| `src/app/(public)/blog/[slug]/page.tsx` | Enhancement | Add JSON-LD + generateStaticParams | Med | None |
| `src/app/(public)/news/[slug]/page.tsx` | Enhancement | Add JSON-LD + generateStaticParams | Med | None |
| `src/app/(public)/video/[slug]/page.tsx` | Enhancement | Add JSON-LD + generateStaticParams | Med | None |
| `src/app/(public)/search/page.tsx` | New | Supabase FTS search results | Med | content/queries.ts |
| `src/app/(public)/tag/[slug]/page.tsx` | New | Tag listing page | Low | Drizzle schema |
| `src/app/(public)/about/page.tsx` | New | Static about page | Low | None |
| `src/app/(public)/contact/page.tsx` | New | Contact page (form optional) | Low | None |
| `src/app/(public)/privacy/page.tsx` | New | Privacy policy | Low | None |
| `src/app/(public)/terms/page.tsx` | New | Terms of service | Low | None |
| `src/app/(public)/disclaimer/page.tsx` | New | Disclaimer page | Low | None |
| `src/app/layout.tsx` | Enhancement | Add GA4, Vercel Analytics, ThemeProvider, Sentry | Med | env vars |
| `src/components/landing/navbar.tsx` | Enhancement | Add dark/light toggle | Low | next-themes |
| `src/lib/content/queries.ts` | Enhancement | Add FTS search query, tag queries, view count increment | Med | None |
| `sentry.client.config.ts` | New | Sentry browser config | Low | Sentry DSN |
| `sentry.server.config.ts` | New | Sentry server config | Low | Sentry DSN |
| `src/middleware.ts` | Enhancement | Add view count increment route | Low | None |

---

## 5. Impact Analysis

**Codebase Impact:**
- New `src/lib/pipelines/` directory (4 modules)
- New `src/app/api/cron/` directory (3 routes)
- New `src/app/api/newsletter/` and `src/app/api/revalidate/`
- 5 new public static pages
- 2 new public dynamic pages (search, tag)
- Modifications to 3 detail pages (JSON-LD + static params)
- Root layout changes (analytics + theme)
- 2 landing component rewrites (remove hardcoded data)

**Data Model Changes:**
- No new tables needed — all columns exist
- `view_count` increment needs atomic SQL update (`SET view_count = view_count + 1`)
- `source_url_hash` dedup: application layer must compute `md5(source_url)` before insert

**API Changes:**
- 5 new POST route handlers
- No breaking changes to existing endpoints

**UI/UX Changes:**
- Dark/light mode toggle in navbar
- Home page shows real content
- 5 new static info pages
- Search page

**Migration Strategy:** No DB migration needed. All schema columns already exist.

**Rollback Plan:** Cron routes are additive; disabling them = remove `vercel.json` crons or set `AUTO_PUBLISH=false`. Static pages can be reverted by deletion.

---

## 6. Testing Strategy

**Unit Tests (Vitest):**
- `blog-generator.ts` — mock Claude API, assert DB insert shape
- `news-scraper.ts` — mock rss-parser output, assert dedup logic
- `video-fetcher.ts` — mock YouTube API, assert transcript chunking
- `cover-image.ts` — mock Unsplash, assert fallback path
- `job-logger.ts` — assert job_runs insert fields

**Integration Tests:**
- Cron routes with test DB (Supabase local): POST → assert rows created
- Newsletter subscribe: POST valid/invalid email

**Manual Test Scenarios:**
- Run each cron endpoint manually via `curl -H "Authorization: Bearer $CRON_SECRET" POST /api/cron/...`
- Verify `job_runs` row created with correct status
- Verify content appears in admin review queue
- Verify sitemap includes new URLs after publish

**Coverage Target:** 80% for pipeline logic; 0% required for static pages.

---

## 7. User Behavior Testing

**E2E Scenarios (Playwright):**
1. Home page loads → BlogsAndNews shows real DB items, hrefs are non-`#`
2. Blog detail page → JSON-LD script tag present in `<head>`
3. Search → type query → results appear → click → detail page loads
4. Newsletter form → submit email → success toast shown
5. Dark mode toggle → theme persists on refresh

**Regression Checks:**
- Admin login still works after layout changes
- Blog/news/video index pagination still works
- Category pages still render

---

## 8. Implementation Notes

### Pipeline Architecture Pattern
Each pipeline follows the same structure:
```
src/lib/pipelines/
  blog-generator.ts    → generateBlog(topic: TopicQueue): Promise<void>
  news-scraper.ts      → scrapeSource(source: NewsSource): Promise<number>  
  video-fetcher.ts     → fetchVideos(keyword: string): Promise<number>
  cover-image.ts       → getCoverImage(query: string, categorySlug: string): Promise<string>
  job-logger.ts        → startJob() / finishJob() / failJob()
```

Each cron route:
1. Validates `Authorization: Bearer {CRON_SECRET}`
2. Calls `startJob(jobType)` → gets `jobRunId`
3. Runs pipeline with `try/catch` per item
4. Calls `finishJob(jobRunId, itemsProcessed, errors)` or `failJob()`
5. Returns `{ success: true, itemsProcessed }` JSON

### Claude Prompt Strategy
- **Blogs:** Sonnet for full article, Haiku for meta description + tags
- **News rewrite:** Haiku (fast + cheap for headline + 150-word summary)
- **Video summary:** Haiku for per-chunk summaries, Sonnet for final consolidation
- Enable prompt caching on system prompts (saves ~70% tokens on repeated runs)
- Store `ai_prompt_version` as semver string (e.g. `"blog-v1.2"`) for A/B tracking

### Blog Generation Prompt Structure
```
System: You are a cybersecurity content writer for CyberSathi.in, an Indian 
        cyber-crime awareness portal. Write factual, SEO-optimized content.
        Never give legal advice. Always disclose AI generation.

User: Topic: {keyword}
      Reference news headlines: {recent_news_titles}
      Category: {category_name}
      
      Return JSON: { title, slug, metaDescription, bodyMd, tags: string[], 
                     coverImagePrompt }
```

### Supabase FTS for Search
```sql
-- Add to queries.ts
SELECT *, ts_rank(to_tsvector('english', title || ' ' || coalesce(meta_description, '')), 
         plainto_tsquery('english', $1)) AS rank
FROM blogs
WHERE status = 'published'
  AND to_tsvector('english', title || ' ' || coalesce(meta_description, '')) 
      @@ plainto_tsquery('english', $1)
ORDER BY rank DESC LIMIT 20
```
Run same query on `news_articles` and `videos`, union results, sort by rank.

### `generateStaticParams` Pattern
```typescript
// Follow existing ISR pattern but add static generation
export async function generateStaticParams() {
  const slugs = await db.select({ slug: blogs.slug })
    .from(blogs)
    .where(eq(blogs.status, 'published'))
  return slugs.map(({ slug }) => ({ slug }))
}
```

### JSON-LD Pattern (Article example)
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: blog.title,
  description: blog.metaDescription,
  image: blog.coverImageUrl,
  datePublished: blog.publishedAt?.toISOString(),
  author: { '@type': 'Organization', name: 'CyberSathi Desk' },
  publisher: { '@type': 'Organization', name: 'CyberSathi.in' },
}
// In <head>: <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

### Security
- Cron routes: `if (req.headers.get('Authorization') !== \`Bearer ${process.env.CRON_SECRET}\`) return 401`
- Newsletter: zod email validation + rate limit check (skip Upstash for now, add later)
- `SUPABASE_SERVICE_ROLE_KEY` used only server-side, never in `NEXT_PUBLIC_*`

---

## 9. Acceptance Criteria

- [ ] All 3 cron routes return 200 with valid `job_runs` row inserted
- [ ] Blogs generated by pipeline appear in `/admin/blogs` review queue
- [ ] News articles from RSS appear in `/admin/news` queue, deduplicated
- [ ] Videos from YouTube appear in `/admin/videos` queue with transcript/summary
- [ ] `sitemap.xml` accessible at `/sitemap.xml`, includes all published content URLs
- [ ] `robots.txt` accessible, allows Googlebot, disallows `/admin`
- [ ] JSON-LD present on all blog/news/video detail pages (validate with Google Rich Results Test)
- [ ] `generateStaticParams` returns slugs for all published content
- [ ] Home page shows real DB content (no `href="#"`)
- [ ] Newsletter subscribe sends email via Resend (test with real email)
- [ ] `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer` all return 200
- [ ] `/search?q=phishing` returns relevant results
- [ ] Dark mode toggle works and persists via `next-themes`
- [ ] Vercel Analytics dashboard shows page views after deployment
- [ ] Sentry captures test error in production
- [ ] Lighthouse SEO score ≥ 95 on blog detail page
- [ ] `vercel.json` crons listed in Vercel dashboard

---

## 10. Open Questions & Risks

### Blockers
- **YouTube API key**: needed for `fetch-videos` pipeline — must be set in Vercel env vars
- **Resend API key**: needed for newsletter — must be provisioned
- **Unsplash API key**: needed for cover images
- **`CRON_SECRET`**: must be set in both Vercel env and local `.env.local`
- **Vercel plan**: Cron Jobs require at least Vercel Pro ($20/mo) or Hobby plan (limited to daily)

### Assumptions
- Claude Sonnet 4.6 used for blog generation (available as of 2026-04-19)
- Supabase project is already provisioned and migrated (seed.sql applied)
- `topic_queue` has ≥ 10 active keywords before first cron run
- `news_sources` has ≥ 3 active RSS URLs before first cron run

### Risks
| Risk | Mitigation |
|------|------------|
| Claude API cost runaway on test runs | Set `maxBlogsPerRun=1` in dev env var |
| YouTube transcript rate limit | `p-limit(2)` concurrency + 500ms delay between requests |
| RSS feed returns malformed XML | Wrap `rss-parser.parseURL()` in try/catch, skip + log |
| `generateStaticParams` times out on large DB | Paginate query, or use on-demand ISR only |
| Supabase FTS slow on unindexed tables | Add GIN index: `CREATE INDEX ON blogs USING gin(to_tsvector('english', title))` |

---

## 11. Codebase Analysis

### Affected Modules
- `src/app/api/` — entirely new (no files exist here yet)
- `src/lib/pipelines/` — entirely new directory
- `src/app/(public)/page.tsx` — home page data fetching
- `src/components/landing/blogs-and-news.tsx` — remove hardcoded data
- `src/components/landing/featured-videos.tsx` — remove hardcoded data
- `src/app/(public)/blog/[slug]/page.tsx` — JSON-LD + static params
- `src/app/(public)/news/[slug]/page.tsx` — JSON-LD + static params
- `src/app/(public)/video/[slug]/page.tsx` — JSON-LD + static params
- `src/lib/content/queries.ts` — add search + tag queries
- `src/app/layout.tsx` — analytics + Sentry + ThemeProvider
- `src/components/landing/navbar.tsx` — dark mode toggle

### Patterns Discovered

**API route pattern** (from admin server actions):
- All DB writes use Drizzle ORM with `db.insert().values().returning()`
- Admin actions use `getAdminSession()` guard at top
- Cron routes should mirror this but use `service role` client instead

**Query patterns** (`src/lib/content/queries.ts`):
- All public queries filter `eq(table.status, 'published')`
- Pagination: `.limit(limit).offset((page - 1) * limit)`
- `db` is imported from `@/lib/db`

**Schema patterns** (`src/lib/db/schema/`):
- `snake_case` column names via Drizzle `casing: 'snake_case'` in config
- All tables have `createdAt` timestamp default `now()`
- Enums defined in `enums.ts`, imported by content/automation schemas

**Component patterns:**
- Server Components fetch data directly (no useEffect/fetch)
- Landing components receive data as props from parent RSC
- shadcn/ui components used for all primitives

### Reference Implementations
- Admin review queues (`src/app/admin/blogs/`, `news/`, `videos/`) → pattern for DB queries + server actions
- `src/lib/content/queries.ts:getBlogs()` → pattern for new search/tag queries
- `src/app/(public)/blog/[slug]/page.tsx` → pattern for JSON-LD additions

### Test Locations
- Unit tests: `tests/` (Vitest) — no tests written yet
- E2E: `e2e/` (Playwright) — no tests written yet
- Framework: Vitest + @testing-library/react + Playwright (all installed)

---

## 12. Ticket Breakdown

Since no Jira is configured, tickets are tracked here:

### Epic M3 — Blog Automation
| # | Ticket | Type | Est. |
|---|--------|------|------|
| M3-1 | `src/lib/pipelines/job-logger.ts` — job_runs CRUD | Task | 1h |
| M3-2 | `src/lib/pipelines/cover-image.ts` — Unsplash + fallback | Task | 1h |
| M3-3 | `src/lib/pipelines/blog-generator.ts` — Claude prompt + insert | Task | 3h |
| M3-4 | `POST /api/cron/generate-blogs/route.ts` | Task | 2h |
| M3-5 | Test: manual curl run, verify admin queue | Test | 1h |

### Epic M4 — News Automation
| # | Ticket | Type | Est. |
|---|--------|------|------|
| M4-1 | `src/lib/pipelines/news-scraper.ts` — RSS + dedup + rewrite | Task | 3h |
| M4-2 | `POST /api/cron/scrape-news/route.ts` | Task | 1h |
| M4-3 | `next.config.ts` — add news source image domains | Task | 30m |
| M4-4 | Test: run against real RSS feeds | Test | 1h |

### Epic M5 — Video Automation
| # | Ticket | Type | Est. |
|---|--------|------|------|
| M5-1 | `src/lib/pipelines/video-fetcher.ts` — YouTube + transcript + summary | Task | 4h |
| M5-2 | `POST /api/cron/fetch-videos/route.ts` | Task | 1h |
| M5-3 | Test: run against real YouTube queries | Test | 1h |

### Epic M6 — SEO + Launch Prep
| # | Ticket | Type | Est. |
|---|--------|------|------|
| M6-1 | `generateStaticParams` on all 3 detail pages | Task | 1h |
| M6-2 | JSON-LD on blog/news/video detail pages | Task | 2h |
| M6-3 | `next-sitemap.config.js` + `robots.txt` | Task | 1h |
| M6-4 | IndexNow ping on publish (add to cron post-insert) | Task | 1h |
| M6-5 | Add GIN indexes for FTS to Supabase migration | Task | 30m |
| M6-6 | `src/app/(public)/search/page.tsx` | Task | 2h |
| M6-7 | `src/app/(public)/tag/[slug]/page.tsx` | Task | 1h |
| M6-8 | Home page: wire BlogsAndNews + FeaturedVideos to DB | Task | 2h |
| M6-9 | Static pages: about, contact, privacy, terms, disclaimer | Task | 2h |
| M6-10 | Newsletter: `/api/newsletter/subscribe` + Resend | Task | 2h |
| M6-11 | Dark/light mode: ThemeProvider + toggle in navbar | Task | 1h |
| M6-12 | Vercel Analytics + GA4 in root layout | Task | 1h |
| M6-13 | Sentry setup (client + server config) | Task | 1h |
| M6-14 | `vercel.json` cron schedule | Task | 30m |
| M6-15 | View count increment (server action on detail page visit) | Task | 1h |

---

## 13. Execution Order

```
M3-1 → M3-2 → M3-3 → M3-4 → M3-5   (blog pipeline, ~8h)
         ↓
M4-1 → M4-2 → M4-3 → M4-4           (news pipeline, ~5.5h)
         ↓  
M5-1 → M5-2 → M5-3                   (video pipeline, ~6h)
         ↓
M6-1..M6-15 (parallelizable, ~18h)
         ↓
M7: Deploy + verify + monitor
```

**Total estimate:** ~37 hours of coding + 5h testing = ~42h  
**Calendar:** ~2 weeks at 4h/day

---

## Next Step

Start with M3-1 (job logger), then M3-2 (cover image), then M3-3 (blog generator). These are the highest-value, highest-risk items that unlock the core automated content pipeline.

To begin execution:
```
→ Implement M3-1: src/lib/pipelines/job-logger.ts
→ Implement M3-2: src/lib/pipelines/cover-image.ts  
→ Implement M3-3: src/lib/pipelines/blog-generator.ts
→ Implement M3-4: src/app/api/cron/generate-blogs/route.ts
```
