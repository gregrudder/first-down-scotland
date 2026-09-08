import { NextResponse } from "next/server";
import {
  getNflLiveScoreboard,
  SCORES_REVALIDATE_SECONDS,
  teamsOnBye,
} from "@/lib/espn";

export const revalidate = 20;

export async function GET() {
  const fixtures = await getNflLiveScoreboard();
  const byes = fixtures.ok ? teamsOnBye(fixtures) : [];

  return NextResponse.json(
    { fixtures, byes },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${SCORES_REVALIDATE_SECONDS}, stale-while-revalidate=${SCORES_REVALIDATE_SECONDS}`,
      },
    },
  );
}
