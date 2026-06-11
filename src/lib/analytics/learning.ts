import type {
  AnalystResult,
  BetJournalEntry,
  CSMatch,
  LearningProfile,
} from "@/lib/types";

function settled(entries: BetJournalEntry[]) {
  return entries.filter((entry) => entry.result === "win" || entry.result === "loss");
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function winRate(entries: BetJournalEntry[]) {
  if (!entries.length) return 0;
  return (entries.filter((entry) => entry.result === "win").length / entries.length) * 100;
}

function roi(entries: BetJournalEntry[]) {
  const stake = entries.reduce((sum, entry) => sum + entry.stake, 0);
  if (stake <= 0) return 0;
  return (entries.reduce((sum, entry) => sum + entry.profitLoss, 0) / stake) * 100;
}

function bucketFor(confidence: number) {
  if (confidence < 55) return "1-54";
  if (confidence < 65) return "55-64";
  if (confidence < 75) return "65-74";
  if (confidence < 85) return "75-84";
  return "85-100";
}

function teamEntries(entries: BetJournalEntry[], teamName: string) {
  return entries.filter(
    (entry) => entry.team === teamName || entry.matchName.includes(teamName),
  );
}

export function buildLearningProfile(
  journalEntries: BetJournalEntry[],
  match: CSMatch,
): LearningProfile {
  const settledEntries = settled(journalEntries);
  const totalSettled = settledEntries.length;
  const learnedWinRate = winRate(settledEntries);
  const learnedRoi = roi(settledEntries);
  const averageConfidence = average(
    settledEntries.map((entry) => entry.predictionConfidence),
  );
  const overconfidence =
    totalSettled > 0 ? averageConfidence - learnedWinRate : 0;

  const confidenceAdjustment =
    totalSettled < 5
      ? 0
      : Math.round(clamp((learnedWinRate - 50) / 4 - overconfidence / 6, -10, 8));

  const bucketMap = new Map<string, BetJournalEntry[]>();
  for (const entry of settledEntries) {
    const bucket = bucketFor(entry.predictionConfidence);
    bucketMap.set(bucket, [...(bucketMap.get(bucket) ?? []), entry]);
  }

  const confidenceBuckets = ["1-54", "55-64", "65-74", "75-84", "85-100"].map(
    (label) => {
      const entries = bucketMap.get(label) ?? [];
      return {
        label,
        bets: entries.length,
        winRate: winRate(entries),
        averageConfidence: average(entries.map((entry) => entry.predictionConfidence)),
      };
    },
  );

  const teamAHistory = teamEntries(settledEntries, match.teamA.name);
  const teamBHistory = teamEntries(settledEntries, match.teamB.name);
  const currentMatchSignals = [
    teamAHistory.length
      ? `${match.teamA.name}: ${teamAHistory.length} settled journal bets, ${winRate(teamAHistory).toFixed(1)}% win rate, ${roi(teamAHistory).toFixed(1)}% ROI.`
      : `${match.teamA.name}: no settled journal history yet.`,
    teamBHistory.length
      ? `${match.teamB.name}: ${teamBHistory.length} settled journal bets, ${winRate(teamBHistory).toFixed(1)}% win rate, ${roi(teamBHistory).toFixed(1)}% ROI.`
      : `${match.teamB.name}: no settled journal history yet.`,
  ];

  return {
    totalSettled,
    winRate: learnedWinRate,
    roi: learnedRoi,
    averageConfidence,
    confidenceAdjustment,
    confidenceBuckets,
    currentMatchSignals,
    promptSummary:
      totalSettled < 5
        ? `Only ${totalSettled} settled journal entries are available. Treat learning data as weak and avoid major confidence changes.`
        : `Past settled journal: ${totalSettled} bets, ${learnedWinRate.toFixed(1)}% win rate, ${learnedRoi.toFixed(1)}% ROI, average confidence ${averageConfidence.toFixed(1)}. Apply a ${confidenceAdjustment >= 0 ? "+" : ""}${confidenceAdjustment} confidence calibration before final recommendation.`,
  };
}

export function applyLearningCalibration(
  result: AnalystResult,
  learningProfile: LearningProfile,
): AnalystResult {
  const adjustedConfidence = Math.round(
    clamp(result.confidence + learningProfile.confidenceAdjustment, 1, 100),
  );

  const learningFlags =
    learningProfile.totalSettled < 5
      ? [
          `Learning mode has only ${learningProfile.totalSettled} settled journal entries, so calibration is limited.`,
        ]
      : [
          `Learning calibration applied: ${learningProfile.confidenceAdjustment >= 0 ? "+" : ""}${learningProfile.confidenceAdjustment} confidence based on ${learningProfile.totalSettled} settled journal entries.`,
          ...learningProfile.currentMatchSignals,
        ];

  return {
    ...result,
    confidence: adjustedConfidence,
    riskFlags: [...result.riskFlags, ...learningFlags].slice(0, 8),
  };
}
