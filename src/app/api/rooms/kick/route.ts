import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, hostUserId, targetUserId } = body;

    if (!code || !hostUserId || !targetUserId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.kickPlayer(code, hostUserId, targetUserId);
    if (!room) {
      return NextResponse.json({ success: false, error: "Action failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, hostUserId) });
  } catch (error) {
    console.error("Kick Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
