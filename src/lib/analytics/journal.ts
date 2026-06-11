import type { AnalyticsSummary, BetJournalEntry } from "@/lib/types";

function safeRoi(profit: number, stake: number) {
  if (stake <= 0) return 0;
  return (profit / stake) * 100;
}

export function buildAnalytics(entries: BetJournalEntry[]): AnalyticsSummary {
  const settled = entries.filter((entry) => entry.result === "win" || entry.result === "loss");
  const totalStake = entries.reduce((sum, entry) => sum + entry.stake, 0);
  const netProfit = entries.reduce((sum, entry) => sum + entry.profitLoss, 0);
  const wins = settled.filter((entry) => entry.result === "win").length;

  const teamMap = new Map<string, { profitLoss: number; bets: number }>();
  const betTypeMap = new Map<string, { profitLoss: number; stake: number; bets: number }>();

  for (const entry of entries) {
    const teamName = entry.team ?? entry.matchName.split(" vs ")[0] ?? "Unknown";
    const team = teamMap.get(teamName) ?? { profitLoss: 0, bets: 0 };
    team.profitLoss += entry.profitLoss;
    team.bets += 1;
    teamMap.set(teamName, team);

    const betType = betTypeMap.get(entry.betType) ?? { profitLoss: 0, stake: 0, bets: 0 };
    betType.profitLoss += entry.profitLoss;
    betType.stake += entry.stake;
    betType.bets += 1;
    betTypeMap.set(entry.betType, betType);
  }

  const teams = [...teamMap.entries()].map(([name, value]) => ({
    name,
    ...value,
  }));

  return {
    totalBets: entries.length,
    winRate: settled.length ? (wins / settled.length) * 100 : 0,
    roi: safeRoi(netProfit, totalStake),
    netProfit,
    bestTeams: [...teams].sort((a, b) => b.profitLoss - a.profitLoss).slice(0, 4),
    worstTeams: [...teams].sort((a, b) => a.profitLoss - b.profitLoss).slice(0, 4),
    bestBetTypes: [...betTypeMap.entries()]
      .map(([name, value]) => ({
        name,
        roi: safeRoi(value.profitLoss, value.stake),
        bets: value.bets,
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 4),
  };
}
