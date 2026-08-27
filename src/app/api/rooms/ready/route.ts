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

    const room = RoomManager.toggleReady(code, userId);
    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, userId) });
  } catch (error) {
    console.error("Ready Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
