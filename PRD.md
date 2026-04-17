# CyberSathi.in — Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2026-04-17
**Owner:** Kunwer Sachdev
**Status:** Draft — pre-development

---

## 1. Executive Summary

CyberSathi.in is a cyber-crimes knowledge portal for the Indian and global audience. It aggregates three content types — **long-form blogs, world cyber-crime news, and curated YouTube videos with AI-generated summaries/transcripts** — into a single SEO-optimized destination.

The project runs in two phases:

- **Phase 1 (Months 0–10):** Launch a fully automated content portal. Drive SEO rankings and organic traffic. No user accounts required for core experience.
- **Phase 2 (Month 10+):** Layer a cyber-crime complaint-registration product on top, positioned as a modern alternative to the existing government portal, with the intent to collaborate with government stakeholders.

Phase 1 must succeed on its own merit; Phase 2 is gated on traffic + credibility milestones.

---

## 2. Vision & Goals

### Vision
Become the go-to knowledge hub for cyber-crime awareness in India, then expand into an actionable complaint-handling platform.

### Phase 1 Goals (launch → month 10)
- Publish **high-frequency, search-optimized content** with minimal manual effort.
- Rank on page 1 of Google for 50+ cyber-crime related long-tail keywords.
- Build **daily organic traffic** of 5–10k sessions by month 10.
- Email subscriber list of 5k+ for eventual Phase 2 launch.

### Phase 2 Goals (month 10+)
- Authenticated user accounts.
- Structured cyber-crime complaint filing (IPC/IT Act categorized).
- Case-tracking dashboard.
- Government partnership workflow (API hand-off or admin portal).

### Non-Goals (Phase 1)
- User-generated content / comments (skip to avoid moderation burden).
- Paid content / subscriptions.
- Mobile apps.
- Multi-language beyond English + Hindi (Hindi deferred to Phase 1.5 if demand is there).

---

## 3. Target Audience

**Primary:**
- Indian internet users (25–55) who want to stay informed about scams, frauds, and cyber threats.
- Victims of cyber crime looking for next-step guidance.
- Students / professionals researching cyber security.

**Secondary:**
- Journalists and bloggers citing cyber-crime trends.
- Law-enforcement and policy stakeholders (relationship-building for Phase 2).

---

## 4. Phase 1 — Scope & Features

### 4.1 Content Types

| Type | Source | Update cadence | Automation |
|------|--------|----------------|------------|
| **Blogs** | LLM-generated from topic queue + reference material | 2–3/day | Fully automated, human review optional |
| **News** | RSS feeds + NewsAPI + Google News RSS | Every 2 hours | Fully automated, dedupe + rewrite headline/summary |
| **Videos** | YouTube Data API v3 (keyword search) | Daily | Auto-fetch, transcript via youtube-transcript, summary via LLM |

### 4.2 Public-facing Features

- **Home page:** Hero, latest blogs, trending news, featured videos, newsletter CTA.
- **Blog index + detail pages:** Categories (Phishing, Ransomware, UPI fraud, Identity theft, Data breaches, Dark web, etc.), tags, reading time, related posts, share buttons.
- **News index + detail pages:** Source attribution, published date, original-article link, AI summary.
- **Video index + detail pages:** Embedded YouTube player, transcript (collapsed/expandable), AI summary, timestamps.
- **Search** (site-wide, powered by Supabase full-text search).
- **Category / tag pages.**
- **Newsletter signup** (Resend or Supabase + Loops).
- **About, Contact, Privacy, Terms, Disclaimer** pages.
- **Dark/light mode.**
- **Responsive mobile-first design** (21st.dev components).

### 4.3 Admin-facing Features (private `/admin` route)

- **Login** via Supabase Auth (magic link, one admin account initially).
- **Dashboard:** content queue status, job run history, error log.
- **Content review queue:** view auto-generated blogs/news/videos; publish / edit / reject before going live (optional — can be bypassed if trust is high).
- **Topic queue management:** add/remove keywords that drive blog + YT searches.
- **Manual publish:** override to write a blog manually.
- **Analytics overview:** embed Vercel Analytics + Google Search Console data.

