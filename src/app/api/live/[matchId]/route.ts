import { NextResponse } from "next/server";
import { getManualLiveSnapshot } from "@/lib/data/manual-data";
import { getMatchById } from "@/lib/data/providers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const { matchId } = await params;
  const match = await getMatchById(matchId);

  if (!match) {
    return NextResponse.json({ error: "Match not found." }, { status: 404 });
  }

  return NextResponse.json(getManualLiveSnapshot(match));
}
