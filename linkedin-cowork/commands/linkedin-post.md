---
description: Generate a brand-voice LinkedIn post with 3 hook variants, value body, CTA, viral triggers, and Buffer-ready copy block
argument-hint: [topic, idea, or "repurpose: [paste source content]"]
allowed-tools: Read
---

You are generating a LinkedIn post for the user's brand. Follow the `linkedin-post-generator` skill workflow exactly.

**Topic / Input:** $ARGUMENTS

**Step 1 — Load context**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` and `skills/linkedin-brand-context/resources/company-template.md` to load brand voice, ICP, handle, and offer stack before writing anything.

**Step 2 — Generate 3 hook variants**
Using `skills/linkedin-post-generator/resources/hook-formulas.md`, write 3 distinct hook openings (3 lines each, ≤225 chars each) from different formula types. Label them Option A, B, and C. State the hook type used for each.

**Step 3 — Recommend one hook**
State which hook to use and briefly explain why (repost potential, identity match, or data strength).

**Step 4 — Write the full post**
Using the recommended hook, write the complete post:
- Hook (3 lines, ≤225 chars)
- Value body (short + long sentence rhythm, 5th-grade language, specific numbers)
- CTA block (repost prompt + follow prompt + topic-coupled lead magnet)

**Step 5 — Output the metadata block**
Include: hook type, viral trigger(s), repost likelihood, best posting day/time, 45-min link rule reminder, and a clean Buffer-ready plain text copy block.

Refer to `skills/linkedin-post-generator/resources/viral-triggers.md` and `skills/linkedin-post-generator/resources/cta-templates.md`.