### 4.4 Automation Pipelines

#### 4.4.1 Blog generation
1. Cron (Vercel Cron, every 8 hours) pulls N topics from `topic_queue` table.
2. For each topic: fetch 3–5 recent news articles + YouTube descriptions as context.
3. Call Anthropic Claude API with a structured prompt → returns title, slug, meta description, markdown body, category, tags, cover-image prompt.
4. Generate cover image via DALL-E / Stability / Unsplash API (fallback to category-default image).
5. Insert into `blogs` table with `status = 'pending_review'` (or `'published'` if auto-publish is on).
6. Generate `schema.org/Article` JSON-LD on publish.

#### 4.4.2 News scraping
1. Cron (every 2 hours) iterates `news_sources` table (RSS URLs + API endpoints).
2. Parse feed → for each new item (dedupe by URL hash), fetch article body via Cheerio/Readability.
3. Call LLM → returns rewritten title, summary (150 words), category tags. (Crucial: we **rewrite** to avoid duplicate-content SEO penalties, and always link back to source.)
4. Insert into `news_articles` table with original source URL + our summary. Never republish full original body.

#### 4.4.3 YouTube video pipeline
1. Daily cron iterates `topic_queue` keywords.
2. YouTube Data API v3 search → top 3–5 videos per keyword (filter by recency, minimum view count).
3. For each new video: fetch transcript via `youtube-transcript` (fallback to YouTube captions API).
4. Chunk transcript → LLM → summary + timestamps + key takeaways.
5. Insert into `videos` table with embed id, transcript, summary.

#### 4.4.4 SEO post-processing
- On every publish, regenerate `sitemap.xml` (via `next-sitemap`) and ping Google/Bing.
- Auto-submit top URLs to IndexNow API.

### 4.5 SEO Strategy (Phase 1)

- Next.js **App Router with Server Components** — full SSR for crawlers.
- Per-page `<Metadata>` export: title, description, OpenGraph, Twitter card, canonical.
- `schema.org/Article`, `VideoObject`, `NewsArticle`, `BreadcrumbList` JSON-LD.
- `sitemap.xml` + `robots.txt` auto-generated.
- Static generation (`generateStaticParams`) for blog/news/video detail pages; ISR with revalidation on publish.
- Image optimization via Next.js `<Image>` + `sharp`.
- Core Web Vitals target: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Internal linking: every blog auto-links to 3–5 related blogs/videos (computed via tag overlap + embeddings).
- URL structure: `/blog/{slug}`, `/news/{slug}`, `/video/{slug}`, `/category/{slug}`, `/tag/{slug}`.
- Breadcrumbs on all detail pages.
- Google Search Console + Bing Webmaster + Google Analytics 4 wired from day 1.

---

## 5. Phase 2 — Scope (High-level)

Not in scope for detailed design yet, but **Phase 1 architecture must not block these**:

- Authenticated users (Supabase Auth already in place).
- `complaints` table with IPC/IT Act categorization.
- File uploads (evidence) via Supabase Storage.
- Admin triage dashboard.
- Government liaison workflow (status updates, hand-off flags).
- Email/SMS notifications (Resend + MSG91 or similar).
- Case-tracking public view with anonymized ID.
- Legal pages (data-protection, grievance-officer, etc. — required under IT Rules 2021).

**Implication for Phase 1:** Set up Supabase Auth tables and RLS policies on day 1 (even if unused by public pages) so Phase 2 doesn't require a schema migration war.

---

## 6. Information Architecture & Sitemap

