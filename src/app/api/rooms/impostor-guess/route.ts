import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId, guess } = body;

    if (!code || !userId || guess === undefined) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.submitImpostorGuess(code, userId, String(guess));
    if (!room) {
      return NextResponse.json({ success: false, error: "Invalid guess submission" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, userId) });
  } catch (error) {
    console.error("Submit Impostor Guess Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
