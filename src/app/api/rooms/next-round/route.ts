import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId } = body;

    if (!code || !userId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = await RoomManager.nextRoundOrFinish(code, userId);
    if (!room) {
      return NextResponse.json({ success: false, error: "Action failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, userId) });
  } catch (error) {
    console.error("Next Round Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
