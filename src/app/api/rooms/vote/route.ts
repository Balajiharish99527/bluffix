import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId, suspectUserId } = body;

    if (!code || !userId || !suspectUserId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.submitVote(code, userId, suspectUserId);
    if (!room) {
      return NextResponse.json({ success: false, error: "Invalid vote action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, userId) });
  } catch (error) {
    console.error("Submit Vote Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
