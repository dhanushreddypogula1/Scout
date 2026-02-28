# Scout — VC Intelligence Interface

A Harmonic-style VC sourcing tool with live AI enrichment. Built with Next.js 15 + TypeScript.

## Features

- **Companies** — Search, filter (sector/stage), sort, paginate across mock company dataset
- **Company Profile** — Signal timeline, notes (localStorage), save-to-list
- **Live Enrichment** — Server-side `/api/enrich` calls Claude to extract summary, bullets, keywords, signals, and sources. API key never exposed to browser.
- **Lists** — Create lists, add/remove companies, export CSV or JSON (localStorage)
- **Saved Searches** — Save and re-run filter combos (localStorage)

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd scout
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

When prompted, add `ANTHROPIC_API_KEY` as an environment variable.

### Option B — Vercel Dashboard

1. Push repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add env var: `ANTHROPIC_API_KEY` → your key
4. Deploy

## Architecture

```
app/
  api/enrich/route.ts   ← Server-side only. API key lives here.
  companies/
    page.tsx            ← Company list with search + filters
    [id]/page.tsx       ← Company profile, signals, notes, enrichment
  lists/page.tsx        ← List management + CSV/JSON export
  saved/page.tsx        ← Saved search management
  globals.css           ← Design tokens + global styles
  components.css        ← All shared component styles

components/
  Sidebar.tsx           ← Navigation
  Topbar.tsx            ← Global search bar
  EnrichPanel.tsx       ← Enrichment UI (calls /api/enrich)
  ui/index.tsx          ← Shared UI primitives

lib/
  data.ts               ← Mock companies + signals
  useLocalStorage.ts    ← Typed localStorage hook

types/index.ts          ← Shared TypeScript interfaces
```

## Enrichment Flow

```
Browser (EnrichPanel)
  → POST /api/enrich { companyId }
      ↓ server-side only
  → Anthropic SDK (ANTHROPIC_API_KEY env var)
      ↓
  ← { summary, whatTheyDo, keywords, signals, sources, fetchedAt }
      ↓ cached in localStorage per company
  → Rendered in UI
```

The API route uses an in-memory cache (1 hour TTL). For production, swap this for Vercel KV, Redis, or a database.

## Extending

- **Real data**: Replace `lib/data.ts` mock with a database (e.g. Supabase, PlanetScale)
- **Real scraping**: In `/api/enrich`, use Firecrawl or Browserless to fetch actual website HTML before sending to Claude
- **Auth**: Add NextAuth.js for multi-user support
- **Cache**: Replace the in-memory cache with Vercel KV (`@vercel/kv`)
- **Scoring**: Add a thesis-matching scoring model in a `/api/score` route

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- TypeScript
- CSS custom properties (no CSS framework — keeps bundle tiny)
- Syne + DM Mono fonts (Google Fonts)