```
/                          Home
/blog                      Blog index (paginated)
/blog/[slug]               Blog detail
/news                      News index (paginated)
/news/[slug]               News detail
/videos                    Video index (paginated)
/video/[slug]              Video detail
/category/[slug]           Category listing (mixed content)
/tag/[slug]                Tag listing
/search                    Search results
/about
/contact
/privacy
/terms
/disclaimer
/sitemap.xml
/robots.txt
/admin                     Auth-gated
/admin/dashboard
/admin/blogs
/admin/news
/admin/videos
/admin/topics
/admin/sources
/admin/jobs
/api/cron/generate-blogs   POST (Vercel Cron secret)
/api/cron/scrape-news      POST (Vercel Cron secret)
/api/cron/fetch-videos     POST (Vercel Cron secret)
/api/revalidate            POST (on-demand ISR)
/api/newsletter/subscribe  POST
```

---

## 7. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, RSC, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + 21st.dev components (shadcn/ui under the hood) |
| UI primitives | Radix UI (via shadcn), lucide-react (icons) |
| Forms | react-hook-form + zod |
| DB / Auth / Storage | Supabase (Postgres 15) |
| ORM / client | `@supabase/supabase-js` + `@supabase/ssr`; Drizzle ORM for typed queries + migrations |
| Data fetching (client) | TanStack Query (for admin dashboard) |
| Markdown/MDX | `next-mdx-remote`, `remark-gfm`, `rehype-highlight` |
| LLM | Anthropic Claude (`@anthropic-ai/sdk`) |
| News APIs | NewsAPI, GDELT (REST), Google News RSS |
| RSS parsing | `rss-parser` |
| HTML scraping | `cheerio` + `@mozilla/readability` + `jsdom` |
| YouTube | `googleapis` (Data API v3) + `youtube-transcript` |
| Images | `next/image` + `sharp`; Unsplash API for fallback covers |
| Email | Resend (newsletter + Phase 2 txn mail) |
| Analytics | Vercel Analytics + Google Analytics 4 + Search Console |
| Cron | Vercel Cron Jobs |
| Hosting | Vercel (production) |
| Error tracking | Sentry |
| CI | Vercel preview deploys per PR; GitHub Actions for lint/test |

---

## 8. Architecture (logical)

```
           ┌────────────────────────────────┐
           │         Vercel (Next.js)       │
           │  ┌──────────────────────────┐  │
           │  │  Public pages (RSC/ISR)  │──┼───► Google crawler
           │  └──────────────────────────┘  │
           │  ┌──────────────────────────┐  │
  Admin ──►│  │  /admin (auth-gated)     │  │
           │  └──────────────────────────┘  │
           │  ┌──────────────────────────┐  │
  Cron ───►│  │  /api/cron/* endpoints   │──┼───► Anthropic API
           │  └──────────────────────────┘  │───► NewsAPI / RSS
           │                                │───► YouTube Data API
           │                                │───► Resend
           └──────────────┬─────────────────┘
                          │
                 ┌────────▼────────┐
                 │    Supabase     │
                 │  Postgres + RLS │
                 │  Auth + Storage │
                 └─────────────────┘
```

---

## 9. Database Schema (Phase 1 core tables)

```sql
-- Content
blogs(id, slug, title, meta_description, body_md, body_html,
      cover_image_url, category_id, status, author, published_at,
      created_at, updated_at, ai_generated boolean, ai_model text,
      ai_prompt_version text, view_count)

news_articles(id, slug, title, summary, source_id, source_url,
              source_published_at, category_id, image_url,
              status, created_at, ai_rewritten boolean, view_count)

videos(id, slug, youtube_id, title, description, channel_name,
       channel_id, published_at, duration_seconds, thumbnail_url,
       transcript, summary, timestamps jsonb, category_id, status,
       view_count, created_at)

-- Taxonomy
categories(id, slug, name, description, icon, sort_order)
tags(id, slug, name)
blog_tags(blog_id, tag_id)
news_tags(news_id, tag_id)
video_tags(video_id, tag_id)

-- Automation
topic_queue(id, keyword, priority, last_used_at, active)
news_sources(id, name, type[rss|api], url, active, last_polled_at)
job_runs(id, job_type, started_at, finished_at, status,
         items_processed, errors_json)

-- Newsletter
subscribers(id, email, verified, created_at, unsubscribed_at)

-- Auth (Supabase-managed)
auth.users                 -- built in
profiles(user_id, role[admin|user], display_name)   -- Phase 2-ready
```

