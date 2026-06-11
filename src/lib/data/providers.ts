import { pandaScoreToken } from "@/lib/env";
import { getManualMatches } from "@/lib/data/manual-data";
import type { CSMatch, MatchStatus, ProviderName, TeamProfile } from "@/lib/types";

type PandaScoreOpponent = {
  opponent?: {
    id?: number;
    name?: string;
    acronym?: string;
  };
};

type PandaScoreMatch = {
  id: number;
  name?: string;
  begin_at?: string;
  status?: string;
  number_of_games?: number;
  opponents?: PandaScoreOpponent[];
  league?: { name?: string };
  serie?: { full_name?: string; name?: string };
  tournament?: { name?: string };
};

const neutralTeam = (name: string, index: number): TeamProfile => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `team-${index}`,
  name,
  shortName: name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase(),
  region: "TBD",
  rank: 0,
  powerRating: 50,
  form: [],
  players: [],
  rosterNotes: ["No manual roster note attached yet."],
});

function normalizeStatus(status?: string): MatchStatus {
  if (status === "running" || status === "live") return "live";
  if (status === "finished") return "finished";
  return "scheduled";
}

function mapPandaScoreMatch(match: PandaScoreMatch): CSMatch {
  const teamAName = match.opponents?.[0]?.opponent?.name ?? "Team A";
  const teamBName = match.opponents?.[1]?.opponent?.name ?? "Team B";
  const eventParts = [
    match.league?.name,
    match.serie?.full_name ?? match.serie?.name,
    match.tournament?.name,
  ].filter(Boolean);

  return {
    id: `pandascore-${match.id}`,
    providerMatchId: String(match.id),
    providerSources: ["PandaScore"],
    dataFreshness: "Fetched from PandaScore schedule API",
    status: normalizeStatus(match.status),
    startsAt: match.begin_at ?? new Date().toISOString(),
    event: eventParts.join(" - ") || "PandaScore CS2 match",
    stage: match.tournament?.name ?? "Scheduled match",
    bestOf: match.number_of_games ?? 3,
    teamA: neutralTeam(teamAName, 0),
    teamB: neutralTeam(teamBName, 1),
    maps: [{ map: "TBD", state: "unknown", lean: "even" }],
    mapWinRates: [],
    previousGames: { teamA: [], teamB: [] },
    headToHead: [],
    rosterNotes: [
      "Schedule came from PandaScore. Add manual or paid stats provider data for map rates, player form, and roster notes.",
    ],
    marketSnapshots: [],
  };
}

async function fetchPandaScoreMatches(date = new Date()): Promise<CSMatch[]> {
  if (!pandaScoreToken) return [];

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const params = new URLSearchParams({
    "range[begin_at]": `${start.toISOString()},${end.toISOString()}`,
    sort: "begin_at",
    per_page: "50",
  });

  const response = await fetch(`https://api.pandascore.co/csgo/matches?${params}`, {
    headers: {
      Authorization: `Bearer ${pandaScoreToken}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`PandaScore request failed with ${response.status}`);
  }

  const data = (await response.json()) as PandaScoreMatch[];
  return data.map(mapPandaScoreMatch);
}

export async function getMatchesForDate(date = new Date()) {
  const manual = getManualMatches(date);

  try {
    const providerMatches = await fetchPandaScoreMatches(date);
    if (providerMatches.length > 0) {
      return providerMatches;
    }
  } catch {
    return manual;
  }

  return manual;
}

export async function getTodaysMatches() {
  return getMatchesForDate();
}

export async function getMatchById(matchId: string) {
  const dateFromId = matchId.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  const primaryDate = dateFromId ? new Date(`${dateFromId}T12:00:00.000Z`) : new Date();
  const primaryMatches = await getMatchesForDate(primaryDate);
  const primaryMatch = primaryMatches.find((match) => match.id === matchId);

  if (primaryMatch) return primaryMatch;

  const fallbackDates = [
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    new Date("2026-06-11T12:00:00.000Z"),
    new Date("2026-06-12T12:00:00.000Z"),
  ];

  for (const date of fallbackDates) {
    const match = getManualMatches(date).find((candidate) => candidate.id === matchId);
    if (match) return match;
  }

  return null;
}

export const approvedProviders: ProviderName[] = [
  "PandaScore",
  "GRID",
  "Abios",
  "Manual Stats",
];
