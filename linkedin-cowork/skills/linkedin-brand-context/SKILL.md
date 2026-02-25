---
name: linkedin-brand-context
description: Background brand and company knowledge for all LinkedIn content generation. Claude applies this automatically when generating any LinkedIn content — posts, carousels, DMs, calendars, profile audits, or strategy. Trigger keywords: LinkedIn, post, carousel, DM, content, brand voice, hook, CTA, lead magnet, strategy, profile, audience.
user-invocable: false
allowed-tools: Read
---

## Purpose

This skill loads and enforces brand identity for all LinkedIn content generation. It is applied automatically — users never need to invoke it. Its sole job is to ensure Claude never generates LinkedIn content without knowing who the user is, who they speak to, and what voice to use.

## Activation

Apply this skill whenever the user's request involves any LinkedIn output: posts, carousels, DMs, strategy advice, profile copy, content calendar, lead magnets, or competitor analysis.

## Step-by-Step Instructions

1. **Read brand files**
   - Read `resources/brand-identity-template.md` — voice, tone, LinkedIn handle, niche one-liner, ICP
   - Read `resources/company-template.md` — company name, product/service, value prop, offer stack

2. **Extract and hold in context:**
   - LinkedIn handle (e.g., @handle)
   - Niche one-liner (the word/phrase this person "owns" in their audience's mind)
   - ICP description (who the ideal follower/customer is)
   - Brand voice rules (what to say and what to avoid)
   - Offer stack (what they sell, newsletter name, lead magnets available)
   - Visual identity (brand colors: primary #0B1220, blue #2563EB, sky #93C5FD — for carousel/image work)

3. **Enforce in all LinkedIn outputs:**
   - Every hook must speak to the ICP
   - Voice must match the defined tone (not generic, not AI-sounding)
   - CTAs must reference real lead magnets and the real newsletter
   - The handle must appear in all follow CTAs
   - Color tokens must be used for all Figma/visual outputs

## Constraints

- Never generate LinkedIn content before reading the brand files
- If the brand files do not exist or are blank templates, stop and ask the user to fill them in before proceeding
- Never use generic CTAs like "join my newsletter" — always use the specific newsletter name and lead magnet from the brand files
- Brand voice overrides any default Claude writing style
