import type { AnalystResult, CSMatch, LiveSnapshot, RecommendationAction } from "@/lib/types";

function winRateFromForm(results: { result: "W" | "L" }[]) {
  if (results.length === 0) return 0.5;
  return results.filter((entry) => entry.result === "W").length / results.length;
}

function avg(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function analyzeMatch(match: CSMatch, live?: LiveSnapshot): AnalystResult {
  const formEdge =
    (winRateFromForm(match.teamA.form) - winRateFromForm(match.teamB.form)) * 24;
  const ratingEdge = (match.teamA.powerRating - match.teamB.powerRating) * 0.55;
  const mapEdge =
    match.mapWinRates.length > 0
      ? avg(match.mapWinRates.map((map) => map.teamA - map.teamB)) * 0.22
      : 0;
  const playerEdge =
    (avg(match.teamA.players.map((player) => player.rating)) -
      avg(match.teamB.players.map((player) => player.rating))) *
    25;
  const h2hEdge =
    match.headToHead.filter((entry) => entry.winner === match.teamA.name).length -
    match.headToHead.filter((entry) => entry.winner === match.teamB.name).length;
  const rosterPenalty =
    match.rosterNotes.join(" ").toLowerCase().includes("stand-in") ||
    match.teamB.rosterNotes.join(" ").toLowerCase().includes("travel")
      ? 2.5
      : 0;
  const liveEdge = live ? (live.teamAProbability - 50) * 0.7 : 0;

  const edge = formEdge + ratingEdge + mapEdge + playerEdge + h2hEdge * 2 + rosterPenalty + liveEdge;
  const teamAProbability = Math.round(clamp(50 + edge, 24, 76));
  const teamBProbability = 100 - teamAProbability;
  const favorite = teamAProbability >= teamBProbability ? match.teamA : match.teamB;
  const favoriteProbability = Math.max(teamAProbability, teamBProbability);
  const confidence = Math.round(
    clamp(
      48 +
        Math.abs(teamAProbability - 50) * 1.25 +
        Math.min(match.mapWinRates.length * 2, 8) +
        Math.min(match.headToHead.length, 4) -
        (match.rosterNotes.length > 1 ? 3 : 0),
      35,
      92,
    ),
  );

  let recommendedAction: RecommendationAction = "Avoid";
  if (confidence < 58 || favoriteProbability < 56) {
    recommendedAction = "Avoid";
  } else if (
    match.status === "live" ||
    match.maps.some((map) => map.map === "TBD" || map.state === "unknown")
  ) {
    recommendedAction = "Wait Live";
  } else if (favorite.id === match.teamA.id) {
    recommendedAction = "Bet Team A";
  } else {
    recommendedAction = "Bet Team B";
  }

  const reasoning = [
    `${match.teamA.shortName} form edge: ${(winRateFromForm(match.teamA.form) * 100).toFixed(0)}% recent wins vs ${(winRateFromForm(match.teamB.form) * 100).toFixed(0)}% for ${match.teamB.shortName}.`,
    match.mapWinRates.length
      ? `Map pool composite leans ${mapEdge >= 0 ? match.teamA.shortName : match.teamB.shortName} by ${Math.abs(mapEdge).toFixed(1)} model points.`
      : "Map pool data is not attached yet, so the model reduces certainty.",
    match.teamA.players.length && match.teamB.players.length
      ? `Player rating average is ${avg(match.teamA.players.map((player) => player.rating)).toFixed(2)} vs ${avg(match.teamB.players.map((player) => player.rating)).toFixed(2)}.`
      : "Player-level stats are missing from approved/manual data, lowering confidence.",
    live
      ? `Live signal currently has ${match.teamA.shortName} at ${live.teamAProbability}% and ${match.teamB.shortName} at ${live.teamBProbability}%.`
      : "No live signal included in this pre-match run.",
  ];

  const riskFlags = [
    ...match.rosterNotes,
    ...(match.maps.some((map) => map.map === "TBD" || map.state === "unknown")
      ? ["Map veto is not confirmed."]
      : []),
    "Research estimate only. It is not guaranteed betting advice.",
  ];

  return {
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    summary: `${favorite.name} grades as the model side at ${favoriteProbability}% implied win probability, with a ${confidence}/100 confidence score.`,
    confidence,
    recommendedAction,
    teamAProbability,
    teamBProbability,
    reasoning,
    riskFlags,
    dataSources: match.providerSources,
  };
}
