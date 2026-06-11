import { BetJournalClient } from "@/components/journal/bet-journal-client";
import { getTodaysMatches } from "@/lib/data/providers";
import { getJournalEntries } from "@/lib/journal-store";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const [entries, matches] = await Promise.all([
    getJournalEntries(),
    getTodaysMatches(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Bet Journal</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Log personal research decisions with odds, stake, confidence, result, and notes.
        </p>
      </div>
      <BetJournalClient initialEntries={entries} matches={matches} />
    </div>
  );
}
