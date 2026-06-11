import type { BetJournalEntry, CSMatch, LiveSnapshot, TeamProfile } from "@/lib/types";

function dateKey(base = new Date()) {
  return base.toISOString().slice(0, 10);
}

function atToday(hour: number, minute = 0, base = new Date()) {
  const date = new Date(base);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function atUtc(date: string, hour: number, minute = 0) {
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00.000Z`;
}

function statusFor(startIso: string) {
  const start = new Date(startIso).getTime();
  const now = Date.now();
  if (now > start + 3 * 60 * 60 * 1000) return "finished" as const;
  if (now >= start - 10 * 60 * 1000) return "live" as const;
  return "scheduled" as const;
}

const aurora: TeamProfile = {
  id: "aurora-wolves",
  name: "Aurora Wolves",
  shortName: "AUR",
  region: "EU",
  rank: 8,
  powerRating: 86.4,
  form: [
    { opponent: "Koi Circuit", result: "W", score: "2-0", mapOrSeries: "Bo3", date: "Jun 8" },
    { opponent: "Nexus Five", result: "W", score: "2-1", mapOrSeries: "Bo3", date: "Jun 6" },
    { opponent: "Iron Branch", result: "L", score: "1-2", mapOrSeries: "Bo3", date: "Jun 4" },
    { opponent: "Dust Union", result: "W", score: "13-8", mapOrSeries: "Mirage", date: "Jun 2" },
    { opponent: "Blue Harbor", result: "W", score: "2-0", mapOrSeries: "Bo3", date: "May 31" },
  ],
  players: [
    { name: "riven", role: "rifle", rating: 1.18, adr: 84.1, kast: 74.2, impact: 1.21, maps: 38 },
    { name: "solace", role: "AWP", rating: 1.14, adr: 76.8, kast: 72.4, impact: 1.19, maps: 38 },
    { name: "mako", role: "entry", rating: 1.05, adr: 79.2, kast: 68.9, impact: 1.12, maps: 36 },
    { name: "denn", role: "IGL", rating: 0.99, adr: 67.4, kast: 71.1, impact: 0.94, maps: 38 },
    { name: "vex", role: "support", rating: 1.02, adr: 70.5, kast: 73.5, impact: 0.98, maps: 38 },
  ],
  rosterNotes: ["Core five listed for event media day.", "No stand-in currently flagged in manual notes."],
};

const northstar: TeamProfile = {
  id: "northstar-ac",
  name: "Northstar AC",
  shortName: "NAC",
  region: "NA",
  rank: 15,
  powerRating: 79.2,
  form: [
    { opponent: "River Plate", result: "L", score: "0-2", mapOrSeries: "Bo3", date: "Jun 8" },
    { opponent: "Dust Union", result: "W", score: "2-1", mapOrSeries: "Bo3", date: "Jun 6" },
    { opponent: "Nexus Five", result: "W", score: "13-10", mapOrSeries: "Ancient", date: "Jun 5" },
    { opponent: "Koi Circuit", result: "L", score: "1-2", mapOrSeries: "Bo3", date: "Jun 3" },
    { opponent: "Forge Red", result: "W", score: "2-0", mapOrSeries: "Bo3", date: "May 30" },
  ],
  players: [
    { name: "atlas", role: "AWP", rating: 1.2, adr: 78.3, kast: 73.7, impact: 1.26, maps: 31 },
    { name: "shale", role: "rifle", rating: 1.07, adr: 75.2, kast: 70.3, impact: 1.04, maps: 31 },
    { name: "nix", role: "entry", rating: 0.98, adr: 72.5, kast: 65.4, impact: 1.02, maps: 29 },
    { name: "cairn", role: "IGL", rating: 0.94, adr: 63.9, kast: 69.8, impact: 0.89, maps: 31 },
    { name: "pax", role: "support", rating: 1.01, adr: 68.1, kast: 72.1, impact: 0.96, maps: 31 },
  ],
  rosterNotes: ["Assistant coach noted travel delay risk.", "Manual note: possible sixth-man warmup, not confirmed as stand-in."],
};

const ember: TeamProfile = {
  id: "ember-protocol",
  name: "Ember Protocol",
  shortName: "EMB",
  region: "EU",
  rank: 22,
  powerRating: 75.8,
  form: [
    { opponent: "Cobalt Line", result: "L", score: "1-2", mapOrSeries: "Bo3", date: "Jun 9" },
    { opponent: "Orbit Black", result: "W", score: "2-0", mapOrSeries: "Bo3", date: "Jun 7" },
    { opponent: "South Guard", result: "L", score: "8-13", mapOrSeries: "Anubis", date: "Jun 5" },
    { opponent: "White Peak", result: "W", score: "13-7", mapOrSeries: "Nuke", date: "Jun 2" },
    { opponent: "Koi Circuit", result: "L", score: "0-2", mapOrSeries: "Bo3", date: "May 30" },
  ],
  players: [
    { name: "kode", role: "rifle", rating: 1.09, adr: 80.4, kast: 70.1, impact: 1.08, maps: 25 },
    { name: "haze", role: "AWP", rating: 1.08, adr: 72.9, kast: 71.6, impact: 1.14, maps: 25 },
    { name: "drift", role: "entry", rating: 0.96, adr: 69.8, kast: 64.8, impact: 1.01, maps: 24 },
    { name: "mero", role: "IGL", rating: 0.91, adr: 61.3, kast: 68.4, impact: 0.84, maps: 25 },
    { name: "lark", role: "support", rating: 0.99, adr: 66.7, kast: 71.8, impact: 0.93, maps: 25 },
  ],
  rosterNotes: ["New IGL system is only four series old.", "Manual note flags weaker CT side on Anubis."],
};

const cobalt: TeamProfile = {
  id: "cobalt-line",
  name: "Cobalt Line",
  shortName: "CBL",
  region: "BR",
  rank: 18,
  powerRating: 78.7,
  form: [
    { opponent: "Ember Protocol", result: "W", score: "2-1", mapOrSeries: "Bo3", date: "Jun 9" },
    { opponent: "White Peak", result: "W", score: "13-9", mapOrSeries: "Inferno", date: "Jun 7" },
    { opponent: "Orbit Black", result: "L", score: "1-2", mapOrSeries: "Bo3", date: "Jun 6" },
    { opponent: "South Guard", result: "W", score: "2-0", mapOrSeries: "Bo3", date: "Jun 3" },
    { opponent: "Nexus Five", result: "L", score: "9-13", mapOrSeries: "Mirage", date: "Jun 1" },
  ],
  players: [
    { name: "vanta", role: "rifle", rating: 1.13, adr: 82.2, kast: 72.9, impact: 1.17, maps: 30 },
    { name: "scope", role: "AWP", rating: 1.11, adr: 74.8, kast: 72.2, impact: 1.15, maps: 30 },
    { name: "brio", role: "entry", rating: 1.04, adr: 77.6, kast: 67.5, impact: 1.1, maps: 29 },
    { name: "sable", role: "IGL", rating: 0.97, adr: 65.9, kast: 70.8, impact: 0.91, maps: 30 },
    { name: "limn", role: "support", rating: 1.01, adr: 68.8, kast: 72.9, impact: 0.95, maps: 30 },
  ],
  rosterNotes: ["Stable roster over last 30 maps.", "Manual note: faster starts after pistol losses in latest sample."],
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function iemTeam(name: string, shortName: string, rank: number, powerRating: number): TeamProfile {
  return {
    id: slugify(name),
    name,
    shortName,
    region: "TBD",
    rank,
    powerRating,
    form: [],
    players: [],
    rosterNotes: [
      "Manual IEM seed profile. Verify player stats and roster status with PandaScore, GRID, Abios, or manual notes before betting research.",
    ],
  };
}

function tbdTeam(slot: string): TeamProfile {
  return {
    id: slugify(slot),
    name: slot,
    shortName: "TBD",
    region: "TBD",
    rank: 0,
    powerRating: 50,
    form: [],
    players: [],
    rosterNotes: ["Swiss pairing is not confirmed yet."],
  };
}

const iemTeams = {
  mongolz: iemTeam("The MongolZ", "MGLZ", 9, 84),
  betboom: iemTeam("BetBoom Team", "BB", 17, 78),
  parivision: iemTeam("PARIVISION", "PRV", 13, 79),
  ninez: iemTeam("9z Team", "9Z", 20, 73),
  mouz: iemTeam("MOUZ", "MOUZ", 7, 86),
  legacy: iemTeam("Legacy", "LEG", 14, 78),
  vitality: iemTeam("Team Vitality", "VIT", 1, 93),
  fut: iemTeam("FUT Esports", "FUT", 24, 71),
  furia: iemTeam("FURIA", "FUR", 6, 87),
  b8: iemTeam("B8 Esports", "B8", 19, 75),
  falcons: iemTeam("Team Falcons", "FLC", 5, 88),
  g2: iemTeam("G2 Esports", "G2", 12, 81),
  auroraIem: iemTeam("Aurora", "AUR", 8, 85),
  monte: iemTeam("Monte", "MON", 18, 76),
  navi: iemTeam("Natus Vincere", "NAVI", 10, 83),
  spirit: iemTeam("Team Spirit", "SPR", 2, 92),
};

function manualMapRates(teamA: number, teamB: number) {
  const spread = Math.round((teamA - teamB) / 2);
  return [
    { map: "Dust2", teamA: 50 + spread, teamB: 50 - spread, sampleA: 0, sampleB: 0, note: "Manual IEM prior; replace with provider stats." },
    { map: "Mirage", teamA: 52 + spread, teamB: 48 - spread, sampleA: 0, sampleB: 0, note: "Manual IEM prior; verify veto." },
    { map: "Inferno", teamA: 49 + spread, teamB: 51 - spread, sampleA: 0, sampleB: 0 },
    { map: "Nuke", teamA: 51 + spread, teamB: 49 - spread, sampleA: 0, sampleB: 0 },
    { map: "Ancient", teamA: 50 + spread, teamB: 50 - spread, sampleA: 0, sampleB: 0 },
    { map: "Anubis", teamA: 48 + spread, teamB: 52 - spread, sampleA: 0, sampleB: 0 },
  ].map((rate) => ({
    ...rate,
    teamA: Math.max(30, Math.min(70, rate.teamA)),
    teamB: Math.max(30, Math.min(70, rate.teamB)),
  }));
}

function iemMatch({
  date,
  hour,
  minute,
  order,
  teamA,
  teamB,
  stage,
}: {
  date: string;
  hour: number;
  minute: number;
  order: number;
  teamA: TeamProfile;
  teamB: TeamProfile;
  stage: string;
}): CSMatch {
  const startsAt = atUtc(date, hour, minute);
  const hasConfirmedTeams = !teamA.name.startsWith("TBD") && !teamB.name.startsWith("TBD");

  return {
    id: `iem-cologne-major-2026-${date}-${order}`,
    providerSources: ["Manual Stats"],
    dataFreshness: hasConfirmedTeams
      ? "IEM Major schedule entered manually from public non-HLTV sources"
      : "Official IEM time slot entered manually; Swiss teams pending results",
    status: statusFor(startsAt),
    startsAt,
    event: "IEM Cologne Major 2026",
    stage,
    bestOf: 3,
    teamA,
    teamB,
    maps: [{ map: "TBD", state: "unknown", lean: "even" }],
    mapWinRates: hasConfirmedTeams
      ? manualMapRates(teamA.powerRating, teamB.powerRating)
      : [],
    headToHead: [],
    rosterNotes: hasConfirmedTeams
      ? [
          "Stage 3 match added from public schedule data, not HLTV scraping.",
          "Map stats are manual priors until a connected provider supplies verified map samples.",
        ]
      : [
          "Swiss Day 2 pairing is TBD until prior results complete.",
          "Use Wait Live or Avoid until teams, veto, and roster notes are confirmed.",
        ],
    marketSnapshots: [],
  };
}

function getIemMajorMatches(base: Date): CSMatch[] {
  const key = dateKey(base);

  if (key === "2026-06-11") {
    return [
      iemMatch({ date: key, hour: 9, minute: 0, order: 1, teamA: iemTeams.mongolz, teamB: iemTeams.betboom, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 9, minute: 0, order: 2, teamA: iemTeams.parivision, teamB: iemTeams.ninez, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 11, minute: 30, order: 3, teamA: iemTeams.mouz, teamB: iemTeams.legacy, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 11, minute: 30, order: 4, teamA: iemTeams.vitality, teamB: iemTeams.fut, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 14, minute: 0, order: 5, teamA: iemTeams.furia, teamB: iemTeams.b8, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 14, minute: 0, order: 6, teamA: iemTeams.falcons, teamB: iemTeams.g2, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 16, minute: 30, order: 7, teamA: iemTeams.auroraIem, teamB: iemTeams.monte, stage: "Stage 3 Day 1" }),
      iemMatch({ date: key, hour: 16, minute: 30, order: 8, teamA: iemTeams.navi, teamB: iemTeams.spirit, stage: "Stage 3 Day 1" }),
    ];
  }

  if (key === "2026-06-12") {
    return [9, 11, 14, 16].map((hour, index) =>
      iemMatch({
        date: key,
        hour,
        minute: index === 1 || index === 3 ? 30 : 0,
        order: index + 1,
        teamA: tbdTeam(`TBD Swiss Pairing ${index + 1} A`),
        teamB: tbdTeam(`TBD Swiss Pairing ${index + 1} B`),
        stage: "Stage 3 Day 2",
      }),
    );
  }

  return [];
}

export function getManualMatches(base = new Date()): CSMatch[] {
  const iemMajorMatches = getIemMajorMatches(base);
  if (iemMajorMatches.length > 0) {
    return iemMajorMatches;
  }

  const firstStart = atToday(18, 30, base);
  const secondStart = atToday(21, 0, base);

  return [
    {
      id: `manual-aurora-northstar-${firstStart.slice(0, 10)}`,
      providerSources: ["Manual Stats"],
      dataFreshness: "Manual stats reviewed today",
      status: statusFor(firstStart),
      startsAt: firstStart,
      event: "Counter Circuit Invitational",
      stage: "Group A upper bracket",
      bestOf: 3,
      teamA: aurora,
      teamB: northstar,
      maps: [
        { map: "Mirage", state: "expected", lean: "teamA" },
        { map: "Ancient", state: "expected", lean: "teamB" },
        { map: "Nuke", state: "decider", lean: "teamA" },
      ],
      mapWinRates: [
        { map: "Mirage", teamA: 68, teamB: 48, sampleA: 19, sampleB: 21, note: "AUR stronger T-side conversion" },
        { map: "Ancient", teamA: 54, teamB: 61, sampleA: 13, sampleB: 18, note: "NAC highest comfort map" },
        { map: "Nuke", teamA: 63, teamB: 44, sampleA: 16, sampleB: 9, note: "Small NAC sample" },
        { map: "Anubis", teamA: 58, teamB: 52, sampleA: 12, sampleB: 15 },
      ],
      headToHead: [
        { date: "May 19", event: "Metro Masters", winner: "Aurora Wolves", score: "2-1", maps: ["Mirage", "Ancient", "Nuke"] },
        { date: "Apr 28", event: "Counter Circuit Qualifier", winner: "Northstar AC", score: "13-11", maps: ["Ancient"] },
        { date: "Mar 14", event: "Spring Clash", winner: "Aurora Wolves", score: "2-0", maps: ["Inferno", "Mirage"] },
      ],
      rosterNotes: [
        "No verified stand-in from approved data sources.",
        "Northstar has a travel-related coach note, so lineups should be confirmed pre-match.",
      ],
      marketSnapshots: [
        { provider: "Manual Stats", capturedAt: new Date().toISOString(), teamAOdds: 1.72, teamBOdds: 2.12, note: "Manual odds entry for private research only." },
      ],
    },
    {
      id: `manual-ember-cobalt-${secondStart.slice(0, 10)}`,
      providerSources: ["Manual Stats"],
      dataFreshness: "Manual stats reviewed today",
      status: statusFor(secondStart),
      startsAt: secondStart,
      event: "Counter Circuit Invitational",
      stage: "Group B elimination match",
      bestOf: 3,
      teamA: ember,
      teamB: cobalt,
      maps: [
        { map: "Inferno", state: "picked", lean: "teamB" },
        { map: "Anubis", state: "expected", lean: "teamB" },
        { map: "Vertigo", state: "decider", lean: "even" },
      ],
      mapWinRates: [
        { map: "Inferno", teamA: 41, teamB: 64, sampleA: 17, sampleB: 22, note: "CBL likely opener edge" },
        { map: "Anubis", teamA: 39, teamB: 56, sampleA: 18, sampleB: 16, note: "EMB weak late CT holds" },
        { map: "Vertigo", teamA: 50, teamB: 51, sampleA: 10, sampleB: 12, note: "Near coin flip" },
        { map: "Nuke", teamA: 58, teamB: 45, sampleA: 12, sampleB: 11 },
      ],
      headToHead: [
        { date: "Jun 9", event: "Counter Circuit Invitational", winner: "Cobalt Line", score: "2-1", maps: ["Inferno", "Anubis", "Vertigo"] },
        { date: "Apr 16", event: "Atlantic Cup", winner: "Cobalt Line", score: "13-9", maps: ["Inferno"] },
      ],
      rosterNotes: [
        "Ember role changes are recent and may add veto volatility.",
        "Cobalt roster stability grades better in the manual 30-map sample.",
      ],
      marketSnapshots: [
        { provider: "Manual Stats", capturedAt: new Date().toISOString(), teamAOdds: 2.24, teamBOdds: 1.66, note: "Manual odds entry for private research only." },
      ],
    },
  ];
}

export const seedJournalEntries: BetJournalEntry[] = [
  {
    id: "seed-1",
    matchId: "seed",
    matchName: "Aurora Wolves vs Northstar AC",
    betType: "Moneyline",
    odds: 1.78,
    stake: 50,
    predictionConfidence: 68,
    result: "win",
    profitLoss: 39,
    notes: "Map pool edge held after Mirage pick.",
    team: "Aurora Wolves",
    createdAt: atToday(10, 15),
  },
  {
    id: "seed-2",
    matchId: "seed",
    matchName: "Ember Protocol vs Cobalt Line",
    betType: "Map 1",
    odds: 1.91,
    stake: 35,
    predictionConfidence: 61,
    result: "loss",
    profitLoss: -35,
    notes: "Avoid if roster note appears again.",
    team: "Cobalt Line",
    createdAt: atToday(11, 40),
  },
  {
    id: "seed-3",
    matchId: "seed",
    matchName: "Dust Union vs White Peak",
    betType: "Wait Live",
    odds: 2.05,
    stake: 25,
    predictionConfidence: 57,
    result: "pending",
    profitLoss: 0,
    notes: "Watched pistol and first gun round before entry.",
    team: "White Peak",
    createdAt: atToday(12, 5),
  },
];

export function getManualLiveSnapshot(match: CSMatch): LiveSnapshot {
  const tick = Math.floor(Date.now() / 20000);
  const wave = ((tick % 9) - 4) * 1.7;
  const mapEdge =
    match.mapWinRates.reduce((sum, map) => sum + (map.teamA - map.teamB), 0) /
    Math.max(match.mapWinRates.length, 1);
  const base = Math.max(32, Math.min(68, 50 + mapEdge / 3 + wave));
  const teamAProbability = Math.round(base);

  return {
    matchId: match.id,
    updatedAt: new Date().toISOString(),
    status: match.status === "finished" ? "finished" : "live",
    currentMap: match.maps[0]?.map ?? "TBD",
    roundScore: `${Math.max(0, 6 + (tick % 6))}-${Math.max(0, 5 + ((tick + 3) % 6))}`,
    teamAProbability,
    teamBProbability: 100 - teamAProbability,
    momentum:
      teamAProbability >= 55
        ? [
            `${match.teamA.shortName} trading is ahead over the last simulated update window.`,
            "Live estimate still needs economy and lineup confirmation from an approved live feed.",
          ]
        : [
            `${match.teamB.shortName} is showing stronger conversion pressure in the simulated live window.`,
            "Wait for confirmed weapon economy before treating this as an actionable edge.",
          ],
  };
}
