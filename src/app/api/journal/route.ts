import { NextResponse } from "next/server";
import { z } from "zod";
import { getJournalEntries } from "@/lib/journal-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BetJournalEntry } from "@/lib/types";

const journalSchema = z.object({
  matchId: z.string().min(1),
  matchName: z.string().min(1),
  betType: z.string().min(1),
  odds: z.number().min(1),
  stake: z.number().min(0),
  predictionConfidence: z.number().int().min(1).max(100),
  result: z.enum(["pending", "win", "loss", "push", "void"]),
  profitLoss: z.number(),
  notes: z.string().optional(),
  team: z.string().optional(),
});

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

export async function GET() {
  return NextResponse.json(await getJournalEntries());
}

export async function POST(request: Request) {
  const parsed = journalSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid journal entry." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    const localEntry: BetJournalEntry = {
      id: crypto.randomUUID(),
      matchId: parsed.data.matchId,
      matchName: parsed.data.matchName,
      betType: parsed.data.betType,
      odds: parsed.data.odds,
      stake: parsed.data.stake,
      predictionConfidence: parsed.data.predictionConfidence,
      result: parsed.data.result,
      profitLoss: parsed.data.profitLoss,
      notes: parsed.data.notes ?? "",
      team: parsed.data.team,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(localEntry);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bet_journal")
    .insert({
      user_id: user.id,
      match_id: parsed.data.matchId,
      match_name: parsed.data.matchName,
      bet_type: parsed.data.betType,
      odds: parsed.data.odds,
      stake: parsed.data.stake,
      prediction_confidence: parsed.data.predictionConfidence,
      result: parsed.data.result,
      profit_loss: parsed.data.profitLoss,
      notes: parsed.data.notes ?? "",
      team: parsed.data.team ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not save journal entry." }, { status: 500 });
  }

  return NextResponse.json(fromRow(data as JournalRow));
}
