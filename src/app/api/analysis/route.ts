import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeMatch } from "@/lib/analyst-agent";
import { getManualLiveSnapshot } from "@/lib/data/manual-data";
import { getMatchById } from "@/lib/data/providers";

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
  return NextResponse.json(analyzeMatch(match, live));
}
