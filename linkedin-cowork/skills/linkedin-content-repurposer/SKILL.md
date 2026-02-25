---
name: linkedin-content-repurposer
description: Repurposes existing content into LinkedIn-optimized posts or carousels. Use when user pastes a blog post, newsletter, YouTube transcript, tweet thread, podcast clip, client case study, or any long-form content and wants it turned into a LinkedIn post or carousel. Detects content type, extracts the sharpest insight, applies a hook formula, and reformats for the LinkedIn algorithm.
allowed-tools: Read
---

## Purpose

Turn existing content — wherever it came from — into LinkedIn posts or carousels without losing the core insight. The output must feel like it came from the user's personal experience, not a repurpose. The source content is the raw material, not the template.

## Step-by-Step Workflow

### Step 1 — Load resources
- Read `resources/repurpose-matrix.md` — content type → extraction method → LinkedIn format mapping
- Apply brand voice from `linkedin-brand-context` skill
- Apply hook formulas from `linkedin-post-generator` skill resources

### Step 2 — Detect content type
Identify what was provided using the repurpose matrix:
- Blog post
- YouTube transcript
- Tweet thread
- Newsletter issue
- Podcast clip (transcript)
- LinkedIn comment (expanding into full post)
- Client case study
- Book/article takeaway

### Step 3 — Extract the sharpest insight
Read the entire source content. Identify the single most valuable, most shareable, most surprising idea. This becomes the LinkedIn content — not a summary.

Rules for extraction:
- Contrarian claims make the best hooks
- Specific results ("I achieved X in Y timeframe") outperform general frameworks
- Counter-intuitive data points are more shareable than expected data points
- A story beat (the moment something changed) beats a list of tips

### Step 4 — Recommend output format
Based on the content type and insight extracted, using the repurpose matrix, recommend:
- **Post** (if the insight works as a single sharp argument or story)
- **Carousel** (if the insight contains 5+ discrete points worth visualizing)

Explain the recommendation in one sentence.

### Step 5 — Create the LinkedIn output
**If post:** Apply the full `linkedin-post-generator` workflow:
- 3 hook variants (A/B/C)
- Full post body in brand voice
- CTA block + viral triggers + metadata

**If carousel:** Apply the full `linkedin-carousel-creator` workflow:
- Slide structure
- Per-slide copy
- Figma instructions
- Accompanying post text

### Step 6 — Humanization check
Before outputting, check the final draft against these rules:
- Does any phrasing survive from the source? → Rewrite it
- Does any sentence sound like it was written by AI? → Rewrite it
- Can any word be simpler? → Make it simpler
- Is there one detail only the user could have known? → Add it

## Constraints

- Never summarize the source — extract and amplify the single sharpest point
- The output must pass the "did a human write this?" test
- Source content attribution: never credit or link to the original source in the LinkedIn post — repurpose means make it yours
- Always run the viral trigger check — minimum 2 triggers per output
