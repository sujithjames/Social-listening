# Social Listening — Claude Guardrails

This file is auto-loaded by Claude Code on every session. It captures all design rules, token conventions, locked components, and code patterns for the Social Listening UI prototype. **Keep this file up to date as the design evolves.**

---

## 1. Project Identity

- **What**: Social Listening UI prototype for HighLevel
- **Type**: Static clickable mockup — no backend, no API, all data hardcoded as constants
- **Stack**: Vite 8 · React 19 · Tailwind CSS v4 · React Router v7 · lucide-react
- **Dev server**: `npm run dev` → `http://localhost:5173`
- **Designer**: James Sujith (`sujith.s.designer@gmail.com`) — HighLevel, some coding experience, design-first mindset
- **PRD owner**: Shivam Sharma
- **Figma auth**: Authenticated as `sujith@gohighlevel.com` via Figma MCP OAuth

---

## 2. Locked / Frozen Components

Do **NOT** modify these without explicit instruction from the designer:

| File | What it is |
|------|-----------|
| `src/components/Sidebar.jsx` | Figma-exact left nav, 280px wide, `#101828` bg |
| `src/components/TopBar.jsx` | Figma-exact two-row header |

Both are composed in `src/App.jsx` as the shell that wraps every page. Pages must never include either component themselves.

---

## 3. Design Tokens

Source of truth: `src/index.css` `@theme` block. **Always use Tailwind token classes — never inline raw hex.**

| Token class | Hex | When to use |
|-------------|-----|-------------|
| `bg-hl-blue` / `text-hl-blue` / `border-hl-blue` | `#155EEF` | Primary CTAs, active tab underline |
| `bg-hl-blue-dark` | `#1249C0` | Hover state on blue elements |
| `bg-hl-blue-light` | `#EEF4FF` | Light blue tint backgrounds |
| `bg-gray-900` / `text-gray-900` | `#101828` | Sidebar bg, page headings |
| `bg-gray-800` | `#1D2939` | Active nav item background |
| `bg-gray-700` | `#344054` | Subaccount chip, secondary icon bg |
| `text-gray-600` | `#475467` | Secondary body text |
| `text-gray-500` | `#667085` | Inactive tab labels, placeholder text |
| `text-gray-400` | `#98A2B3` | Muted / disabled text |
| `bg-gray-300` / `border-gray-300` | `#D0D5DD` | Input borders, card borders |
| `bg-gray-200` | `#EAECF0` | Dividers |
| `bg-gray-100` | `#F2F4F7` | Hover backgrounds |
| `bg-gray-50` | `#F9FAFB` | Page background |
| `text-positive` | `#16A34A` | Positive sentiment |
| `text-negative` | `#DC2626` | Negative sentiment |
| `text-warning` | `#D97706` | Neutral / warning state |
| `bg-accent-green` | `#73E2A3` | Sidebar collapse toggle |
| `bg-accent-purple` | `#6938EF` | AI icon |

---

## 4. Typography

- **Font**: Inter (Google Fonts, preloaded in `index.html`) — never swap to another font
- **Antialiasing**: `-webkit-font-smoothing: antialiased` already set globally in `index.css`
- Key sizes in use:

| Size | Use |
|------|-----|
| `text-[20px] font-semibold` | Page/section titles (e.g. "Marketing") |
| `text-[16px] font-semibold` | Sub-section titles (e.g. "Social planner") |
| `text-[16px] font-medium` | Nav items, body text |
| `text-[15px]` | Sub-tab labels |
| `text-[14px] font-semibold` | Buttons |
| `text-[14px] font-medium` | Labels, chips, secondary text |

---

## 5. Icons

- Always use **lucide-react** — never use Figma asset export URLs (they expire in 7 days)
- Import only what you use: `import { IconName } from 'lucide-react'`
- Standard icon size in nav: `size={20}`, `strokeWidth={1.8}`
- Standard icon size in buttons/toolbars: `size={14}` or `size={15}`

---

## 6. Page Layout Pattern

```
App.jsx
└── <Sidebar />           ← frozen, always on left
└── <div flex-col flex-1>
    └── <TopBar />        ← frozen, always on top
    └── <main>
        └── <Route> → PageComponent   ← only this part changes per screen
```

Pages in `src/pages/` render **content area only**. Never import Sidebar or TopBar inside a page.

---

## 7. Code Style

- `.jsx` files only — no TypeScript
- No `fetch`, `axios`, or `useEffect` for data — all mock data is hardcoded as `const` arrays/objects at the top of each file
- JSX strings containing apostrophes: use **double-quoted** outer delimiter (`"it's"`, not `'it\'s'`)
- No comments unless the WHY is genuinely non-obvious to a future reader
- No unused imports

