import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId, username, avatar } = body;

    if (!code || !userId || !username) {
      return NextResponse.json({ success: false, error: "code, userId, and username are required" }, { status: 400 });
    }

    const result = RoomManager.joinRoom(code, userId, username, avatar || "User");

    if (result.error || !result.room) {
      return NextResponse.json({ success: false, error: result.error || "Failed to join room" }, { status: 400 });
    }

    const sanitizedState = RoomManager.getSanitizedClientState(result.room, userId);

    return NextResponse.json({
      success: true,
      room: sanitizedState,
    });
  } catch (error) {
    console.error("Join Room Error:", error);
    return NextResponse.json({ success: false, error: "Failed to join room" }, { status: 500 });
  }
}
