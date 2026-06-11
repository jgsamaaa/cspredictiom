import Link from "next/link";
import { Activity, BarChart3, BookOpenCheck, Radio } from "lucide-react";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { MatchTable } from "@/components/matches/match-table";
import { MetricCard } from "@/components/ui/metric-card";
import { buildAnalytics } from "@/lib/analytics/journal";
import { getTodaysMatches } from "@/lib/data/providers";
import { formatCurrency, formatMatchTime } from "@/lib/format";
import { getJournalEntries } from "@/lib/journal-store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [matches, journalEntries] = await Promise.all([
    getTodaysMatches(),
    getJournalEntries(),
  ]);
  const analytics = buildAnalytics(journalEntries);
  const liveCount = matches.filter((match) => match.status === "live").length;
  const nextMatch = matches[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Today&apos;s CS2 Board
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Private probability estimates built from approved providers and manual stats.
          </p>
        </div>
        {nextMatch ? (
          <Link
            href={`/matches/${nextMatch.id}`}
            className="focus-ring inline-flex h-10 items-center justify-center rounded-md border border-teal-400/40 bg-teal-400/10 px-3 text-sm font-semibold text-teal-100 transition hover:bg-teal-400/15"
          >
            Open next match
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Matches today"
          value={String(matches.length)}
          detail="Schedule from approved API or manual entry."
          icon={<Activity size={18} />}
        />
        <MetricCard
          label="Live"
          value={String(liveCount)}
          detail="Live mode refreshes detail estimates."
          icon={<Radio size={18} />}
        />
        <MetricCard
          label="Journal ROI"
          value={`${analytics.roi.toFixed(1)}%`}
          detail={`${formatCurrency(analytics.netProfit)} net across saved entries.`}
          icon={<BarChart3 size={18} />}
        />
        <MetricCard
          label="Logged bets"
          value={String(analytics.totalBets)}
          detail="Personal research journal only."
          icon={<BookOpenCheck size={18} />}
        />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <MatchTable matches={matches} />
        <section className="panel rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-100">Next Match Context</h2>
          {nextMatch ? (
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-4">
                <p className="text-lg font-semibold text-slate-50">
                  {nextMatch.teamA.shortName} vs {nextMatch.teamB.shortName}
                </p>
                <p className="mt-1 text-sm text-slate-400">{nextMatch.event}</p>
                <p className="mt-3 font-mono text-xs text-teal-200">
                  {formatMatchTime(nextMatch.startsAt)}
                </p>
              </div>
              {nextMatch.maps.slice(0, 3).map((map) => (
                <div key={map.map} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/45 px-3 py-2">
                  <span className="text-sm text-slate-300">{map.map}</span>
                  <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    {map.state}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No matches found for today.</p>
          )}
        </section>
      </div>

      <AnalyticsDashboard summary={analytics} />
    </div>
  );
}
