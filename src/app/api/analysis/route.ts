import { NextResponse } from "next/server";
import { z } from "zod";
import { buildLearningProfile } from "@/lib/analytics/learning";
import { getManualLiveSnapshot } from "@/lib/data/manual-data";
import { getMatchById } from "@/lib/data/providers";
import { getJournalEntries } from "@/lib/journal-store";
import { analyzeMatchWithOpenAI } from "@/lib/openai-analyst";

const analysisSchema = z.object({
  matchId: z.string().min(1),
  includeLive: z.boolean().optional(),
});

export async function POST(request: Request) {
  const body = analysisSchema.safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json({ error: "Invalid analysis request." }, { status: 400 });
  }

  const match = await getMatchById(body.data.matchId);
  if (!match) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  const live = body.data.includeLive ? getManualLiveSnapshot(match) : undefined;
  const journalEntries = await getJournalEntries();
  const learningProfile = buildLearningProfile(journalEntries, match);

  return NextResponse.json(
    await analyzeMatchWithOpenAI(match, live, learningProfile),
  );
}
