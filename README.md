# CS2 Edge Desk

Private CS2 prediction dashboard for personal betting research. It is not a public sportsbook and it does not scrape HLTV directly.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Optional Supabase/Postgres storage for journal persistence
- Approved data provider layer with PandaScore schedule support and manual stats fallback

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app opens directly to the dashboard. There is no login gate.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor if you want hosted journal storage.
3. Add these variables to `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Without a configured Supabase project, journal entries are stored in browser local storage.

For Vercel, add the same variables in Project Settings -> Environment Variables, then redeploy.

## AI Analyst Agent

The app uses a local analyst model when no OpenAI key is present. To enable OpenAI-backed summaries, add:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
```

The analysis route sends only the match data already gathered from approved APIs or manual stats. It does not scrape HLTV or browse the web.

The analyst also produces map-specific strengths and weaknesses. For each available map sample, it labels each team as `strong`, `weak`, or `even`, explains the weakness, and gives a research angle such as waiting for veto confirmation or downgrading a team on a weak map.

The match detail page supports full previews with player images, player stat cards, map win rates, CT-side win rate, T-side win rate, pistol win rate, recent preview games, and short map explanations. These fields are populated from approved providers or manual entries when available.

## Live Tracking

The AI cannot literally watch streams. Live mode should be connected to official/approved live data such as GRID Live Esports Data, PandaScore Live, or Abios. Without a live provider key, the app shows a manual fallback estimate so the interface can still be tested.

## Learning Loop

The analyst improves through calibration from your own resolved bet journal outcomes. Each time you mark entries as `win` or `loss`, the analysis route summarizes settled journal history, confidence buckets, team-specific outcomes, and ROI. That learning profile is included in future OpenAI prompts and also adjusts the final confidence score.

This is not automatic model fine-tuning. It is safer, immediate, and avoids overfitting on tiny samples. The calibration stays conservative until at least five settled journal entries exist.

## Data Sources

The app avoids direct HLTV scraping. It supports:

- `PANDASCORE_TOKEN` for server-side PandaScore CS2 match schedules.
- Manual stats entered or maintained in `src/lib/data/manual-data.ts`.
- Extension points for GRID and Abios in `src/lib/data/providers.ts`.

PandaScore uses the legacy `/csgo/` path for CS2 endpoints, including `/csgo/matches`; the app calls that route from the Next.js backend, not the browser.

## Features

- Direct dashboard access
- Today's CS2 match dashboard
- Match detail pages with form, H2H, map rates, players, and roster notes
- AI Analyst Agent route with probability, confidence, action, reasoning, and risk flags
- Live match mode with periodic probability refresh
- Bet journal
- Analytics for total bets, win rate, ROI, teams, and bet types

All predictions are research estimates only and are not guaranteed betting advice.
