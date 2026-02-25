# LinkedIn Algorithm Mechanics — 2026

> How the LinkedIn algorithm actually works, based on creator data, platform documentation, and pattern analysis. Use this as the technical foundation for any algorithm strategy question.

---

## The 3 Signals That Matter Most (Ranked)

### 1. Reposts (Primary Signal)
A repost is the highest-value action a reader can take. When someone reposts:
- Your post is distributed to their entire follower network
- The repost itself appears as a new piece of content in their feed
- It signals to LinkedIn that your content is worth amplifying

**Target:** 2%+ repost rate (reposts / impressions)

**How to engineer reposts:**
- Name a specific identity who should repost ("♻️ Repost if this helped a fellow founder")
- Include a viral trigger (Data Surprise, Identity Reinforcement, or Social Currency)
- Make it easy to share: compact, self-contained insight

### 2. Comments (Secondary Signal)
Comments signal that content sparked genuine engagement. Long comments are worth more than short ones.

**Ranking of comment quality (highest to lowest):**
1. Multi-sentence comment (high value — person actually engaged)
2. Question in the comments (very high — signals debate/discussion)
3. Reply to another comment (creates conversation threads — amplifies)
4. Short comment ("Great post!") — low signal value
5. Emoji-only comment — lowest signal value

**Strategy:** Ask a question at the end of the post body (not the CTA) to encourage comments. Reply to every comment in the first 45 minutes to extend the engagement window.

### 3. Reactions (Tertiary Signal)
Likes and other reactions are the least powerful signal. They matter, but far less than reposts and comments.

**Important:** LinkedIn does NOT rank reaction types equally. Comments > Reactions by approximately 5:1.

---

## The 45-Minute Window

This is the most important mechanical concept in LinkedIn content strategy.

**How it works:**
1. You post at 8am
2. LinkedIn shows your post to a small sample of your followers (~5-10%)
3. LinkedIn measures engagement velocity within that sample for 45-60 minutes
4. If the engagement rate is high (30+ reactions/comments for most accounts): the algorithm expands distribution to 50-100% of followers, then to non-followers based on topic matching
5. If engagement rate is low: the post stays in the narrow initial distribution

**Implications:**
- The first 45 minutes determine 80% of your total reach
- Posting at off-peak times (6am, late evening) → your audience isn't active → low velocity → limited distribution
- Post timing is not a preference — it's a reach multiplier

**Optimal posting times:**
- Tuesday, Wednesday, Thursday: 8am-10am and 12pm-1pm (audience's local time)
- Monday: 8am (acceptable)
- Friday: 12pm (lower engagement day — save weaker posts for Friday)
- Never: 9am-11am (people in meetings)

---

## What LinkedIn Penalizes

### External Links in Post Body
- Estimated reach penalty: 50-70%
- LinkedIn's goal: keep users on the platform
- Fix: post without link → add link to comments at 45-minute mark → OR edit the post at 45 minutes to add the link

### Third-Party Scheduled Posts
- Tools like Buffer, Hootsuite, Later trigger detection
- Posts published via API (not native LinkedIn app or web) get reduced initial distribution
- Fix: post manually through LinkedIn.com or the LinkedIn mobile app

### Hashtag Stuffing
- 3 hashtags max
- Hashtags should be genuinely relevant (not just popular)
- Irrelevant hashtags don't help and may trigger spam signals

### Reposting Others' Content Without Adding Value
- Straight reposts = near-zero distribution
- To gain reach from reposting: add a substantial comment (3+ sentences) above the repost

### Low-Quality Engagement Signals
- Pods where everyone comments "great post" → algorithm detects inauthentic patterns
- Buying followers or fake engagement → suppresses organic reach
- Comment gating ("Comment SYSTEM to get the PDF") → allowed, but overuse = penalty

---

## What LinkedIn Rewards

### Native Content (No Links Out)
Full algorithmic distribution. This includes: text posts, image posts, document posts (carousels), native video, LinkedIn articles, LinkedIn newsletters.

### Document Posts (Carousels)
Highest organic reach format. LinkedIn wants native content consumption → carousel swipes = high dwell time signal.

### High-Density Value Images
"Image acts as YouTube thumbnail" posts. The image contains the value → users stop to read it → high dwell time → algorithm boost.

### Consistent Posting
The algorithm rewards accounts with posting history. Posting 5 days/week for 2 months builds an "authority signal" that gives each new post a higher starting distribution than an account that posts sporadically.

### Creator Mode
Enables Follow button (instead of Connect), LinkedIn Newsletter, and Creator Analytics. Creator Mode accounts get better post distribution in their niche based on topic affinity matching.

### Early Engagement Velocity
30+ reactions/comments in the first 45 minutes → algorithm triggers wider distribution. Build an engagement group to hit this consistently.

---

## Post Lifecycle

```
Post published (T=0)
    ↓
Algorithm shows to ~5-10% of followers
    ↓
45-minute measurement window
    ↓
If velocity ≥ threshold (30+ engagements):
    → Distribute to 50-100% of followers
    → Begin non-follower distribution via hashtag/topic matching
    → Push to relevant "LinkedIn Feeds" (your niche topics)
    ↓
If velocity < threshold:
    → Post caps out at initial distribution
    → No further algorithm amplification
```

---

## Content Decay Curve

Most LinkedIn posts see 80% of their total impressions within 24-48 hours. After that, organic reach drops steeply unless:
- A high-follower account reposts (resets the 45-minute window for their audience)
- You actively engage comments (each reply extends the notification chain)
- LinkedIn features the post in a "trending in [topic]" placement

**Implication:** There's no equivalent of the YouTube "evergreen" content effect on LinkedIn. Consistent posting is the only way to maintain sustained reach.

---

## Creator Mode: Technical Breakdown

**What it unlocks:**
- Follow button (replaces Connect) → dramatically higher conversion rate for profile visitors
- LinkedIn Newsletter (separate algorithmic distribution to followers)
- Creator Analytics (see impressions, profile views, follower demographics)
- Creator Label (shows at top of profile — "Creating content about [topics]")
- Topic tags (LinkedIn matches your profile to content topics for discovery)

**Why the Follow button matters:**
- Connect = request sent, must be accepted, connection limit = 30,000
- Follow = immediate, unlimited, no approval needed
- Profile-to-follower conversion: Connect ≈ 5% | Follow ≈ 19%

**Enable Creator Mode in:** Profile → Resources → Creator Mode → toggle on

---

## The Newsletter Flywheel

LinkedIn Newsletter is a separate algorithmic distribution system from regular posts.

**How it works:**
1. Every subscriber is notified when you publish a newsletter issue
2. LinkedIn also recommends the newsletter to non-subscribers based on topic matching
3. Newsletter articles rank in LinkedIn search AND Google search

**Why it matters:** Newsletter subscribers are a semi-owned audience. Unlike regular posts (which the algorithm may or may not show), newsletter notifications go directly to subscriber inboxes.

**Strategy:** Use the newsletter for long-form content that wouldn't perform as a regular post (detailed frameworks, in-depth analysis). Use regular posts as teasers that drive newsletter subscriptions.
