"use client";

import { useCallback, useEffect, useState } from "react";
import { Radio, RefreshCw } from "lucide-react";
import type { CSMatch, LiveSnapshot } from "@/lib/types";

export function LiveMatchPanel({
  match,
  initialSnapshot,
}: {
  match: CSMatch;
  initialSnapshot: LiveSnapshot;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [enabled, setEnabled] = useState(match.status === "live");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/live/${match.id}`, { cache: "no-store" });
      if (response.ok) {
        setSnapshot((await response.json()) as LiveSnapshot);
      }
    } finally {
      setLoading(false);
    }
  }, [match.id]);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(refresh, 15000);
    return () => window.clearInterval(id);
  }, [enabled, refresh]);

  return (
    <section className="panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-amber-200" />
            <h2 className="text-sm font-semibold text-slate-100">Live Match Mode</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tracks live provider data when connected; otherwise uses manual fallback estimates.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEnabled((value) => !value)}
            className={`focus-ring h-9 rounded-md border px-3 text-sm font-medium transition ${
              enabled
                ? "border-teal-400/50 bg-teal-400/10 text-teal-100"
                : "border-slate-700 bg-slate-950 text-slate-400"
            }`}
          >
            {enabled ? "Live On" : "Live Off"}
          </button>
          <button
            type="button"
            onClick={refresh}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-slate-300 transition hover:border-teal-400/60 hover:text-teal-200"
            aria-label="Refresh live data"
            title="Refresh live data"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/45 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Current map</p>
            <p className="mt-1 text-lg font-semibold text-slate-50">{snapshot.currentMap}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Rounds</p>
            <p className="mt-1 font-mono text-lg font-semibold text-slate-50">
              {snapshot.roundScore}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{match.teamA.shortName}</span>
              <span>{snapshot.teamAProbability}%</span>
            </div>
            <div className="mt-1 h-2 rounded bg-slate-800">
              <div
                className="h-2 rounded bg-teal-300 transition-all"
                style={{ width: `${snapshot.teamAProbability}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{match.teamB.shortName}</span>
              <span>{snapshot.teamBProbability}%</span>
            </div>
            <div className="mt-1 h-2 rounded bg-slate-800">
              <div
                className="h-2 rounded bg-amber-300 transition-all"
                style={{ width: `${snapshot.teamBProbability}%` }}
              />
            </div>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {snapshot.momentum.map((note) => (
            <li key={note} className="rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm leading-6 text-slate-300">
              {note}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Real live tracking needs an approved live feed such as GRID, PandaScore
          Live, or Abios. The AI does not watch streams or scrape match pages.
        </p>
      </div>
    </section>
  );
}
