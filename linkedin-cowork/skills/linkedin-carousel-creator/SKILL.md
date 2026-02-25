---
name: linkedin-carousel-creator
description: Creates LinkedIn carousel post structure and Figma frames. Use when user asks for a carousel, slides, image post series, visual content, or a PDF post. Outputs slide-by-slide content plus Figma MCP instructions for brand-consistent 1080x1080px frames.
allowed-tools: Read
---

## Purpose

Produce a complete LinkedIn carousel — slide content AND Figma frame creation instructions — that is ready to upload as a PDF post. Carousels (document posts) are the highest organic reach format on LinkedIn in 2026. Every slide must be visually self-contained and work as a standalone screenshot.

## Step-by-Step Workflow

### Step 1 — Load resources
- Read `resources/carousel-structure.md` — slide blueprint + format rules
- Read `resources/figma-frame-instructions.md` — Figma MCP creation steps
- Apply brand context: #0B1220 (background), #2563EB (accent), #FFFFFF (text), #93C5FD (slide numbers), Poppins font

### Step 2 — Content architecture
Design the carousel structure:
- **Slide 1 (Title):** Hook headline (≤8 words) + supporting subheadline (≤15 words)
- **Slides 2-8 (Value):** One insight per slide. Numbered. Short headline (≤6 words) + 2-3 bullet points (≤12 words each). Every slide self-contained.
- **Final slide (CTA):** "Follow @[handle] for [niche one-liner]." + Newsletter CTA + optional headshot

### Step 3 — Write all slide copy
Write every slide in full, including:
- Title text for each slide
- Bullet text for each value slide
- CTA text for the final slide
- Total word count per slide must stay ≤40 words

### Step 4 — Figma MCP instructions
Output step-by-step Figma creation instructions from `figma-frame-instructions.md`. Specify exact values:
- Frame size: 1080×1080px each
- Background fills, text colors, font sizes
- Accent element placement
- Export settings (PNG at 2x)
- Buffer upload format (document post)

### Step 5 — Accompanying post text
Write the LinkedIn post text that goes with the carousel upload:
- Hook (3 lines) that teases the carousel without giving it away
- "Swipe to see all [N] →" or equivalent CTA
- Full CTA block (repost + follow + lead magnet)

### Output format

```
CAROUSEL: [Title]
[N] slides

─────────────────────────────────
SLIDE CONTENT

SLIDE 1 — TITLE
Headline: [text]
Subheadline: [text]

SLIDE 2 — [Insight name]
Headline: [text]
• [Bullet 1]
• [Bullet 2]
• [Bullet 3]

[... all slides ...]

SLIDE [N] — CTA
Follow @[handle] for [niche one-liner].
[Newsletter CTA]

─────────────────────────────────
FIGMA MCP INSTRUCTIONS
[Step-by-step from figma-frame-instructions.md]

─────────────────────────────────
LINKEDIN POST TEXT (upload with carousel)
[Hook 3 lines]
Swipe → [value tease]
♻️ [Repost CTA] | 👉 Follow @[handle] | 💡 [Lead magnet CTA]
```

## Constraints

- Minimum 7 slides, maximum 10
- Maximum 40 words per slide
- Every slide must stand alone as a screenshot
- Square format only (1080×1080)
- No external links on any slide
