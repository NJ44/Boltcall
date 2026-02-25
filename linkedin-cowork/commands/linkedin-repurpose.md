---
description: Repurpose any existing content (blog post, YouTube transcript, tweet thread, podcast clip, newsletter) into a LinkedIn post or carousel. Preserves the core insight, rewrites for the LinkedIn algorithm.
argument-hint: [paste content directly, or provide file path / URL]
allowed-tools: Read
---

You are repurposing existing content for LinkedIn. Follow the `linkedin-content-repurposer` skill workflow.

**Source content:** $ARGUMENTS

**Step 1 — Load brand context**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` to apply the user's voice, tone, and ICP framing to the repurposed output.

**Step 2 — Detect content type**
Identify what type of content was provided, using `skills/linkedin-content-repurposer/resources/repurpose-matrix.md`:
- Blog post → extract contrarian claim or main framework
- YouTube transcript → pull story + system reveal
- Tweet thread → compress to 3-line hook stack
- Newsletter issue → extract core framework or tip
- Podcast clip → pull quote + insight
- LinkedIn comment → expand the key insight
- Client case study → extract result + method
- Book/article takeaway → reframe through user's lens

**Step 3 — Extract the core insight**
Identify the single most valuable, shareable idea in the source content. This is what becomes the LinkedIn post — not a summary, but the sharpest point.

**Step 4 — Recommend output format**
Based on the content type and insight extracted, recommend the best LinkedIn format (post or carousel) and explain why.

**Step 5 — Create the LinkedIn output**
If post: follow the `linkedin-post-generator` skill — 3 hook variants, body, CTA, metadata.
If carousel: follow the `linkedin-carousel-creator` skill — slide structure + Figma instructions.

Always run the result through the viral triggers check (`skills/linkedin-post-generator/resources/viral-triggers.md`). Every repurposed piece must hit at least 2 viral triggers.

**Important rules:**
- Never summarize the source — extract and amplify the single sharpest insight
- Rewrite entirely in the user's brand voice — no phrasing from the original should survive
- Add the 5th-grade language test: if a word can be simpler, make it simpler
- The output should feel like it came from the user's personal experience, not a repurpose
