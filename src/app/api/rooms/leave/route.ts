import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId } = body;

    if (!code || !userId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.leaveRoom(code, userId);
    return NextResponse.json({ success: true, room: room ? RoomManager.getSanitizedClientState(room, userId) : null });
  } catch (error) {
    console.error("Leave Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
