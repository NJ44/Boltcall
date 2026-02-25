---
description: Analyze a competitor's LinkedIn presence. Scrape their recent public posts, identify top-performing formats, extract hook patterns, find content gaps you can own.
argument-hint: [LinkedIn profile URL — e.g. https://linkedin.com/in/handle]
allowed-tools: Read, Bash
---

You are analyzing a competitor's LinkedIn presence for the user. Follow the `linkedin-competitor-spy` workflow.

**Competitor LinkedIn URL:** $ARGUMENTS

**Step 1 — Load brand context**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` to understand the user's niche and content categories. All gap analysis must be relative to what the user should be doing — not generic.

**Step 2 — Scrape public posts**
Use the Playwright MCP server to visit the competitor's LinkedIn profile (public view, no login required) and extract their 10 most recent posts. For each post capture:
- Post type (text, image, carousel, video, article)
- Approximate hook (first 3 lines)
- Engagement signals visible (reactions, comments, reposts if visible)
- Any recurring patterns (format, topic, CTA style)

Note: This only works on public LinkedIn profiles. If the profile requires login or is private, inform the user and offer to analyze any posts they paste manually.

**Step 3 — Pattern analysis**
Identify:
1. Top 3 post formats this creator uses most
2. Hook style patterns (curiosity, data, story, confession, list tease?)
3. Content topics and categories they focus on
4. CTA patterns (what do they ask readers to do?)
5. Posting frequency (how often and when)

**Step 4 — Gap analysis**
Compare their content patterns against the user's niche and brand context. Identify:
- Content topics they own that the user doesn't cover (opportunity)
- Content topics the user covers that they don't (user's advantage)
- Hook styles the competitor uses poorly (user can do better)
- Angles or perspectives completely missing from their feed

**Step 5 — "Steal this" ideas**
Generate 5 specific post ideas the user could create, inspired by the competitor's strongest patterns but adapted to the user's voice, ICP, and offer. Each idea must be differentiated — not a copy.

**Output format:**
```
COMPETITOR ANALYSIS: [handle/name]
─────────────────────────────────
Posts analyzed: [N]
Top formats: [list]
Posting frequency: [estimate]

PATTERN BREAKDOWN
Hook styles used: [list with examples]
Content categories: [list]
CTA patterns: [list]

CONTENT GAPS (opportunities for you)
1. [Topic/angle they miss]
2. [Topic/angle they miss]
3. [Topic/angle they miss]

YOUR ADVANTAGES
1. [What you do that they don't]
2. [What you do that they don't]

5 "STEAL THIS" IDEAS (adapted for your brand)
1. [Post idea + recommended hook type]
2. [Post idea + recommended hook type]
3. [Post idea + recommended hook type]
4. [Post idea + recommended hook type]
5. [Post idea + recommended hook type]
```
