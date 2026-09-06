# SEO Weekly Audit — 2026-09-06T22:14:19.681Z

**Regressions:** 4

## Regressions vs previous baseline
- pricing: LCP 2878ms → 5571ms (+2693ms)
- about: H1 shortened 14 → 14 chars (semantic H1 regression?)
- about: LCP 2894ms → 4553ms (+1659ms)
- compare-gohighlevel: LCP 3774ms → 6017ms (+2243ms)

## Sitemap
- URL count: 147
- Newest lastmod: 2026-09-04

## Robots / llms.txt
- Robots: 200, sitemap declared: true
- AI bots allowed (6): GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai
- llms.txt: 200, last updated 2026-08-29, mentions law firms: true

## Bad-route guards
- /blog/definitely-not-a-real-slug-weekly-probe/ expected 404, actual 404 — OK
- /features expected 301, actual 301 — OK
- /how-it-works expected 301, actual 301 — OK
- /faq expected 301, actual 301 — OK

## Per-page snapshot
| Page | Status | LCP (ms) | H1 chars | Schema blocks | Parse errs | WebSite×n | Org×n |
|---|---:|---:|---:|---:|---:|---:|---:|
| home | 200 | 3647 | 160 | 11 | 0 | 1 | 2 |
| pricing | 200 | 5571 | 38 | 19 | 0 | 1 | 1 |
| about | 200 | 4553 | 14 | 11 | 0 | 1 | 1 |
| industries-lawyer | 200 | 2900 | 75 | 9 | 0 | 1 | 0 |
| features-ai-receptionist | 200 | 4156 | 38 | 9 | 0 | 1 | 0 |
| compare-podium | 200 | 2286 | 69 | 12 | 0 | 1 | 0 |
| compare-smith-ai | 200 | 4620 | 72 | 14 | 0 | 1 | 0 |
| compare-gohighlevel | 200 | 6017 | 63 | 12 | 0 | 1 | 0 |
| blog-index | 200 | 3425 | 29 | 13 | 0 | 1 | 1 |
| blog-top10 | 200 | 4633 | 65 | 14 | 0 | 1 | 1 |
| blog-law-firms | 200 | 4296 | 27 | 14 | 0 | 1 | 1 |
| tools-lawyer-calc | 200 | 4440 | 41 | 10 | 0 | 1 | 0 |
| integrations-squarespace | 200 | 1459 | 32 | 4 | 0 | 1 | 0 |