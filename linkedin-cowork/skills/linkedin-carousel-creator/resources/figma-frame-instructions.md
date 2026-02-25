# Figma Frame Instructions — Carousel Creation via Figma MCP

> Step-by-step workflow for creating LinkedIn carousel frames in Figma using the Figma MCP server. Run this workflow after the slide content has been written.

---

## Prerequisites

- Figma MCP server must be connected (`figma` in `.mcp.json`)
- Brand token file must be accessible
- Slide content (headlines + body) must be finalized before running

---

## Workflow

### Step 1 — Load Brand Context

Use `mcp__fe84a125-b3ab-464f-bc95-3cd9c313782c__get_design_context` or `mcp__Figma__get_design_context` to load any existing brand token file or design system from the connected Figma workspace.

If no existing file: use the brand tokens below directly.

**Brand Tokens (hard-coded fallback):**
```
Background:    #0B1220
Brand blue:    #2563EB
Dark blue:     #1E40AF
Sky accent:    #93C5FD
White text:    #FFFFFF
Muted text:    #94A3B8

Font:          Poppins
Title (Slide 1): Bold, 48-56px
Section heads:   Bold, 36px
Slide numbers:   Bold, 20px, sky (#93C5FD)
Body text:       Regular, 20px
CTA text:        Bold, 40px

Frame size:    1080 × 1080px
```

---

### Step 2 — Create Figma File and Frames

Create a new Figma file with [N] frames, where N = number of slides.

**Frame naming convention:**
```
Slide 01 — Title
Slide 02 — [Insight headline]
Slide 03 — [Insight headline]
...
Slide [N] — CTA
```

All frames: 1080×1080px, auto-layout preferred for text alignment.

---

### Step 3 — Build Slide 1 (Title)

```
Frame background: Fill #0B1220

Elements to add:
1. Headline text layer
   - Font: Poppins Bold
   - Size: 48-56px
   - Color: #FFFFFF
   - Position: Vertically centered, 80px horizontal padding
   - Content: [Post hook headline — 1-2 lines]

2. Subheadline text layer
   - Font: Poppins Regular
   - Size: 24px
   - Color: #93C5FD
   - Position: Below headline, 16px gap
   - Content: [Subheadline text]

3. Accent line (bottom)
   - Rectangle: 1080px wide × 4px tall
   - Color: #2563EB
   - Position: Bottom of frame

4. Handle / Brand mark [optional]
   - Font: Poppins Regular
   - Size: 16px
   - Color: #94A3B8
   - Position: Bottom right, 24px from edge
   - Content: @[handle]
```

---

### Step 4 — Build Value Slides (Slides 2 through N-1)

Repeat this structure for each value slide:

```
Frame background: Fill #0B1220

Elements to add:
1. Slide number
   - Font: Poppins Bold
   - Size: 20px
   - Color: #93C5FD
   - Position: Top left, 60px from top, 60px from left
   - Content: "0[N]" (e.g., "02", "03")

2. Insight headline
   - Font: Poppins Bold
   - Size: 36px
   - Color: #FFFFFF
   - Position: Below slide number, 24px gap
   - Width: 80% of frame (center margin)
   - Content: [Insight headline for this slide]

3. Body text / bullets
   - Font: Poppins Regular
   - Size: 20px
   - Color: #FFFFFF (or #94A3B8 for secondary points)
   - Position: Below headline, 32px gap
   - Bullet style: → arrow or — dash (insert as text prefix)
   - Max 3 bullets, 1 line each

4. Accent line (bottom — consistent brand element)
   - Rectangle: 1080px wide × 4px tall
   - Color: #2563EB
   - Position: Bottom of frame
```

---

### Step 5 — Build Slide N (CTA)

```
Frame background: Fill #2563EB (color flip — breaks visual rhythm deliberately)

Elements to add:
1. CTA headline
   - Font: Poppins Bold
   - Size: 40px
   - Color: #FFFFFF
   - Position: Center of frame
   - Content: "Follow @[handle]"

2. Niche line
   - Font: Poppins Regular
   - Size: 28px
   - Color: #FFFFFF
   - Position: Below headline, 16px gap
   - Content: "for [niche one-liner]"

3. Newsletter URL
   - Font: Poppins Regular
   - Size: 20px
   - Color: #FFFFFF (slightly muted — 80% opacity)
   - Position: Below niche line, 32px gap
   - Content: "[Newsletter Name] → [URL]"

4. Headshot [optional]
   - Circle crop, 120×120px
   - Position: Bottom right, 40px from edges
```

---

### Step 6 — Export

```
Select all frames
Export settings:
- Format: PNG
- Scale: 2x (2160×2160 px output)
- File naming: "linkedin-carousel-[topic]-slide-01.png", etc.

After PNG export:
- Compile all PNGs into a single PDF (maintain order)
- PDF is what uploads to LinkedIn as a "document post"
```

---

### Step 7 — Upload to LinkedIn

```
On LinkedIn:
1. Click "Start a post"
2. Click the document icon (📄) — NOT the image icon
3. Upload the PDF file
4. LinkedIn will render each page as a carousel slide
5. Add the accompanying post text as the caption
6. Post manually — do not use a scheduler
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Uploading images instead of PDF | Compile to PDF first — document format gets algorithm boost |
| Using landscape (16:9) frames | Always 1080×1080 square |
| Too much text per slide | Max 40 words per slide |
| Inconsistent fonts across slides | Set Poppins as default font before starting |
| No CTA on final slide | Always end with follow + newsletter — that slide is your conversion machine |
| Link in post body | Add to first comment at 45-minute mark |
