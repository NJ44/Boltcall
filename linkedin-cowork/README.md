# LinkedIn Co-Worker — Boltcall Edition

An autonomous LinkedIn content system built as a Claude Code Plugin. Brand-aware, vault-powered, Figma-connected.

---

## What It Does

| Capability | Command |
|-----------|---------|
| Generate posts (3 hook variants + Buffer copy) | `/linkedin-post` |
| Build carousels + Figma frames | `/linkedin-carousel` |
| Get strategy from your Obsidian vault | `/linkedin-strategy` |
| Write DM sequences + objection handlers | `/linkedin-dm` |
| Repurpose any content for LinkedIn | `/linkedin-repurpose` |
| Audit your LinkedIn profile (20 points) | `/linkedin-profile-audit` |
| Build a 2-week content calendar | `/linkedin-content-calendar` |
| Analyze competitor LinkedIn presence | `/linkedin-competitor-spy` |
| Score lead magnets + extract ideas | `/linkedin-analyze-lead-magnet` |

---

## Setup (4 Steps)

### Step 1: Install
```
/plugin install linkedin-cowork
```

### Step 2: Fill in Your Brand Identity
Open and complete both files:
- `skills/linkedin-brand-context/resources/brand-identity-template.md`
- `skills/linkedin-brand-context/resources/company-template.md`

These are loaded automatically before every LinkedIn task. Without them, outputs will be generic.

### Step 3: Configure MCP Servers
Edit `.mcp.json` and add your credentials:

| Server | What to Configure |
|--------|-----------------|
| **Obsidian** | Set vault path in `obsidian-mcp-tools` config |
| **Figma** | Add `FIGMA_API_TOKEN` environment variable |
| **Buffer** | Add `BUFFER_ACCESS_TOKEN` environment variable |
| **Notion** | Add `NOTION_API_KEY` environment variable |
| **Google Calendar** | OAuth flow on first use |
| **Slack** | OAuth flow on first use |
| **Playwright** | No config needed — runs headless automatically |
| **PDF-tools** | No config needed |

### Step 4: Set Your Obsidian Vault Path
The strategy skill reads your LinkedIn notes from Obsidian. Update the vault path in your obsidian MCP server config to point to your vault.

---

## Command Reference

### `/linkedin-post [topic]`
Generates a brand-voice LinkedIn post with 3 hook variants, value body, CTA, viral trigger analysis, and a Buffer-ready copy block.

**Examples:**
```
/linkedin-post "Why most SaaS founders fail at content"
/linkedin-post "My 3-year LinkedIn growth journey"
/linkedin-post repurpose: [paste blog post here]
```

**Output includes:** 3 hook options (A/B/C) with recommendation, full post body, CTA block, metadata (hook type, viral trigger, repost likelihood, best time, Buffer copy).

---

### `/linkedin-carousel [topic]`
Builds a complete LinkedIn carousel — slide content + Figma MCP instructions for brand-consistent frames at 1080×1080px.

**Examples:**
```
/linkedin-carousel "5 LinkedIn algorithm secrets nobody talks about"
/linkedin-carousel "The exact system I use to write posts in 30 min"
```

