"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { formatCurrency, formatMatchTime } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/env";
import type { BetJournalEntry, BetResult, CSMatch } from "@/lib/types";

const storageKey = "cs2-edge-journal-v1";

function calculateProfitLoss(result: BetResult, stake: number, odds: number) {
  if (result === "win") return Number((stake * (odds - 1)).toFixed(2));
  if (result === "loss") return -Math.abs(stake);
  return 0;
}

export function BetJournalClient({
  initialEntries,
  matches,
}: {
  initialEntries: BetJournalEntry[];
  matches: CSMatch[];
}) {
  const [entries, setEntries] = useState<BetJournalEntry[]>(() => {
    if (typeof window === "undefined") return initialEntries;
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as BetJournalEntry[]) : initialEntries;
  });
  const [matchId, setMatchId] = useState(matches[0]?.id ?? "");
  const [betType, setBetType] = useState("Moneyline");
  const [team, setTeam] = useState(matches[0]?.teamA.name ?? "");
  const [odds, setOdds] = useState("1.80");
  const [stake, setStake] = useState("25");
  const [confidence, setConfidence] = useState("60");
  const [result, setResult] = useState<BetResult>("pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries]);

  const selectedMatch = useMemo(
    () => matches.find((match) => match.id === matchId) ?? matches[0],
    [matchId, matches],
  );

  function onMatchChange(nextMatchId: string) {
    const nextMatch = matches.find((match) => match.id === nextMatchId);
    setMatchId(nextMatchId);
    if (nextMatch) setTeam(nextMatch.teamA.name);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMatch) return;

    const parsedStake = Number(stake);
    const parsedOdds = Number(odds);
    const entry: BetJournalEntry = {
      id: crypto.randomUUID(),
      matchId: selectedMatch.id,
      matchName: `${selectedMatch.teamA.name} vs ${selectedMatch.teamB.name}`,
      betType,
      odds: parsedOdds,
      stake: parsedStake,
      predictionConfidence: Number(confidence),
      result,
      profitLoss: calculateProfitLoss(result, parsedStake, parsedOdds),
      notes,
      team,
      createdAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      if (isSupabaseConfigured) {
        const response = await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });

        if (response.ok) {
          const saved = (await response.json()) as BetJournalEntry;
          setEntries((current) => [saved, ...current]);
        } else {
          setEntries((current) => [entry, ...current]);
        }
      } else {
        setEntries((current) => [entry, ...current]);
      }
      setNotes("");
      setResult("pending");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
      <form onSubmit={onSubmit} className="panel rounded-lg p-4">
        <div className="mb-4 flex items-center gap-2">
          <Plus size={17} className="text-teal-300" />
          <h2 className="text-sm font-semibold text-slate-100">New Journal Entry</h2>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Match
            </span>
            <select
              value={matchId}
              onChange={(event) => onMatchChange(event.target.value)}
              className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
            >
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.teamA.name} vs {match.teamB.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Bet type
              </span>
              <select
                value={betType}
                onChange={(event) => setBetType(event.target.value)}
                className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              >
                <option>Moneyline</option>
                <option>Map 1</option>
                <option>Map handicap</option>
                <option>Totals</option>
                <option>Wait Live</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Team
              </span>
              <select
                value={team}
                onChange={(event) => setTeam(event.target.value)}
                className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              >
                {selectedMatch ? (
                  <>
                    <option>{selectedMatch.teamA.name}</option>
                    <option>{selectedMatch.teamB.name}</option>
                    <option>None</option>
                  </>
                ) : null}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Odds
              </span>
              <input
                value={odds}
                onChange={(event) => setOdds(event.target.value)}
                type="number"
                min="1"
                step="0.01"
                className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Stake
              </span>
              <input
                value={stake}
                onChange={(event) => setStake(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Confidence
              </span>
              <input
                value={confidence}
                onChange={(event) => setConfidence(event.target.value)}
                type="number"
                min="1"
                max="100"
                className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Result
            </span>
            <select
              value={result}
              onChange={(event) => setResult(event.target.value as BetResult)}
              className="focus-ring mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
            >
              <option value="pending">Pending</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="push">Push</option>
              <option value="void">Void</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="focus-ring mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="focus-ring mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-teal-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} />
          {saving ? "Saving" : "Save entry"}
        </button>
      </form>

      <section className="panel overflow-hidden rounded-lg">
        <div className="border-b border-slate-800 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-100">Journal</h2>
          <p className="mt-1 text-xs text-slate-500">
            Entries include stake, confidence, result, and profit/loss.
          </p>
        </div>
        <div className="thin-scrollbar w-full overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Match</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Odds</th>
                <th className="px-4 py-3 font-medium">Stake</th>
                <th className="px-4 py-3 font-medium">Conf.</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">P/L</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-800/80">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {formatMatchTime(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-100">{entry.matchName}</p>
                    <p className="mt-1 text-xs text-slate-500">{entry.notes || entry.team}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{entry.betType}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{entry.odds.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">${entry.stake.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono text-teal-200">
                    {entry.predictionConfidence}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{entry.result}</td>
                  <td
                    className={`px-4 py-3 font-mono ${
                      entry.profitLoss >= 0 ? "text-teal-200" : "text-rose-200"
                    }`}
                  >
                    {formatCurrency(entry.profitLoss)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
