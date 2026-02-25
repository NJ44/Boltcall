---
name: linkedin-dm-outreach
description: Generates LinkedIn DM outreach sequences. Use when user asks to write a DM, create an outreach message, follow up with someone from LinkedIn, reach out to a lead or collaborator, or build a DM sequence. Produces 3-step sequences (open → value → CTA) plus pre-written objection handler replies. Brand voice enforced throughout.
allowed-tools: Read
---

## Purpose

Write LinkedIn DMs that get replies. The key is specificity (no generic openers), value delivery before any ask (Message 2), and a single soft CTA (Message 3). Always anticipate objections and pre-write the replies so the user is never caught off-guard.

## Step-by-Step Workflow

### Step 1 — Load resources
- Read `resources/dm-sequence-templates.md` — 5 DM sequence types
- Read `resources/objection-handlers.md` — 8 objection pre-writes
- Apply brand voice from `linkedin-brand-context` skill (tone, offer, handle)

### Step 2 — Identify DM type
Classify the outreach scenario as one of the 5 types:
1. **Post Commenter** (warm) — someone who commented on a post
2. **New Follower** (warm) — someone who just followed
3. **Cold Outreach** — no prior interaction
4. **Post-Meeting Follow-up** — after a call or conversation
5. **Referral Ask** — asking for an introduction or referral

### Step 3 — Write Message 1 (Open)
- Specific — reference something real and unique about this person
- Not a pitch — no offer, no product mention
- Under 3 sentences
- Ends with a low-friction question or observation

### Step 4 — Write Message 2 (Value drop, after they reply)
- Deliver genuine value — a resource, insight, or tool relevant to them
- Zero ask — this message is purely generosity
- Under 4 sentences
- Must feel like a gift, not a setup

### Step 5 — Write Message 3 (CTA)
- Single ask only — call OR resource, never both in one message
- Soft framing — "would this be useful?" not "let me tell you about..."
- Under 3 sentences
- Give them an easy yes or no

### Step 6 — Write objection handlers
Using `resources/objection-handlers.md`, write personalized replies for the 3 most likely objections given this persona and context. Adapt the templates to the specific situation — don't use them verbatim.

## Output format

```
DM SEQUENCE: [Persona description]
Type: [sequence type]
─────────────────────────────
MESSAGE 1 — Open
[text]

─ Send. Wait for reply before sending Message 2. ─

MESSAGE 2 — Value drop (send after they reply)
[text]

─ Wait for reply. ─

MESSAGE 3 — CTA (send after second reply or 48-72h)
[text]

─────────────────────────────
OBJECTION HANDLERS

If they say "[most likely objection]":
→ [personalized reply]

If they say "[second objection]":
→ [personalized reply]

If they say "[third objection]":
→ [personalized reply]
```

## Constraints

- Message 1 must reference something specific — no generic "I saw your profile" openers
- Never pitch in Message 1 or 2
- One ask only in Message 3 — call OR resource, never both
- All 3 messages together should read like a human conversation, not a funnel
- Voice must match the user's brand voice (not formal/corporate if the brand is direct/casual)
- Objection handlers must be adapted to the persona, not copy-pasted from the templates
