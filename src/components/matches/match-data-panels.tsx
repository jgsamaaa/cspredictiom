import { AlertTriangle, Swords } from "lucide-react";
import { FullPreviewPanels } from "@/components/matches/full-preview-panels";
import type { CSMatch, TeamProfile } from "@/lib/types";
import { formatMatchTime, formatPercent } from "@/lib/format";
import { TeamFormStrip } from "@/components/matches/team-form-strip";
import { StatusPill } from "@/components/ui/status-pill";

function PlayerTable({ team }: { team: TeamProfile }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40">
      <div className="border-b border-slate-800 px-3 py-2">
        <h3 className="text-sm font-semibold text-slate-100">{team.shortName} players</h3>
      </div>
      <div className="thin-scrollbar overflow-x-auto">
        <table className="w-full min-w-[440px] text-left text-xs">
          <thead className="uppercase tracking-[0.12em] text-slate-500">
            <tr className="border-b border-slate-800">
              <th className="px-3 py-2 font-medium">Player</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Rating</th>
              <th className="px-3 py-2 font-medium">ADR</th>
              <th className="px-3 py-2 font-medium">KAST</th>
            </tr>
          </thead>
          <tbody>
            {team.players.length ? (
              team.players.map((player) => (
                <tr key={player.name} className="border-b border-slate-800/70">
                  <td className="px-3 py-2 font-medium text-slate-100">{player.name}</td>
                  <td className="px-3 py-2 text-slate-400">{player.role}</td>
                  <td className="px-3 py-2 font-mono text-teal-200">{player.rating.toFixed(2)}</td>
                  <td className="px-3 py-2 font-mono text-slate-300">{player.adr.toFixed(1)}</td>
                  <td className="px-3 py-2 font-mono text-slate-300">{player.kast.toFixed(1)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-slate-500">
                  No player stats attached from approved/manual data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MatchDataPanels({ match }: { match: CSMatch }) {
  return (
    <div className="space-y-4">
      <section className="panel rounded-lg p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <StatusPill status={match.status} />
              <span className="text-xs text-slate-500">Bo{match.bestOf}</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">
              {match.teamA.name} <span className="text-slate-500">vs</span>{" "}
              {match.teamB.name}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {match.event} - {match.stage}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-right">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Start</p>
            <p className="mt-1 font-mono text-sm text-slate-100">
              {formatMatchTime(match.startsAt)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <TeamFormStrip team={match.teamA} />
        <TeamFormStrip team={match.teamB} />
      </div>

      <FullPreviewPanels match={match} />

      <section className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <Swords size={17} className="text-amber-200" />
          <h2 className="text-sm font-semibold text-slate-100">Map Info And Win Rates</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {match.mapWinRates.length ? (
            match.mapWinRates.map((map) => (
              <div key={map.map} className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-100">{map.map}</h3>
                  <span className="text-[11px] text-slate-500">
                    {map.sampleA}/{map.sampleB} maps
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{match.teamA.shortName}</span>
                      <span>{formatPercent(map.teamA)}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded bg-slate-800">
                      <div className="h-1.5 rounded bg-teal-300" style={{ width: `${map.teamA}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{match.teamB.shortName}</span>
                      <span>{formatPercent(map.teamB)}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded bg-slate-800">
                      <div className="h-1.5 rounded bg-amber-300" style={{ width: `${map.teamB}%` }} />
                    </div>
                  </div>
                </div>
                {map.note ? <p className="mt-3 text-xs leading-5 text-slate-500">{map.note}</p> : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Map rates are not attached yet.</p>
          )}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel rounded-lg p-4">
          <h2 className="text-sm font-semibold text-slate-100">Head-To-Head</h2>
          <div className="mt-3 space-y-2">
            {match.headToHead.length ? (
              match.headToHead.map((entry) => (
                <div key={`${entry.date}-${entry.event}`} className="rounded-md border border-slate-800 bg-slate-950/45 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-100">{entry.winner}</p>
                    <span className="font-mono text-xs text-teal-200">{entry.score}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {entry.date} - {entry.event} - {entry.maps.join(", ")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No approved/manual H2H sample attached.</p>
            )}
          </div>
        </section>

        <section className="panel rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={17} className="text-amber-200" />
            <h2 className="text-sm font-semibold text-slate-100">Roster / Stand-In Notes</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {[...match.teamA.rosterNotes, ...match.teamB.rosterNotes, ...match.rosterNotes].map((note, index) => (
              <li key={`${index}-${note}`} className="rounded-md border border-slate-800 bg-slate-950/45 px-3 py-2 text-sm text-slate-400">
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PlayerTable team={match.teamA} />
        <PlayerTable team={match.teamB} />
      </div>
    </div>
  );
}
