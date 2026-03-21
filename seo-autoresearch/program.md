# SEO Autoresearch

Autonomous SEO/AEO optimization loop for boltcall.org.
Inspired by Karpathy's autoresearch — same loop, applied to web pages instead of ML models.

## How It Works

The agent scores every page on boltcall.org (0-100), then optimizes the lowest-scoring pages in a loop. Changes that improve the score are kept. Changes that don't are reverted.

## Setup

1. **Read the evaluation harness**: `measure.py` is FIXED. Do not modify. It scores pages across 10 dimensions.
2. **Read results.tsv**: See what experiments have been run.
3. **Run baseline**: `python measure.py` to score all pages.
4. **Pick the lowest-scoring page** and start optimizing.

## The 10 Scoring Dimensions (0-10 each, 100 total)

1. **Title Tag** — exists, 20-60 chars, has brand + keyword
2. **Meta Description** — exists, 80-155 chars, has brand + CTA
3. **H1 Tag** — exactly one, has keyword
4. **Heading Structure** — 3+ H2s, 2+ H3s, question-based headings
5. **AEO Answer Block** — 40-60 word definition paragraph near top
6. **FAQ Section** — FAQPage schema + 3+ question H3s
7. **Schema Markup** — Article, Organization, BreadcrumbList, FAQPage
8. **Internal Links** — 5+ unique links, links to key pages
9. **Content Quality** — 1500+ words, brand mentions, stats/numbers
10. **CTA** — clear CTA text + link to /signup or /pricing

## Experimentation

**The file you modify**: React TSX blog components in `src/pages/`.

**What you CAN do:**
- Add/improve AEO answer blocks (40-60 word definitions)
- Add FAQPage JSON-LD schema
- Add question-based H3 headings
- Add internal links to relevant pages
- Add statistics with sources
- Improve titles and meta descriptions
- Add BreadcrumbList schema
- Ensure brand "Boltcall" in first + last paragraphs

**What you CANNOT do:**
- Modify `measure.py` (it's the fixed evaluation harness)
- Change the scoring algorithm
- Delete existing content (only add/improve)
- Break the TypeScript build

**To run an experiment:**
```bash
cd ~/Desktop/Boltcall_website/Boltcall
python seo-autoresearch/measure.py  # Score all pages
```

**To score a single page:**
```python
from seo-autoresearch.measure import score_page
result = score_page("https://boltcall.org/blog/some-page")
```

## Logging Results

Log to `seo-autoresearch/results.tsv` (tab-separated):

```
commit	page	score_before	score_after	status	description
```

- **commit**: git short hash (7 chars)
- **page**: URL path (e.g., /blog/ai-vs-human-receptionist)
- **score_before**: total score before change (0-100)
- **score_after**: total score after change (0-100)
- **status**: `keep` (improved), `discard` (same/worse), `crash` (build broke)
- **description**: what was changed

## The Experiment Loop

LOOP:
1. Run `python seo-autoresearch/measure.py` to score all pages
2. Pick the **lowest-scoring page**
3. Read its issues list — each issue tells you exactly what's missing
4. Edit the TSX component to fix the top 2-3 issues
5. Verify build: `npx tsc -b` (must pass)
6. git commit the change
7. Re-score the page: `python -c "from measure import score_page; print(score_page('https://boltcall.org/...'))"` — NOTE: for local testing, build and serve locally first
8. Log to results.tsv
9. If score improved → keep commit, move to next page
10. If score same/worse → git reset, try different approach
11. After all pages score 70+, start second pass targeting 85+
12. NEVER STOP — keep optimizing until manually interrupted

## Integration with Daily Monitor

The n8n "AIOS: SEO Daily Monitor" workflow runs at 7AM daily and tracks:
- Site health (PageSpeed)
- AEO citations (Perplexity queries)
- Experiment status (from seo_experiments Supabase table)

After running the autoresearch loop, deploy with:
```bash
npm run build:prerender
netlify deploy --prod --dir=dist --no-build
```

## Goal

Get every page to 85+/100. Current average is unknown (run baseline first).
Pages scoring 85+ have all AEO signals that make them citable by AI engines.
