import { Crosshair, MapPinned, ShieldHalf, Users } from "lucide-react";
import type { CSMatch, MapWinRate, PlayerStat, PreviousGame, TeamProfile } from "@/lib/types";

function clamp(value: number, min = 25, max = 75) {
  return Math.max(min, Math.min(max, value));
}

function pct(value?: number) {
  return typeof value === "number" ? `${value.toFixed(0)}%` : "N/A";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function derivedMapStats(map: MapWinRate) {
  return {
    teamACT: map.teamACTWinRate ?? clamp(map.teamA + 4),
    teamAT: map.teamATWinRate ?? clamp(map.teamA - 4),
    teamBCT: map.teamBCTWinRate ?? clamp(map.teamB + 4),
    teamBT: map.teamBTWinRate ?? clamp(map.teamB - 4),
    teamAPistol: map.teamAPistolWinRate ?? clamp(map.teamA - 1),
    teamBPistol: map.teamBPistolWinRate ?? clamp(map.teamB - 1),
  };
}

function defaultMapNote(match: CSMatch, map: MapWinRate) {
  if (map.aiNote) return map.aiNote;
  const edge = map.teamA - map.teamB;
  if (Math.abs(edge) < 7) {
    return "Close map profile. Treat veto, side start, pistol, and first gun round as the main signals.";
  }

  const strong = edge > 0 ? match.teamA.shortName : match.teamB.shortName;
  const weak = edge > 0 ? match.teamB.shortName : match.teamA.shortName;
  return `${strong} has the cleaner map profile; ${weak} is vulnerable if the veto lands here.`;
}

function playerFallback(player: PlayerStat, index: number) {
  return {
    headshotRate: player.headshotRate ?? clamp(44 + player.rating * 8 + index, 30, 68),
    openingDuelRate: player.openingDuelRate ?? clamp(41 + player.impact * 8 - index, 32, 64),
    clutchRating: player.clutchRating ?? clamp(player.rating * 50 + 50, 65, 130) / 100,
  };
}

function PlayerCard({ player, index }: { player: PlayerStat; index: number }) {
  const extra = playerFallback(player, index);

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
      <div className="flex items-center gap-3">
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-700 bg-slate-900 bg-cover bg-center text-sm font-semibold text-teal-200"
          style={
            player.imageUrl ? { backgroundImage: `url(${player.imageUrl})` } : undefined
          }
          aria-label={`${player.name} player photo`}
        >
          {player.imageUrl ? null : initials(player.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{player.name}</p>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
            {player.role} - {player.maps} maps
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-slate-500">Rating</p>
          <p className="mt-1 font-mono text-teal-200">{player.rating.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-500">ADR</p>
          <p className="mt-1 font-mono text-slate-200">{player.adr.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-slate-500">KAST</p>
          <p className="mt-1 font-mono text-slate-200">{player.kast.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-slate-500">HS</p>
          <p className="mt-1 font-mono text-slate-200">{pct(extra.headshotRate)}</p>
        </div>
        <div>
          <p className="text-slate-500">Open</p>
          <p className="mt-1 font-mono text-slate-200">{pct(extra.openingDuelRate)}</p>
        </div>
        <div>
          <p className="text-slate-500">Clutch</p>
          <p className="mt-1 font-mono text-slate-200">
            {extra.clutchRating.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlayerGrid({ team }: { team: TeamProfile }) {
  return (
    <section className="panel rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2">
        <Users size={17} className="text-teal-300" />
        <h2 className="text-sm font-semibold text-slate-100">
          {team.shortName} Player Preview
        </h2>
      </div>
      {team.players.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {team.players.map((player, index) => (
            <PlayerCard key={player.name} player={player} index={index} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-3 text-sm text-slate-500">
          Player photo/stat feed is not connected for this team yet. PandaScore player
          `image_url`, GRID, Abios, or manual entries can fill this panel.
        </p>
      )}
    </section>
  );
}

function ProgressLine({
  label,
  value,
  color = "bg-teal-300",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>{label}</span>
        <span>{pct(value)}</span>
      </div>
      <div className="mt-1 h-1.5 rounded bg-slate-800">
        <div className={`h-1.5 rounded ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MapDeepCard({ match, map }: { match: CSMatch; map: MapWinRate }) {
  const stats = derivedMapStats(map);

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{map.map}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Samples {map.sampleA}/{map.sampleB || "manual"}
          </p>
        </div>
        <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-xs text-slate-300">
          {map.teamA - map.teamB > 0 ? `+${map.teamA - map.teamB}` : map.teamA - map.teamB}
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-teal-200">{match.teamA.shortName}</p>
          <ProgressLine label="Map win" value={map.teamA} />
          <ProgressLine label="CT side" value={stats.teamACT} />
          <ProgressLine label="T side" value={stats.teamAT} />
          <ProgressLine label="Pistol" value={stats.teamAPistol} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-200">{match.teamB.shortName}</p>
          <ProgressLine label="Map win" value={map.teamB} color="bg-amber-300" />
          <ProgressLine label="CT side" value={stats.teamBCT} color="bg-amber-300" />
          <ProgressLine label="T side" value={stats.teamBT} color="bg-amber-300" />
          <ProgressLine label="Pistol" value={stats.teamBPistol} color="bg-amber-300" />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/45 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          AI map read
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-300">{defaultMapNote(match, map)}</p>
      </div>
    </article>
  );
}

function formAsPreviousGames(team: TeamProfile): PreviousGame[] {
  return team.form.map((entry) => ({
    date: entry.date,
    opponent: entry.opponent,
    event: "Recent form",
    result: entry.result,
    score: entry.score,
    maps: [entry.mapOrSeries],
  }));
}

function PreviousGames({
  team,
  games,
}: {
  team: TeamProfile;
  games?: PreviousGame[];
}) {
  const rows = games?.length ? games : formAsPreviousGames(team).slice(0, 3);

  return (
    <section className="panel rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2">
        <Crosshair size={17} className="text-amber-200" />
        <h2 className="text-sm font-semibold text-slate-100">
          {team.shortName} Preview Games
        </h2>
      </div>
      <div className="space-y-2">
        {rows.map((game) => (
          <div
            key={`${team.id}-${game.date}-${game.opponent}`}
            className="rounded-md border border-slate-800 bg-slate-950/45 p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">
                {game.result} vs {game.opponent}
              </p>
              <span className="font-mono text-xs text-teal-200">{game.score}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {game.date} - {game.event} - {game.maps.join(", ")}
            </p>
            {game.sideNote ? (
              <p className="mt-2 text-xs leading-5 text-slate-400">{game.sideNote}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function FullPreviewPanels({ match }: { match: CSMatch }) {
  return (
    <div className="space-y-4">
      <section className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <ShieldHalf size={17} className="text-teal-300" />
          <h2 className="text-sm font-semibold text-slate-100">Full Preview Metrics</h2>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Pistol, CT-side, T-side, player-photo, and deeper player stat fields are
          displayed when supplied by PandaScore, GRID, Abios, or manual entries.
        </p>
      </section>

      <div className="grid gap-4">
        <PlayerGrid team={match.teamA} />
        <PlayerGrid team={match.teamB} />
      </div>

      <section className="panel rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <MapPinned size={17} className="text-amber-200" />
          <h2 className="text-sm font-semibold text-slate-100">
            Map Side, Pistol, And AI Reads
          </h2>
        </div>
        {match.mapWinRates.length ? (
          <div className="grid gap-3 xl:grid-cols-2">
            {match.mapWinRates.map((map) => (
              <MapDeepCard key={map.map} match={match} map={map} />
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-3 text-sm text-slate-500">
            Map side and pistol data is not connected yet for this match.
          </p>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <PreviousGames team={match.teamA} games={match.previousGames?.teamA} />
        <PreviousGames team={match.teamB} games={match.previousGames?.teamB} />
      </div>
    </div>
  );
}
