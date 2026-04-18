# Public content page components

21st.dev component staging for the reader-facing blog / news / video pages (Phase 1 M2).

## Priority (drop these first)

1. `blog-card/` — grid/list card for the blog index (cover image, category chip, title, excerpt, author + date)
2. `blog-detail/` — article template (prose body, sticky TOC slot, author byline, share row)
3. `news-card/` — compact horizontal item (source logo, title, summary, timestamp, "read on source" link)
4. `video-card/` — YouTube thumb with duration overlay + play icon, channel, title

## Supporting

5. `breadcrumb/` — detail-page nav crumbs (also SEO per PRD §4.5)
6. `pagination/` — index-page pager
7. `category-chips/` — horizontal scrollable filter pills

## Nice-to-have

8. `toc/` — sticky table of contents sidebar for blog detail
9. `related-articles/` — 3-up "read next" block at bottom of detail pages
10. `share-buttons/` — X / WhatsApp / LinkedIn / copy-link row

## Convention

Paste the 21st.dev component code into the `PASTE_CODE_HERE.txt` file inside each folder. Once populated, it'll be converted into a real `.tsx` component under `src/components/content/` and wired into the Next.js pages.

If a component doesn't need a 21st.dev design (e.g. breadcrumb / pagination — shadcn has decent ones), leave the txt empty and I'll build it in the existing style.
