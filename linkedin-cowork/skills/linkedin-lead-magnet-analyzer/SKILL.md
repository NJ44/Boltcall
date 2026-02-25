---
name: lead-magnet-analyzer
description: Analyzes LinkedIn lead magnets (PDFs, guides, checklists, ebooks, templates, swipe files). Use when user uploads or shares a lead magnet, mentions analyzing a freebie or PDF from LinkedIn, asks what's working in their niche, or wants to build a better lead magnet. Extracts quality signals, runs gap analysis vs user's brand, generates 3 adapted ideas, and logs to the running library.
allowed-tools: Read
---

## Purpose

Score a lead magnet competitors or creators are using on LinkedIn, identify its strongest and weakest elements, and translate those insights into specific ideas the user can build for their own brand. Every analysis is logged to the lead magnet library to build a pattern database over time.

## Step-by-Step Workflow

### Step 1 — Load context
- Read `resources/analysis-rubric.md` for the 5-dimension scoring criteria
- Read `resources/lead-magnet-library.md` to check if this lead magnet has been analyzed before
- Load brand context (ICP, offer, niche) from `linkedin-brand-context` skill — gap analysis must be relative to the user's brand

### Step 2 — Read the lead magnet
- If a PDF file path is provided: use the Read tool or PDF tools MCP
- If a URL is provided: fetch it
- If content is pasted: use it directly
- If unavailable: ask the user to paste the key sections (title, intro, main sections, CTA)

### Step 3 — Score on 5 dimensions (1-10 each)

Using `resources/analysis-rubric.md`:

1. **Hook strength (1-10)**
   - Does the title stop the scroll on a LinkedIn feed?
   - Would someone click this without reading the description?
   - Is there a specific result promised?

2. **Value density (1-10)**
   - Is every page packed with actionable specifics?
   - Are there systems, frameworks, or templates — or just generic advice?
   - Would someone send this to a colleague?

3. **CTA quality (1-10)**
   - Is there a clear, single next step?
   - Is the CTA tightly coupled to the content (not generic)?
   - Is it easy to take the action?

4. **Format and design (1-10)**
   - Is it easy to skim? Are there clear headers and visual breaks?
   - Would someone screenshot individual pages?
   - Does the design match the quality of the content?

5. **Uniqueness (1-10)**
   - Could only this creator have made this?
   - Is there a point of view or proprietary framework?
   - Or does it look like a ChatGPT output?

### Step 4 — Gap analysis vs user's brand
Identify 3 specific gaps between this lead magnet and what the user's brand could produce, given their ICP, expertise, and voice.

### Step 5 — Generate 3 adapted ideas
Create 3 lead magnet concepts the user could build, drawing on the best parts of the analyzed magnet but differentiated by the user's niche, voice, and ICP.

### Step 6 — Log to library
Append a new entry to `resources/lead-magnet-library.md`.

## Output format

```
LEAD MAGNET ANALYSIS
Title: [name]
Creator/source: [name or unknown]
Date: [today]
─────────────────────────────
SCORES
Hook strength:    [X]/10 — [specific reason]
Value density:    [X]/10 — [specific reason]
CTA quality:      [X]/10 — [specific reason]
Format/design:    [X]/10 — [specific reason]
Uniqueness:       [X]/10 — [specific reason]
─────────────────────────────
TOTAL: [X]/50

WHAT WORKS BEST
[1-2 sentences on the single strongest element]

GAP ANALYSIS vs [User's Brand/Niche]
1. [Specific gap + why user could do it better]
2. [Specific gap + why user could do it better]
3. [Specific gap + why user could do it better]

3 ADAPTED IDEAS FOR YOUR BRAND
1. "[Title idea]" — [Why this would work for your ICP]
   Format: [checklist/guide/template/etc.]
   Hook: [how to tease it on LinkedIn]

2. "[Title idea]" — [Why this would work for your ICP]
   Format: [...]
   Hook: [...]

3. "[Title idea]" — [Why this would work for your ICP]
   Format: [...]
   Hook: [...]

[✓ Logged to lead-magnet-library.md]
```

## Constraints

- Never score generously — honest scoring is what makes this useful
- Uniqueness is the most important dimension — generic = low score regardless of other quality
- Every adapted idea must be meaningfully different from the analyzed magnet
- Always log to the library before ending the response
