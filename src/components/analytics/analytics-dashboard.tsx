import { BarChart3, Percent, Sigma, Trophy } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { AnalyticsSummary } from "@/lib/types";
import { MetricCard } from "@/components/ui/metric-card";

function RankedList({
  title,
  items,
  valueLabel,
}: {
  title: string;
  items: Array<{ name: string; bets: number; profitLoss?: number; roi?: number }>;
  valueLabel: "profit" | "roi";
}) {
  return (
    <section className="panel rounded-lg p-4">
      <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div key={item.name} className="rounded-md border border-slate-800 bg-slate-950/45 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-100">{item.name}</p>
                <p className="font-mono text-sm text-teal-200">
                  {valueLabel === "profit"
                    ? formatCurrency(item.profitLoss ?? 0)
                    : formatPercent(item.roi ?? 0, 1)}
                </p>
              </div>
              <div className="mt-2 h-1.5 rounded bg-slate-800">
                <div
                  className="h-1.5 rounded bg-teal-300"
                  style={{
                    width: `${Math.min(100, Math.max(8, Math.abs(item.profitLoss ?? item.roi ?? 0)))}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{item.bets} bets</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No settled data yet.</p>
        )}
      </div>
    </section>
  );
}

export function AnalyticsDashboard({ summary }: { summary: AnalyticsSummary }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total bets"
          value={String(summary.totalBets)}
          detail="All logged research entries."
          icon={<Sigma size={18} />}
        />
        <MetricCard
          label="Win rate"
          value={formatPercent(summary.winRate, 1)}
          detail="Settled wins over settled wins/losses."
          icon={<Percent size={18} />}
        />
        <MetricCard
          label="ROI"
          value={formatPercent(summary.roi, 1)}
          detail="Net return divided by total stake."
          icon={<BarChart3 size={18} />}
        />
        <MetricCard
          label="Net P/L"
          value={formatCurrency(summary.netProfit)}
          detail="Pending, push, and void entries count as zero P/L."
          icon={<Trophy size={18} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <RankedList title="Best Teams" items={summary.bestTeams} valueLabel="profit" />
        <RankedList title="Worst Teams" items={summary.worstTeams} valueLabel="profit" />
        <RankedList title="Best Bet Types" items={summary.bestBetTypes} valueLabel="roi" />
      </div>
    </div>
  );
}
