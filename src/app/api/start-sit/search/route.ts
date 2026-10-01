import { NextRequest, NextResponse } from "next/server";
import { searchPlayers } from "@/lib/start-sit";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  try {
    const players = await searchPlayers(query);
    return NextResponse.json({
      players: players.map((player) => ({
        id: player.id,
        name: player.name,
        position: player.position,
        team: player.team,
      })),
    });
  } catch {
    return NextResponse.json(
      { players: [], error: "Sleeper’s player list did not load." },
      { status: 503 },
    );
  }
}
