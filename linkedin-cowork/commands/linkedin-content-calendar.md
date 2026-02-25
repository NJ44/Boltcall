---
description: Generate a 2-week LinkedIn content calendar. Balances 4 post formats, optimal posting times, content category rotation, and lead magnet CTA cycling. Can save to Notion.
argument-hint: [optional: theme, launch context, or content focus — e.g. "launching new offer next week" or "focus on AI content"]
allowed-tools: Read
---

You are building a 2-week LinkedIn content calendar for the user. Follow the `linkedin-content-calendar` skill workflow.

**Context / theme:** $ARGUMENTS

**Step 1 — Load brand context**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` and `skills/linkedin-brand-context/resources/company-template.md` to understand the user's niche, content categories, ICP, offer, and lead magnets to feature.

**Step 2 — Load schedule rules**
Read `skills/linkedin-content-calendar/resources/posting-schedule.md` and `skills/linkedin-content-calendar/resources/content-mix-formula.md` for the optimal day/time framework and format rotation rules.

**Step 3 — Build the 2-week calendar**
Create a complete 14-day calendar applying:
- Format rotation: Week 1 (List, Carousel, Hook Stack, Story) / Week 2 (Image, System Reveal, Repurpose, Personal)
- CTA rotation: Week 1 = newsletter CTA / Week 2 = lead magnet CTA
- Peak days (Tue, Wed, Thu) get the highest-reach formats
- Each post slot includes: Day, Time, Format, Hook idea, Content category, CTA type

If a theme or launch context was provided, adjust the hook ideas and CTAs to support that context without forcing every post to be promotional.

**Step 4 — Output the calendar**
Format as a clean markdown table:

```
WEEK 1
| Day | Time | Format | Hook idea | Category | CTA |
|-----|------|--------|-----------|----------|-----|
| Mon | 8am  | Hook Stack | [specific hook idea] | [niche topic] | Newsletter |
...

WEEK 2
| Day | Time | Format | Hook idea | Category | CTA |
...
```

**Step 5 — Notion sync (optional)**
If the user wants to save to Notion, ask which Notion database to use and create a row for each post slot with the same fields.

**Step 6 — Top 3 priority posts**
Identify the 3 posts in the calendar with the highest viral potential. For each, write the first 3 hook lines so they are ready to draft immediately.