**Output includes:** 7-10 slide structure (title + value slides + CTA), per-slide copy, Figma frame creation steps using brand colors (#0B1220, #2563EB, Poppins font).

---

### `/linkedin-strategy [area]`
Strategy advice grounded in your Obsidian vault notes (Growth Playbook, AI Workflow, Platform Shift 2026, Algorithm Mechanics).

**Focus areas:** `posting` | `profile` | `engagement` | `monetization` | `algorithm` | `all`

**Examples:**
```
/linkedin-strategy engagement
/linkedin-strategy "how do I grow faster"
/linkedin-strategy all
```

---

### `/linkedin-dm [persona + context]`
Generates a 3-step DM sequence (open → value → CTA) plus pre-written replies to the 3 most likely objections.

**Examples:**
```
/linkedin-dm "CMO who commented on my AI post"
/linkedin-dm "SaaS founder, new follower, 50-person company"
/linkedin-dm "warm lead who downloaded my lead magnet"
```

---

### `/linkedin-repurpose [content]`
Detects the content type, extracts the core insight, and reformats it as a LinkedIn post or carousel recommendation.

**Supports:** Blog posts, YouTube transcripts, tweet threads, newsletter issues, podcast clips, client case studies.

**Examples:**
```
/linkedin-repurpose [paste your blog post]
/linkedin-repurpose [paste YouTube transcript]
/linkedin-repurpose [paste newsletter section]
```

---

### `/linkedin-profile-audit [profile URL or text]`
Scores your LinkedIn profile on 20 elements across visual, headline, featured section, about section, and conversion rate. Outputs a prioritized fix list with rewritten copy for each element.

**Examples:**
```
/linkedin-profile-audit https://linkedin.com/in/yourhandle
/linkedin-profile-audit [paste your about section]
```

---

### `/linkedin-content-calendar [optional theme]`
Builds a 2-week content calendar with optimal posting days/times, format rotation, content category balance, and topic-coupled CTAs. Can save to Notion.

**Examples:**
```
/linkedin-content-calendar
/linkedin-content-calendar "launching new offer next week"
/linkedin-content-calendar "I want to focus on AI content this month"
```

---

### `/linkedin-competitor-spy [LinkedIn URL]`
Uses Playwright to scrape a competitor's public LinkedIn posts. Extracts top-performing formats, hook patterns, content gaps, and "steal this" ideas adapted for your brand.

**Examples:**
```
/linkedin-competitor-spy https://linkedin.com/in/[competitor-handle]
```

---

### `/linkedin-analyze-lead-magnet [file or URL]`
Scores a lead magnet PDF on 5 dimensions (Hook, Value density, CTA quality, Format, Uniqueness), runs a gap analysis vs your brand, generates 3 adapted ideas, and logs the result to your lead magnet library.

**Examples:**
```
/linkedin-analyze-lead-magnet /path/to/leadmagnet.pdf
/linkedin-analyze-lead-magnet https://example.com/free-guide.pdf
```

---

## MCP Servers Included

| Server | Purpose |
|--------|---------|
| Obsidian | Strategy vault (Growth Playbook, AI Workflow, Platform Shift notes) |
| Figma | Carousel frames + brand-consistent visual assets |
| Buffer | Post scheduling at optimal times |
| PDF Tools | Lead magnet analysis |
| Notion | Content calendar, idea backlog, lead magnet library |
| Google Calendar | Content calendar sync + reminders |
| Slack | Team approval workflow for post drafts |
| Playwright | Competitor research (public data scraping) |

---

## Brand Context (Auto-Loaded)

The `linkedin-brand-context` skill is loaded automatically (Claude-only, not user-invocable) whenever any LinkedIn content is generated. It reads your brand files and enforces:

- Voice and tone rules
- ICP (ideal customer profile)
- Your niche one-liner
- Offer stack
- LinkedIn handle
- Color palette and visual identity

You never have to remind it who you are.

---

## Obsidian Vault Notes

The strategy advisor reads 4 reference files (offline copies of your vault notes):
- `skills/linkedin-strategy-advisor/references/growth-playbook.md` — 468K followers system
- `skills/linkedin-strategy-advisor/references/ai-workflow.md` — Lara Acosta 30-min/week AI workflow
- `skills/linkedin-strategy-advisor/references/platform-shift-2026.md` — 2026 platform changes
- `skills/linkedin-strategy-advisor/references/algorithm-mechanics.md` — Deep algorithm rules

When Obsidian MCP is connected, it also pulls live notes for the most up-to-date strategy.

---

## Key Numbers to Know

| Metric | Target |
|--------|--------|
| Profile-to-follower conversion | 19%+ |
| Early engagement (first 45 min) | 30+ reactions/comments |
| Repost rate | 2%+ of impressions |
| Posting frequency | Daily (manual only) |
| Follower growth | 11,000+/month at scale |
| Link placement | Comments or 45-min edit — never post body |
