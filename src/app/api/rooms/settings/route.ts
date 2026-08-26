import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, hostUserId, settings } = body;

    if (!code || !hostUserId || !settings) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.updateSettings(code, hostUserId, settings);
    if (!room) {
      return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, hostUserId) });
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
