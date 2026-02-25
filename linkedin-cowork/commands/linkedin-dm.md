---
description: Generate a 3-step LinkedIn DM sequence (open → value → CTA) plus pre-written objection handler replies for any outreach scenario
argument-hint: [persona + context: e.g. "CMO who commented on my AI post" or "new follower, SaaS founder, 50-person team"]
allowed-tools: Read
---

You are writing LinkedIn DM outreach for the user's brand. Follow the `linkedin-dm-outreach` skill workflow.

**Target persona / context:** $ARGUMENTS

**Step 1 — Load brand voice**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` and `skills/linkedin-brand-context/resources/company-template.md` to apply the correct tone, offer, and ICP framing to the DM sequence.

**Step 2 — Select DM type**
Using `skills/linkedin-dm-outreach/resources/dm-sequence-templates.md`, identify which of the 5 DM types applies:
- Post Commenter (warm)
- New Follower (warm)
- Cold Outreach
- Post-Meeting Follow-up
- Referral Ask

**Step 3 — Write the 3-step sequence**
Write all 3 DM messages in full:
- **Message 1 (Open):** Specific, personal, no pitch. Reference something real about them. ≤3 sentences.
- **Message 2 (Value, after they reply):** Deliver a useful insight or resource with no ask. ≤4 sentences.
- **Message 3 (CTA):** Soft, single ask. One thing only — call OR resource, not both. ≤3 sentences.

**Step 4 — Pre-write objection handlers**
Using `skills/linkedin-dm-outreach/resources/objection-handlers.md`, write personalized replies for the 3 most likely objections given this persona and context.

**Format output as:**
```
MESSAGE 1 — [Open]
[text]

MESSAGE 2 — [Value drop, after reply]
[text]

MESSAGE 3 — [CTA]
[text]

OBJECTION HANDLERS
If they say "[objection 1]":
→ [reply]

If they say "[objection 2]":
→ [reply]

If they say "[objection 3]":
→ [reply]
```
