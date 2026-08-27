import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId, clue } = body;

    if (!code || !userId || clue === undefined) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.submitClue(code, userId, String(clue));
    if (!room) {
      return NextResponse.json({ success: false, error: "Invalid clue turn or submission" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, userId) });
  } catch (error) {
    console.error("Submit Clue Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
