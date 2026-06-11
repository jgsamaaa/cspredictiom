import { CheckCircle2, CircleOff, Database, KeyRound } from "lucide-react";
import { approvedProviders } from "@/lib/data/providers";
import { isSupabaseConfigured, openAiApiKey, openAiModel, pandaScoreToken } from "@/lib/env";
import { getJournalEntries } from "@/lib/journal-store";

export default async function SettingsPage() {
  const entries = await getJournalEntries();
  const settledEntries = entries.filter(
    (entry) => entry.result === "win" || entry.result === "loss",
  );
  const rows = [
    {
      label: "Supabase Auth + Journal",
      configured: isSupabaseConfigured,
      env: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY",
    },
    {
      label: "PandaScore CS2 schedule",
      configured: Boolean(pandaScoreToken),
      env: "PANDASCORE_TOKEN",
    },
    {
      label: `OpenAI Analyst Agent (${openAiModel})`,
      configured: Boolean(openAiApiKey),
      env: "OPENAI_API_KEY, OPENAI_MODEL",
    },
    {
      label: "Manual stats fallback",
      configured: true,
      env: "Seeded and user-entered data",
    },
    {
      label: "Learning calibration",
      configured: settledEntries.length >= 5,
      env: `${settledEntries.length} settled journal outcomes`,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Provider configuration for private CS2 research. HLTV scraping is intentionally absent.
        </p>
      </div>

      <section className="panel rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-teal-300" />
          <h2 className="text-sm font-semibold text-slate-100">Approved Data Sources</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {approvedProviders.map((provider) => (
            <span
              key={provider}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300"
            >
              {provider}
            </span>
          ))}
        </div>
      </section>

      <section className="panel rounded-lg">
        <div className="border-b border-slate-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-amber-200" />
            <h2 className="text-sm font-semibold text-slate-100">Environment</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-800">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-100">{row.label}</p>
                <p className="mt-1 font-mono text-xs text-slate-500">{row.env}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs ${
                  row.configured
                    ? "border-teal-400/40 bg-teal-400/10 text-teal-200"
                    : "border-slate-700 bg-slate-950 text-slate-400"
                }`}
              >
                {row.configured ? <CheckCircle2 size={14} /> : <CircleOff size={14} />}
                {row.configured ? "Configured" : "Not configured"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
