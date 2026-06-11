import { seedJournalEntries } from "@/lib/data/manual-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BetJournalEntry } from "@/lib/types";

type JournalRow = {
  id: string;
  match_id: string;
  match_name: string;
  bet_type: string;
  odds: number;
  stake: number;
  prediction_confidence: number;
  result: BetJournalEntry["result"];
  profit_loss: number;
  notes: string | null;
  team: string | null;
  created_at: string;
};

function fromRow(row: JournalRow): BetJournalEntry {
  return {
    id: row.id,
    matchId: row.match_id,
    matchName: row.match_name,
    betType: row.bet_type,
    odds: Number(row.odds),
    stake: Number(row.stake),
    predictionConfidence: row.prediction_confidence,
    result: row.result,
    profitLoss: Number(row.profit_loss),
    notes: row.notes ?? "",
    team: row.team ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getJournalEntries(): Promise<BetJournalEntry[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return seedJournalEntries;

  const { data, error } = await supabase
    .from("bet_journal")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return seedJournalEntries;
  return (data as JournalRow[]).map(fromRow);
}
