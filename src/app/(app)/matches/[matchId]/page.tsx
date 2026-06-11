import { notFound } from "next/navigation";
import { AnalysisPanel } from "@/components/matches/analysis-panel";
import { LiveMatchPanel } from "@/components/matches/live-match-panel";
import { MatchDataPanels } from "@/components/matches/match-data-panels";
import { getManualLiveSnapshot } from "@/lib/data/manual-data";
import { getMatchById } from "@/lib/data/providers";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const match = await getMatchById(matchId);

  if (!match) notFound();

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
      <MatchDataPanels match={match} />
      <div className="min-w-0 space-y-5">
        <AnalysisPanel match={match} />
        <LiveMatchPanel match={match} initialSnapshot={getManualLiveSnapshot(match)} />
        <section className="panel rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-100">Data Provenance</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {match.providerSources.map((source) => (
              <span
                key={source}
                className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300"
              >
                {source}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            {match.dataFreshness}. This app does not scrape HLTV directly.
          </p>
        </section>
      </div>
    </div>
  );
}
