# Landing page components

Each subfolder is one section of the CyberSathi.in home page, in rough top-to-bottom order:

1. `navbar/` — top navigation bar
2. `hero/` — headline, subheadline, primary CTA
3. `categories/` — "What we cover" (Phishing, Ransomware, UPI fraud, etc.)
4. `latest-blogs/` — grid/list of newest blog posts
5. `trending-news/` — latest scraped cyber-crime news
6. `featured-videos/` — curated YouTube videos w/ summaries
7. `stats/` — trust/scale numbers (optional, for social proof)
8. `newsletter-cta/` — email capture before the footer
9. `footer/` — links, legal, social

## Convention

Paste the 21st.dev component code for each section into the `PASTE_CODE_HERE.txt` file inside that section's folder. Once a section has real code, we'll convert `PASTE_CODE_HERE.txt` → a real `.tsx` component and wire it into the Next.js `app/page.tsx`.

If a section doesn't need a 21st.dev component (e.g., you want a plain custom one), just leave the txt file empty and tell me — I'll build it from scratch in the right style.