**RLS policies:** public read on `status='published'` rows for `blogs/news/videos`; admin-only write everywhere. Service-role client used by cron endpoints.

---

## 10. External Services & API Keys

| Service | Why | Cost starting |
|---------|-----|---------------|
| Supabase | DB / auth / storage | Free tier OK for launch |
| Vercel | Hosting + cron | Hobby free; Pro ($20/mo) once we need team + advanced analytics |
| Anthropic | LLM for content gen | Pay-as-you-go; budget $50–100/mo |
| NewsAPI | News sourcing | Developer plan $0 (100 req/day) → Business $449/mo later |
| YouTube Data API v3 | Video discovery | Free (10k units/day quota) |
| Resend | Newsletter/email | Free 3k/mo |
| Google Search Console | SEO telemetry | Free |
| Google Analytics 4 | Analytics | Free |
| Sentry | Errors | Free dev tier |
| Unsplash API | Fallback images | Free (50 req/hr) |
| Cloudflare (optional) | DNS + proxy for .in domain | Free |

### Env vars required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEWSAPI_KEY=
YOUTUBE_API_KEY=
RESEND_API_KEY=
UNSPLASH_ACCESS_KEY=
CRON_SECRET=                   # shared secret Vercel Cron sends
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=https://cybersathi.in
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

## 11. Dependency Manifest (full list, to install upfront)

### Runtime dependencies
```
next react react-dom
typescript
tailwindcss @tailwindcss/postcss @tailwindcss/typography
class-variance-authority clsx tailwind-merge tailwindcss-animate
@radix-ui/react-* (installed per-component by shadcn CLI)
lucide-react
@supabase/supabase-js @supabase/ssr
drizzle-orm drizzle-kit postgres
@anthropic-ai/sdk
googleapis
youtube-transcript
rss-parser
cheerio @mozilla/readability jsdom
next-mdx-remote remark-gfm rehype-highlight rehype-slug rehype-autolink-headings
gray-matter
next-sitemap
resend
react-hook-form @hookform/resolvers zod
@tanstack/react-query
date-fns
slugify
sharp
nanoid
next-themes
@vercel/analytics @vercel/speed-insights
@sentry/nextjs
p-limit p-retry          # concurrency control for scraping jobs
unsplash-js
```

### Dev dependencies
```
@types/node @types/react @types/react-dom @types/jsdom
eslint eslint-config-next
prettier prettier-plugin-tailwindcss
tsx
dotenv
vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom
@playwright/test
```

All of the above will be installed in a single `pnpm add` pass at scaffold time per your "no mid-dev surprises" preference.

---

## 12. Global CLI Tools (machine-wide)

To be installed once on this Mac and reused across all your future sites:

| Tool | Install via | Purpose |
|------|-------------|---------|
| `supabase` | brew | Local DB, migrations, type gen |
| `vercel` | pnpm -g | Deploy, env sync, dev |
| `typescript` | pnpm -g | Ad-hoc tsc usage |
| `tsx` | pnpm -g | Run one-off TS scripts |
| `npm-check-updates` | pnpm -g | Dependency maintenance across sites |

Already present: node 22, pnpm 10, brew, git, gh.

---

## 13. Development Milestones

| Milestone | Output | Target |
|-----------|--------|--------|
| M0 — Scaffold | Next.js app, Tailwind, shadcn, Supabase project, repo, Vercel linked | Week 1 |
| M1 — Schema + admin shell | DB migrated, RLS, admin login, empty dashboard | Week 2 |
| M2 — Public pages | Home + blog/news/video index & detail pages (seed data) | Week 3 |
| M3 — Blog automation | Cron + Claude pipeline + cover images + review queue | Week 4 |
| M4 — News automation | RSS + NewsAPI + dedupe + rewrite pipeline | Week 5 |
| M5 — Video automation | YouTube + transcript + summary pipeline | Week 6 |
| M6 — SEO hardening | Sitemap, JSON-LD, meta, OG, Search Console, IndexNow | Week 7 |
| M7 — Launch | Domain live, analytics verified, first 50 posts indexed | Week 8 |
| M8+ — Growth | Content velocity + internal linking + backlink outreach | Weeks 9–40 |
| Phase 2 kickoff | Complaint product design | Month 10+ |

