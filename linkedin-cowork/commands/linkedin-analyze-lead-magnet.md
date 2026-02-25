---
description: Score a lead magnet on 5 dimensions, extract the best ideas, generate 3 adapted versions for your brand, and log the result to your lead magnet library
argument-hint: [file path to PDF, URL, or paste content directly]
allowed-tools: Read
---

You are analyzing a lead magnet for the user. Follow the `linkedin-lead-magnet-analyzer` skill workflow.

**Lead magnet input:** $ARGUMENTS

**Step 1 — Load brand context**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` and `skills/linkedin-brand-context/resources/company-template.md` to understand the user's ICP and offer stack. The gap analysis must be relative to the user's brand, not generic.

**Step 2 — Load the lead magnet**
If a file path is provided, use the Read tool or PDF tools MCP to read the content. If a URL is provided, fetch it. If content is pasted, use it directly.

**Step 3 — Score on 5 dimensions**
Using `skills/linkedin-lead-magnet-analyzer/resources/analysis-rubric.md`, score the lead magnet (1-10 each):
1. **Hook strength** — Does the title/cover stop the scroll? Would it get clicks on LinkedIn?
2. **Value density** — Is it packed with specific, actionable insights? Or vague and generic?
3. **CTA quality** — Is there a clear, compelling next step? Is it tightly coupled to the content?
4. **Format and design** — Is it easy to skim? Would someone save or screenshot this?
5. **Uniqueness** — Is this something only this creator could make, or generic AI output?

**Step 4 — Gap analysis**
Identify 3 specific gaps between this lead magnet and what the user's brand could produce better, given their ICP, expertise, and voice.

**Step 5 — Generate 3 adapted ideas**
Create 3 lead magnet concepts the user could build, drawing inspiration from the best parts of the analyzed magnet but adapted to their niche, ICP, and offer.

**Step 6 — Log to library**
Append a summary entry to `skills/linkedin-lead-magnet-analyzer/resources/lead-magnet-library.md` in this format:
```
## [Lead Magnet Title] — [Date analyzed]
- Creator/source: [name or unknown]
- Overall score: [X/50]
- Strongest element: [what worked best]
- Biggest gap: [what they missed]
- Adapted idea: [the single best idea for user's brand]
```

**Output format:**
```
LEAD MAGNET ANALYSIS: [Title]
─────────────────────────────
Hook strength:    [X]/10 — [reason]
Value density:    [X]/10 — [reason]
CTA quality:      [X]/10 — [reason]
Format/design:    [X]/10 — [reason]
Uniqueness:       [X]/10 — [reason]
─────────────────────────────
TOTAL: [X]/50

GAP ANALYSIS vs [User's Brand]
1. [Gap 1]
2. [Gap 2]
3. [Gap 3]

3 ADAPTED IDEAS FOR YOUR BRAND
1. [Idea + why it would work for your ICP]
2. [Idea + why it would work for your ICP]
3. [Idea + why it would work for your ICP]

[Logged to lead-magnet-library.md]
```
