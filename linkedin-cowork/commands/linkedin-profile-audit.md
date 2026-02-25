---
description: Run a 20-point LinkedIn profile audit. Score your profile on conversion, visibility, and authority signals. Output a prioritized fix list with rewritten copy for the highest-impact elements.
argument-hint: [LinkedIn profile URL or paste your headline/about section text]
allowed-tools: Read
---

You are auditing a LinkedIn profile for the user. Follow the `linkedin-profile-optimizer` skill workflow.

**Profile input:** $ARGUMENTS

**Step 1 — Load brand context**
Read `skills/linkedin-brand-context/resources/brand-identity-template.md` and `skills/linkedin-brand-context/resources/company-template.md`. The audit recommendations must be tailored to the user's niche, ICP, and offer — not generic advice.

**Step 2 — Run the 20-point audit**
Using `skills/linkedin-profile-optimizer/resources/profile-checklist.md`, score each of the 20 elements as:
- ✅ Done well
- ⚠️ Needs improvement
- ❌ Missing or wrong

Provide a one-line diagnosis for each element that is ⚠️ or ❌.

**Step 3 — Calculate conversion estimate**
Based on the profile elements present, estimate profile-to-follower conversion rate:
- <5% = Poor | 5-10% = Below average | 10-15% = Average | 15-19% = Good | 19%+ = Great

**Step 4 — Priority fix list**
Rank the top 5 highest-impact fixes in order of effort vs. impact. For each fix:
1. What's wrong (specific)
2. Why it matters (impact on conversion or authority)
3. Rewritten version (actual copy they can paste in)

**Step 5 — Quick wins**
List any fixes that take under 5 minutes (creator mode toggle, custom URL, pronouns, etc.)

**Output format:**
```
LINKEDIN PROFILE AUDIT
─────────────────────────────────
Overall score: [X]/20 elements done
Estimated conversion rate: [X]%

AUDIT RESULTS
✅ [element] — [brief note]
⚠️ [element] — [what's weak]
❌ [element] — [what's missing]
[... all 20 elements ...]

─────────────────────────────────
TOP 5 PRIORITY FIXES

1. [Element] — [Impact: High/Med]
   Problem: [specific diagnosis]
   Why it matters: [conversion/authority impact]
   Rewritten version:
   "[New copy they can paste]"

[... fixes 2-5 ...]

─────────────────────────────────
QUICK WINS (< 5 min each)
- [fix 1]
- [fix 2]
```