---

## 14. Non-Functional Requirements

- **Performance:** LCP < 2.5s on 4G, LH SEO score ≥ 95.
- **Availability:** 99.9% (Vercel SLA is effectively this).
- **Security:**
  - RLS on every public-readable table.
  - Cron endpoints guarded by `CRON_SECRET` header check.
  - Env vars never committed; `.env.local` git-ignored.
  - CSP headers set in `next.config.js`.
  - Rate limiting on `/api/newsletter/subscribe` (via Upstash Redis if needed).
- **Legal (India-specific):**
  - Privacy Policy + Terms + Disclaimer required.
  - Intermediary guidelines: grievance officer contact required once UGC lands (Phase 2).
  - All news items must link back to original source; full bodies never republished.
  - LLM-generated content disclosed in footer + article schema.
- **Accessibility:** WCAG 2.1 AA — keyboard nav, color contrast, alt text, semantic HTML.

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Google devalues AI-generated content | SEO ranking stalls | Ground every blog in real sourced material; human-edit top 20% before publish; add editorial byline; maintain E-E-A-T signals (author bios, about page with credentials). |
| YouTube transcript API rate limits | Video pipeline breaks | Cache transcripts; fallback to `youtube-transcript` → `youtube-captions-scraper` → skip-and-retry-later. |
| NewsAPI quota exhaustion | News pipeline starves | Rotate across RSS (primary), NewsAPI (fallback), GDELT (backup). |
| LLM cost runaway | Budget blown | Prompt-level token caps; daily generation ceiling; use Haiku for summaries, Sonnet for blogs, Opus only for cornerstone content. |
| Duplicate-content penalty from news rewrites | SEO penalty | Always rewrite headline + summary; never republish body; canonical link to source; mark with `rel="canonical"` where appropriate. |
| Supabase free-tier limits | Outage at scale | Monitor usage; upgrade to Pro ($25/mo) before hitting 500MB DB or 2GB bandwidth. |
| Domain DNS / .in registrar issues | Launch delay | Buy domain and configure DNS in week 1. |
| LLM hallucinated legal info | User harm / reputational risk | System prompt forbids legal advice; add disclaimer to every generated post; human-review posts tagged `legal`. |

---

## 16. Success Metrics

### Phase 1 KPIs (tracked monthly)
- Organic sessions/month
- Indexed pages (Search Console)
- Avg. position for tracked keywords
- Newsletter subscribers
- Content velocity (posts/week)
- LLM cost / 1000 published items
- Core Web Vitals pass rate

### Phase 1 success = any month where:
- Organic sessions ≥ 5,000/day, AND
- Newsletter list ≥ 5,000, AND
- 50+ keywords on page 1

Hitting that greenlights Phase 2 design work.

---

## 17. Open Questions (to resolve before M0)

1. **Domain status:** Is `cybersathi.in` already purchased? If not, buy via a reputable .in registrar (e.g., BigRock, Namecheap) before M0.
2. **Auto-publish vs review queue:** Default posts to `pending_review` or `published`? Recommend `pending_review` for the first 2 weeks while we tune prompts, then flip to auto-publish.
3. **Editorial voice:** Who's the "author" byline? A real person (you) or a brand account ("CyberSathi Desk")? Affects E-E-A-T signals.
4. **Hindi content:** In scope for v1 or Phase 1.5?
5. **Logo / brand assets:** Available, or do we need to generate a minimal logo at scaffold?

---

## 18. Appendix — Out-of-scope for Phase 1 (explicit)

- User accounts on the public site
- Comments / community
- Paid tiers
- Mobile app
- Forum
- Live chat
- Courses / certifications

These can be revisited in Phase 2 or later.
