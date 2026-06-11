import type { TeamProfile } from "@/lib/types";

export function TeamFormStrip({ team }: { team: TeamProfile }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{team.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Rank {team.rank || "TBD"} - Power {team.powerRating.toFixed(1)}
          </p>
        </div>
        <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-xs text-teal-200">
          {team.shortName}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {team.form.length ? (
          team.form.map((entry) => (
            <div
              key={`${team.id}-${entry.date}-${entry.opponent}`}
              className={`rounded-md border p-2 ${
                entry.result === "W"
                  ? "border-teal-400/30 bg-teal-400/10"
                  : "border-rose-400/30 bg-rose-400/10"
              }`}
            >
              <p className="font-mono text-sm font-semibold text-slate-100">
                {entry.result}
              </p>
              <p className="mt-1 truncate text-[11px] text-slate-500">{entry.score}</p>
            </div>
          ))
        ) : (
          <p className="col-span-5 text-sm text-slate-500">No form data attached.</p>
        )}
      </div>
    </div>
  );
}
