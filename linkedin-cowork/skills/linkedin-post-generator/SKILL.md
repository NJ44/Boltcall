---
name: linkedin-post-generator
description: Generates hook-first, algorithm-optimized LinkedIn posts. Use when user asks to write a LinkedIn post, create content about a topic, generate post ideas, or repurpose existing content for LinkedIn. Always generates 3 hook variants to choose from. Outputs post + CTA + viral triggers + Buffer copy block.
allowed-tools: Read
---

## Purpose

Produce ready-to-publish LinkedIn posts that stop the scroll, drive reposts (the #1 algorithm signal), and convert readers to followers and leads. Every post must have brand voice baked in, hit at least 2 viral triggers, and include a topic-coupled CTA.

## Step-by-Step Workflow

### Step 1 — Load resources
Read these files before writing a single word:
- `resources/hook-formulas.md` — 12 proven hook patterns
- `resources/post-formats.md` — 6 format templates
- `resources/cta-templates.md` — CTA formula + timing rules
- `resources/viral-triggers.md` — 8 shareability triggers
- Brand context from `linkedin-brand-context` skill (ICP, voice, handle, offer)

### Step 2 — Generate 3 hook variants
Choose 3 different hook formulas from `hook-formulas.md`. Write 3 lines for each (≤225 chars total per hook). Label them Option A, B, and C with the formula type.

**Hook rules (non-negotiable):**
- Line 1: Stop the scroll — curiosity, data shock, or identity call-out
- Line 2: Build on it — identity, data, or story
- Line 3: Promise value — what they'll get if they keep reading
- Use "I" or "I've" in at least 2 of 3 hooks
- 5th-grade language — if there's a simpler word, use it
- Short sentences only in the hook

### Step 3 — Recommend one hook
Pick the strongest hook for repost potential. State clearly which one and briefly explain why.

### Step 4 — Write the full post
Using the recommended hook and the appropriate format from `post-formats.md`:
- Hook (3 lines)
- Value body (alternating short/long sentences, specific numbers, personal framing)
- No external links in the post body
- No AI phrases: "In today's world", "As we navigate", "It's important to note", "In conclusion"

### Step 5 — Write the CTA block
Using `cta-templates.md`, write the 3-part CTA:
1. Repost prompt (identity-specific)
2. Follow prompt (with handle and niche one-liner)
3. Lead magnet (topic-coupled — must relate directly to this post's subject)

### Step 6 — Run viral trigger check
Using `viral-triggers.md`, identify which 2+ triggers are engineered into this post. If fewer than 2 are present, revise the post or hook before outputting.

### Step 7 — Output block

```
📝 POST DRAFT
─────────────────────────────────
HOOK OPTION A — [formula name]
[Line 1]
[Line 2]
[Line 3]

HOOK OPTION B — [formula name]
[Line 1]
[Line 2]
[Line 3]

HOOK OPTION C — [formula name]
[Line 1]
[Line 2]
[Line 3]

★ RECOMMENDED: Option [A/B/C]
Reason: [why this hook wins for repost potential]

─────────────────────────────────
FULL POST [using recommended hook]

[Hook — 3 lines]

[Value body]

♻️ Repost if this helped [identity group].
👉 Follow @[handle] for [niche one-liner].
💡 Want [specific thing from this post]? [Action] → [place].

─────────────────────────────────
METADATA
Format used: [format name]
Hook type: [formula name]
Viral triggers: [trigger 1] + [trigger 2]
Repost likelihood: [High/Med/Low] — [reason]
Best posting time: [Tue/Wed/Thu] at [8am or 12pm]
Link rule: Add to comments or edit post at 45-min mark — never in post body
Buffer copy: [clean plain-text version ready to paste]
```

## Constraints

- Never write a post without generating 3 hook variants
- Never use more than 3 hashtags (relevant only, added at the very end)
- Never put links in the post body
- Never write generic CTAs — always topic-coupled
- Maximum post length: ~1,500 characters (LinkedIn optimal range)
