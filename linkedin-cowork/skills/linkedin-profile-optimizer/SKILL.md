---
name: linkedin-profile-optimizer
description: Audits and rewrites LinkedIn profiles for maximum conversion and authority. Use when user asks to improve their profile, audit their LinkedIn page, optimize for more followers, write a better headline or about section, or asks why their profile isn't converting visitors to followers. Scores 20 elements and outputs a prioritized fix list with rewritten copy for the highest-impact elements.
allowed-tools: Read
---

## Purpose

Turn a LinkedIn profile from a résumé into a sales machine. The target is 19%+ profile-to-follower conversion rate. Every element of the profile either helps or hurts that conversion — this skill identifies which is which and rewrites the worst offenders.

## Step-by-Step Workflow

### Step 1 — Load resources
- Read `resources/profile-checklist.md` — 20-point audit rubric
- Apply brand context from `linkedin-brand-context` skill (ICP, niche one-liner, offer, handle)

### Step 2 — Assess available input
Work with whatever the user provides:
- LinkedIn profile URL → note that Playwright MCP can scrape it, or ask user to paste sections
- Pasted headline/about section → score available elements, flag unknown elements
- Full profile text → score all 20 elements

### Step 3 — Run the 20-point audit
Score each element from `profile-checklist.md`:
- ✅ Done well — brief note on what works
- ⚠️ Needs improvement — specific diagnosis
- ❌ Missing or wrong — what's absent and why it costs conversion

### Step 4 — Estimate conversion rate
Based on scored elements, estimate profile-to-follower conversion:
- 0-5 elements done well → <5% (Poor)
- 6-10 → 5-10% (Below average)
- 11-14 → 10-15% (Average)
- 15-17 → 15-19% (Good)
- 18-20 → 19%+ (Great)

### Step 5 — Priority fix list
Rank the top 5 highest-impact fixes by conversion leverage. For each:
1. What's wrong (specific diagnosis)
2. Why it matters (conversion impact)
3. Rewritten version (actual copy to paste in)

**Highest-impact elements (fix these first):**
1. Headline (every profile visitor sees this)
2. Featured section (drives newsletter + lead magnet conversions)
3. Banner with CTA (visible before scroll)
4. About section opening line (hook or forfeit)
5. Creator mode status (enables Follow button — 5% → 19% conversion)

### Step 6 — Quick wins list
Identify all fixes that take under 5 minutes (toggles, URL customization, pronouns, section completion).

### Step 7 — Rewrite key copy
For any ⚠️ or ❌ elements in the top 5, write the actual replacement copy the user can paste directly:
- New headline (≤220 chars)
- New about section opening line (hook — not "I am a...")
- New CTA text for banner

## Conversion targets from vault
- Great headline: owns one word + value prop for ICP (e.g., "Systems | Helping founders scale with organic content")
- Featured section: 2 items max — Newsletter + Core product/lead magnet, with irresistible thumbnails
- Creator mode: enables Follow button — direct cause of higher conversion rates

## Constraints

- Never write a generic headline — must reflect the user's specific niche one-liner
- About section opening line must be a hook (curiosity, data, or story) — never "I am a [title]"
- All rewritten copy must sound like the user's brand voice, not template language
- Flag any profile element that could hurt search visibility or trust
