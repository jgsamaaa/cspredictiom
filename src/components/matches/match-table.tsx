import Link from "next/link";
import { ArrowUpRight, MapPinned } from "lucide-react";
import { formatShortTime } from "@/lib/format";
import type { CSMatch } from "@/lib/types";
import { StatusPill } from "@/components/ui/status-pill";

export function MatchTable({
  matches,
  title = "CS2 Matches",
  subtitle = "Approved provider data with manual stats fallback.",
}: {
  matches: CSMatch[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section id="matches" className="panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <MapPinned size={18} className="text-teal-300" />
      </div>
      <div className="thin-scrollbar w-full overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Match</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Format</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr
                key={match.id}
                className="border-b border-slate-800/80 transition hover:bg-slate-900/60"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-300">
                  {formatShortTime(match.startsAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-100">
                    {match.teamA.name} <span className="text-slate-500">vs</span>{" "}
                    {match.teamB.name}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Rank {match.teamA.rank || "TBD"} / {match.teamB.rank || "TBD"}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{match.event}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                  Bo{match.bestOf}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={match.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {match.providerSources.join(" + ")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/matches/${match.id}`}
                    className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-300 transition hover:border-teal-400/60 hover:text-teal-200"
                    aria-label={`Open ${match.teamA.name} versus ${match.teamB.name}`}
                    title="Open match detail"
                  >
                    <ArrowUpRight size={15} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
