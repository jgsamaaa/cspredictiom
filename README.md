# CS2 Edge Desk

Private CS2 prediction dashboard for personal betting research. It is not a public sportsbook and it does not scrape HLTV directly.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres for private login and bet journal persistence
- Approved data provider layer with PandaScore schedule support and manual stats fallback

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

If Supabase credentials are not configured, local preview auth uses:

```text
password: research-only
```

Set `NEXT_PUBLIC_DEMO_PASSWORD` in `.env.local` to change that preview password.

## Supabase

1. Create a Supabase project.
2. Enable email/password auth.
3. Run `supabase/schema.sql` in the SQL editor.
4. Add these variables to `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The `bet_journal` table has row-level security enabled so authenticated users only see their own entries.

## Data Sources

The app avoids direct HLTV scraping. It supports:

- `PANDASCORE_TOKEN` for server-side PandaScore CS2 match schedules.
- Manual stats entered or maintained in `src/lib/data/manual-data.ts`.
- Extension points for GRID and Abios in `src/lib/data/providers.ts`.

PandaScore uses the legacy `/csgo/` path for CS2 endpoints, including `/csgo/matches`; the app calls that route from the Next.js backend, not the browser.

## Features

- Private login
- Today's CS2 match dashboard
- Match detail pages with form, H2H, map rates, players, and roster notes
- AI Analyst Agent route with probability, confidence, action, reasoning, and risk flags
- Live match mode with periodic probability refresh
- Bet journal
- Analytics for total bets, win rate, ROI, teams, and bet types

All predictions are research estimates only and are not guaranteed betting advice.
