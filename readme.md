# Social Listening

> Know what the world is saying. Act on it — without leaving HighLevel.

**Status:** In Design · Figma revamp in progress · Data provider: Infegy · Beta target: Q2 2026

---

## The Problem

Social Planner today enables publishing and engagement tracking on owned content — but agencies have zero visibility into external conversations. That means:

- **Fragmented workflows** — switching between Brand24 for listening, Hootsuite/Sprout for publishing, and native dashboards for analytics
- **Delayed action** — insights must be manually interpreted before any publishing decision can be made
- **Missed opportunities** — without trend awareness, agencies publish less frequently and reactively

---

## What We're Building

A unified listen-to-publish loop, built directly into HighLevel:

```
Listen → Understand → Act → Measure
```

Social Listening closes the gap between external signal and content creation — agencies can search for brand mentions, track sentiment, and create posts from insights, all in one place.

### North Star

| Timeframe | Publishing Adoption Target |
|-----------|---------------------------|
| Current   | 7.2%                      |
| 6 months  | 15%                       |
| 12 months | 20%                       |

### Phase 1 — Beta Scope

| Feature | Description |
|---------|-------------|
| Instant search | Enter keyword/brand → insights within 5 seconds |
| Topic saving | Save a search as a named topic with auto-refresh |
| Multi-platform | X, Instagram, Reddit, YouTube, News *(no Facebook in Beta)* |
| Basic filters | Platform, sentiment, date range |
| 15-day lookback | Default date range for all queries |
| Conversation feed | Real posts with platform, date, snippet, and source link |
| Insights dashboard | Sentiment, emotion radar, share of voice, trends, keywords |

### Phase 2 — AI Layer *(Post-Beta)*
Spike alerts · Competitor tracking · Boolean queries · Extended lookback · Export (CSV/PDF) · AI-generated summaries · Auto post recommendations · Workflow automation

---

## Users & Personas

### Agency Admin
- Manages the HighLevel account; controls which sub-accounts get Social Listening
- Goal: Enable social listening for clients without adding external tool costs; monetize via reselling
- Key jobs: Enable/disable per sub-account, update plan (Free/Paid), review adoption metrics

### Social Media Manager — Jordan
- Day-to-day operator; manages 3–10 client brands inside a sub-account
- Goal: Stay on top of brand mentions and trending topics to fuel publishing ideas
- Pain point: Currently spends 30–45 min/day checking multiple tools; insights feel stale by the time they act
- Key jobs: Run topic searches, review sentiment, create posts directly from insights

---

## Design Resources

| Resource | Description | Link |
|----------|-------------|------|
| Figma | Design file *(revamp in progress — do not treat current designs as final)* | [Open in Figma](https://www.figma.com/design/Akrs73ktQWa6AYkRp4QUO2/Social-listening?node-id=0-1&t=siF77Uu6p1KMRIed-1) |
| Storybook | HighLevel design system (Highrise) | [Open Storybook](https://highrise.gohighlevel.com/) |
| Miro | User flows and whiteboarding | [Open Miro](https://miro.com/app/board/uXjVGNRbAVI=/?share_link_id=752620128443) |
| PRD | Full product requirements | `Social Listening PRD-2026042605335828.pdf` *(in repo root)* |
| Copy Guidelines | Voice, tone, and copy standards | *(link to be added)* |

---

## Design Direction

The existing Figma is being revamped from scratch. The current designs don't reflect the experience we want to build — bring fresh thinking.

**Desired experience qualities** *(to be refined with the team):*

- Feels like a command centre, not a report
- Insights should be immediately actionable, not just readable
- Empty and loading states should be first-class, not afterthoughts
- Upgrade moments should feel helpful, not punitive

> **Note for designers:** Reference [Highrise Storybook](https://highrise.gohighlevel.com/) for all components, tokens, and patterns before inventing new ones.

---

## Design Tokens

These are the confirmed color tokens used in the prototype (`src/index.css`). All UI components reference these values.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-hl-blue` | `#155EEF` | Primary — buttons, links, active nav, focus rings |
| `--color-hl-blue-dark` | `#1249C0` | Hover state for primary blue elements |
| `--color-hl-blue-light` | `#EEF4FF` | Active nav background, light tints |
| `--color-positive` | `#16A34A` | Positive sentiment, success states |
| `--color-negative` | `#DC2626` | Negative sentiment, error states |
| `--color-warning` | `#D97706` | Warning states |
| `--color-neutral-900` | `#111827` | Primary text |
| `--color-neutral-500` | `#6B7280` | Secondary/body text |
| `--color-neutral-200` | `#E5E7EB` | Borders, dividers |
| `--color-neutral-100` | `#F3F4F6` | Subtle backgrounds |

> The primary blue `#155EEF` is sourced from the Figma file and should not be changed without design sign-off.

---

## Why HighLevel Wins

Competitors stop at data. HighLevel closes the loop by letting agencies publish directly from insights.

| Capability | Brand24 | Sprout | Hootsuite | HighLevel |
|------------|---------|--------|-----------|-----------|
| Sentiment analysis | Basic | Advanced | Limited | Advanced |
| Emotion analysis | — | — | — | ✅ |
| Trend visualization | Basic | Advanced | Basic | Advanced |
| Conversation feed | ✅ | Limited | — | ✅ |
| Real-time insights | Partial | — | — | Planned |
| Insight → Publish | — | — | — | ✅ |

---

## Data Provider: Infegy

After evaluating Talkwalker, Data365, ForumScout, Phyllo, and Socialgist — **Infegy** was selected.

- Cost-effective relative to alternatives
- API-first; supports complex queries and structured insights (sentiment, emotion, topics)
- Covers major platforms — **note: Facebook not available in Beta**
- Data models must be abstracted from Infegy-specific schemas to allow future provider substitution

**Fallback:** If Infegy API is unavailable, serve cached data with a visible staleness indicator. Surface an error state if cache is older than 48 hours.

---

## Plans & Limits

| Feature | Free | Paid |
|---------|------|------|
| Searches per day | 3 | 100 |
| Saved topics | 3 | 100 |
| Lookback | 15 days | 30 days |
| Refresh rate | 6–12 hrs | Configurable (1/4/12 hr) |
| Export | — | ✅ *(Phase 2)* |
| Platform coverage | No Facebook | All platforms |

Upgrades are tier-based only — no usage-based pricing.

---

## Beta Rollout

| Phase | Objective | Duration |
|-------|-----------|----------|
| Beta | Invited agencies; validate search → insight → action loop | 4 weeks |
| GA | Roll out Free + Paid tiers based on Beta data | 4 weeks post-Beta |

**Beta success targets:** ≥40% of users search weekly · ≥25% save a topic · ≥30% return within 7 days

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Run the prototype
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`

### Screens
| Screen | Route | Description |
|--------|-------|-------------|
| Search | `/search` | Keyword input + platform filters |
| Insights | `/insights` | Metrics, share of voice, emotion breakdown, conversation feed |
| Saved Topics | `/topics` | List of saved searches with auto-refresh |

### Tech stack
| Tool | Purpose |
|------|---------|
| Vite + React | Fast dev server, component-based UI |
| Tailwind CSS | Utility-first styling tied to design tokens |
| React Router | Client-side navigation between screens |

---

## Project Info

| | |
|--|--|
| Feature name | Social Listening – Topic Setup & Insights |
| Product owner | Shivam Sharma |
| PRD last updated | 9 April 2026 |
| Current phase | Design |
