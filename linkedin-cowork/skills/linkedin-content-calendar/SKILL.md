---
name: linkedin-content-calendar
description: Builds and manages a 2-week LinkedIn content calendar. Use when user asks for a content plan, posting schedule, what to post this week, help organizing content ideas, or wants a structured approach to content creation. Balances 4 post formats, optimal posting days/times, content category rotation, and topic-coupled CTA cycling. Can save to Notion.
allowed-tools: Read
---

## Purpose

Give the user a complete, executable 2-week content plan that removes the daily "what should I post?" decision. Every slot is filled with a specific hook idea, optimal format, and CTA direction — so the only task remaining is writing.

## Step-by-Step Workflow

### Step 1 — Load resources
- Read `resources/posting-schedule.md` — optimal days, times, format-to-day mapping
- Read `resources/content-mix-formula.md` — format rotation and CTA cycling rules
- Apply brand context: niche topics, ICP, offer, lead magnets from `linkedin-brand-context` skill

### Step 2 — Understand context
Note any theme, launch, or focus provided by the user. Incorporate it as context that shapes hook ideas and CTAs — but don't make every post promotional.

**Rule:** A 2-week calendar should have at most 2 posts that directly mention a product or offer. The rest build authority and trust.

### Step 3 — Content categories
Using the user's niche and brand context, define 3-4 content categories to rotate through:
- Examples: Systems, Leadership, Growth, AI, Hiring, Revenue, Mindset, Behind-the-scenes
- Each post slot gets one category

### Step 4 — Build Week 1
Apply the format rotation from `content-mix-formula.md`:
- Mon: Hook Stack — category + hook idea
- Tue: Long-form List — category + hook idea (peak day → highest reach format)
- Wed: Personal Story — category + hook idea
- Thu: Carousel — category + hook idea (peak day → second highest reach)
- Fri: Repurpose or Hot take — category + hook idea

All at 8am or 12pm. No 9-11am (people in meetings).

CTA direction for Week 1: Newsletter CTA on all posts.

### Step 5 — Build Week 2
- Mon: Long-form Image — category + hook idea
- Tue: Deep-work System Reveal — category + hook idea (peak day)
- Wed: Repurpose — category + source (blog post, video, etc.)
- Thu: Hook Stack — category + hook idea (peak day)
- Fri: Personal Story — category + hook idea

CTA direction for Week 2: Lead magnet CTA on all posts.

### Step 6 — Output the calendar
Format as a clean markdown table for each week.

### Step 7 — Top 3 priority posts
Flag the 3 highest-potential posts in the 2-week plan. For each, write the first 3 hook lines so they're ready to draft immediately.

### Step 8 — Notion sync (if requested)
If the user wants to save to Notion, create rows in their content calendar database with: Day, Time, Format, Hook idea, Category, CTA type, Status (Draft).

## Output format

```
LINKEDIN CONTENT CALENDAR — 2 WEEKS
Context: [theme/launch if provided]
Content categories: [Category 1] | [Category 2] | [Category 3] | [Category 4]

─────────────────────────────────
WEEK 1 — CTA theme: Newsletter

| Day | Time | Format | Hook idea | Category | CTA |
|-----|------|--------|-----------|----------|-----|
| Mon Feb 24 | 8am | Hook Stack | [specific hook idea] | [category] | Newsletter |
| Tue Feb 25 | 8am | Long-form List | [specific hook idea] | [category] | Newsletter |
| Wed Feb 26 | 12pm | Personal Story | [specific hook idea] | [category] | Newsletter |
| Thu Feb 27 | 8am | Carousel | [specific hook idea] | [category] | Newsletter |
| Fri Feb 28 | 12pm | Repurpose | [source idea] | [category] | Newsletter |

─────────────────────────────────
WEEK 2 — CTA theme: Lead Magnet

| Day | Time | Format | Hook idea | Category | CTA |
| ... (same structure) ... |

─────────────────────────────────
TOP 3 PRIORITY POSTS (start here)

1. [Day + format]
Hook: [3 lines written out and ready to use]
Why: [repost potential]

2. [Day + format]
Hook: [3 lines ready]
Why: [...]

3. [Day + format]
Hook: [3 lines ready]
Why: [...]
```

## Constraints

- At most 2 promotional posts (mentioning offer directly) in any 2-week period
- Never recommend third-party scheduling tools — LinkedIn penalizes them
- All hook ideas must be specific to the user's niche — no generic placeholders
- Peak days (Tue, Thu) always get the highest-reach formats (List, Carousel)
