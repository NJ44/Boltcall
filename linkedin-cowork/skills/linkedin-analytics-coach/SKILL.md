---
name: linkedin-analytics-coach
description: Coaches users on LinkedIn analytics interpretation and performance improvement. Use when user shares analytics data, asks why a post flopped or performed well, wants to understand what's working, asks how to improve engagement or reach, or wants to know which metrics actually matter. Benchmarks performance against proven targets, identifies patterns, and outputs a prioritized improvement plan with specific next actions.
allowed-tools: Read
---

## Purpose

Turn raw LinkedIn numbers into clear decisions. Most creators look at vanity metrics (likes, followers) and miss the signals that actually drive growth. This skill cuts through the noise, benchmarks every metric against proven targets, and tells the user exactly what to do next.

## Step-by-Step Workflow

### Step 1 — Load resources
- Read `resources/metrics-guide.md` — benchmark table, key metrics, and interpretation rules
- Apply brand context from `linkedin-brand-context` skill (niche, ICP, posting frequency, current offer)

### Step 2 — Collect available data
Work with whatever the user provides:
- Screenshot of LinkedIn analytics → interpret visible numbers
- Pasted analytics data (text) → parse all metrics
- Description of performance ("my post got 40 likes but no comments") → diagnose with available context
- Multiple posts → compare and identify patterns

If data is missing, ask only for the most critical missing number: impressions or profile views.

### Step 3 — Benchmark every metric
Compare all provided metrics against the guide from `metrics-guide.md`:

| Metric | Poor | Ok | Great |
|--------|------|----|----|
| Profile-to-follower conversion | <5% | 10% | 19%+ |
| Early engagement (first 45 min) | <10 | 15-20 | 30+ |
| Monthly impressions/follower | <5x | 10x | 20x+ |
| Repost rate | <0.5% | 1% | 2%+ |
| Comment rate | <0.5% | 1% | 2%+ |
| Follower growth/month | <500 | 2,000 | 11,000+ |
| Profile views/week | <100 | 500 | 2,000+ |

For each metric: state the number, the band (Poor/Ok/Great), and the gap to the next level.

### Step 4 — Identify the root cause
Don't just report numbers — diagnose WHY they are what they are.

**Common root causes:**
- Low impressions → algorithm suppression (likely external link in post, or posting via scheduler)
- Low comments vs high likes → post is good, hook isn't provocative enough to generate debate
- High impressions, low profile visits → content not connected to the creator's identity
- High profile visits, low followers → profile not converting (Featured section or creator mode issue)
- High engagement first post, declining after → no system, no consistency, no follow-through
- Spiky growth (one viral post then nothing) → no content calendar, no format rotation

### Step 5 — Pattern analysis (if multiple posts provided)
Identify:
1. Which format performed best? (List, Carousel, Hook Stack, Story, Image)
2. Which content category had highest engagement?
3. Which day/time had best performance?
4. Which hook style got most traction?
5. What's the correlation between early engagement and total reach?

### Step 6 — Build the improvement plan
Output exactly 3 things:

**What's working** (double down on these)
**What to cut** (stop wasting time on these)
**Top 3 changes to make this week** (specific and actionable — not "post more consistently")

### Step 7 — Quick wins
Identify 1-2 changes that can be made immediately (today) that will show measurable improvement within 7 days.

## Output Format

```
LINKEDIN ANALYTICS REPORT
─────────────────────────────────
Data analyzed: [what was provided]
Date range: [if provided]

METRIC BENCHMARKS
| Metric | Your Number | Band | Gap to Great |
|--------|-------------|------|--------------|
| [metric] | [number] | [Poor/Ok/Great] | [gap] |
...

ROOT CAUSE DIAGNOSIS
[1-2 sentence diagnosis of the #1 bottleneck]

PATTERN FINDINGS (if multiple posts)
Best format: [format] — [avg engagement]
Best content category: [category]
Best hook style: [style + example]
Best day/time: [day + time]

─────────────────────────────────
WHAT'S WORKING (keep doing this)
1. [Specific finding]
2. [Specific finding]

WHAT TO CUT (stop wasting time)
1. [Specific finding]
2. [Specific finding]

TOP 3 CHANGES THIS WEEK
1. [Specific, actionable — not generic]
2. [Specific, actionable]
3. [Specific, actionable]

QUICK WIN (do this today)
[One immediate change with measurable impact in 7 days]
─────────────────────────────────
```

## Constraints

- Never say "post more consistently" without defining exactly what consistent means (frequency + days)
- Never give generic advice — every recommendation must reference the user's specific numbers
- Always diagnose the root cause before prescribing the fix
- If data is too limited to benchmark, say so clearly and ask for the one missing number that would unlock the diagnosis
- Repost rate and early engagement are the two most important signals — weight diagnosis accordingly