---

## 8. Figma Reference

- **File key**: `Akrs73ktQWa6AYkRp4QUO2`
- **Figma URL**: `https://www.figma.com/design/Akrs73ktQWa6AYkRp4QUO2/Social-listening`
- When building a new screen: call `mcp__figma__get_design_context` with the file key + node ID
- Known node IDs: Sidebar `1:129075` · TopBar `1:129140`
- Always adapt Figma output to existing token classes — never paste raw hex values inline

---

## 9. Current Screen Inventory

All three screens are built. Routes live in `src/App.jsx`.

### `/search` → `src/pages/SearchPage.jsx`
- Landing screen. Centered search input + "Search" button (disabled until text entered)
- Platform filter chips: All · X · Instagram · Reddit · YouTube · News (active = `bg-hl-blue text-white`)
- 3 feature cards below (Sentiment analysis, Emotion radar, Instant publish) — static, decorative
- On submit: `navigate('/insights', { state: { query, platform } })`

### `/insights` → `src/pages/InsightsPage.jsx`
- Receives `query` + `platform` from router state (falls back to `"HighLevel"` if missing)
- Row 1: 4 metric cards — Total Mentions 1,248 · Positive 68% · Negative 11% · Engagement 24.3K
- Row 2 left (col-span-2): Share of Voice by Platform — `bg-hl-blue` progress bar fill
- Row 2 right: Emotion Breakdown — Joy 42% · Trust 28% · Anticipation 15% · Surprise 8% · Anger 7%
- Row 3: Conversation Feed — 5 hardcoded `MOCK_POSTS` (X, Reddit, Instagram, News, YouTube)
- "← Back" navigates to `/search`
- Platform badge colors: X=`bg-neutral-900`, Reddit=`bg-orange-500`, Instagram=`bg-pink-500`, YouTube=`bg-red-600`, News=`bg-hl-blue`

### `/topics` → `src/pages/TopicsPage.jsx`
- 3 hardcoded `MOCK_TOPICS`: HighLevel (1,248, 68%) · Email Marketing (843, 54%) · Marketing Automation (612, 61%)
- Each row shows: name + updated time · mention count · positive % · platform chips (`bg-hl-blue-light text-hl-blue`)
- Click any row → `navigate('/insights', { state: { query: topic.name } })`
- "+ New Topic" → `navigate('/search')`
- Uses `<Header>` component (see below)

---

## 10. Component: `src/components/Header.jsx`

Simple reusable page-level title block — **not** the frozen TopBar. Accepts `title` and optional `subtitle` props.

```jsx
<Header title="Saved Topics" subtitle="Auto-refreshed every 6 hours" />
```

Currently used by `TopicsPage`. Reuse in any new page that needs a title + subtitle header area.

---

## 11. Known Pitfalls

- **Smart/curly quotes break JSX**: Text pasted from Figma or design tools may have curly apostrophes (`'`) or curly double-quotes. These terminate string literals early and cause parse errors. Always use straight ASCII quotes.
- **`neutral-*` vs `gray-*`**: Pages use standard Tailwind `text-neutral-*` / `border-neutral-*` for generic gray text. Custom `@theme` tokens use `gray-*` names (e.g. `bg-gray-900`). Both coexist — custom tokens for intentional design decisions, `neutral-*` for generic utility grays.
- **Unused imports**: Vite warns on these. Remove before finishing any screen.
- **`package.json` name is `"sl-temp"`**: Leftover from scaffold workaround — not worth fixing.

---

## 12. Adding a New Screen

1. Create `src/pages/NewScreenPage.jsx` — content area only, no Sidebar/TopBar
2. Add `<Route path="/new-screen" element={<NewScreenPage />} />` in `src/App.jsx`
3. Hardcode all mock data as `const` at the top of the file
4. Navigate with `useNavigate()` from `react-router-dom`
5. Pull the Figma node ID and call `mcp__figma__get_design_context` before coding

---

## 13. Evolving This File

When a new design decision is confirmed (new token, new pattern, new frozen component), **add it here** so it's available in future sessions without re-briefing.

---

## 14. Git Checkpoints

| Hash | Friendly Name | Feature | Restore |
|------|--------------|---------|---------|
| `bcf719b` | Social Listening 1.6 | Detail page full rebuild — Recharts interactive charts, multi-select platform chips, activity heatmap, emotion radar, engagement stats, audience insights, trending topics/hashtags, Beta tag in TopBar | `git reset --hard bcf719b` |
| `db39b8e` | Social Listening 1.7 | Shell polish — Sidebar + TopBar fixed positioning, collapse toggle unclipped, tab indicators correct, sidebar nav sentence-cased | `git reset --hard db39b8e` |
