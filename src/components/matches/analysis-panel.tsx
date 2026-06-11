"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import type { AnalystResult, CSMatch } from "@/lib/types";

export function AnalysisPanel({ match }: { match: CSMatch }) {
  const [result, setResult] = useState<AnalystResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id }),
      });

      if (!response.ok) {
        throw new Error("Analysis request failed.");
      }

      setResult((await response.json()) as AnalystResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  const display = result;

  return (
    <section className="panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit size={18} className="text-teal-300" />
            <h2 className="text-sm font-semibold text-slate-100">AI Analyst Agent</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Uses OpenAI when configured, with approved API/manual match data only.
          </p>
        </div>
        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          className="focus-ring inline-flex h-9 items-center justify-center gap-2 rounded-md bg-teal-300 px-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Analyze
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {display ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Recommended action
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-50">
                  {display.recommendedAction}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Confidence
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-teal-200">
                  {display.confidence}/100
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{display.summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{match.teamA.shortName}</span>
                  <span>{display.teamAProbability}%</span>
                </div>
                <div className="mt-1 h-2 rounded bg-slate-800">
                  <div
                    className="h-2 rounded bg-teal-300"
                    style={{ width: `${display.teamAProbability}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{match.teamB.shortName}</span>
                  <span>{display.teamBProbability}%</span>
                </div>
                <div className="mt-1 h-2 rounded bg-slate-800">
                  <div
                    className="h-2 rounded bg-amber-300"
                    style={{ width: `${display.teamBProbability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Reasoning
            </h3>
            <ul className="mt-2 space-y-2">
              {display.reasoning.map((item) => (
                <li key={item} className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm leading-6 text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-amber-300/25 bg-amber-300/10 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
              <ShieldAlert size={14} />
              Risk flags
            </div>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
              {display.riskFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/45 p-4 text-sm leading-6 text-slate-400">
          No analysis generated for this match.
        </div>
      )}
    </section>
  );
}
