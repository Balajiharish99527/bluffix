import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
export const dynamic = "force-static";

export async function GET() {
  if (!db) {
    return NextResponse.json({ success: true, leaderboard: [] });
  }
  try {
    const topPlayers = await db
      .select({
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        totalGames: users.totalGames,
        totalWins: users.totalWins,
        totalPoints: users.totalPoints,
      })
      .from(users)
      .orderBy(desc(users.totalPoints))
      .limit(20);

    return NextResponse.json({
      success: true,
      leaderboard: topPlayers,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
