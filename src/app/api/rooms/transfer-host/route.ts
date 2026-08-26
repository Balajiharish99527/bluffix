import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, currentHostId, newHostId } = body;

    if (!code || !currentHostId || !newHostId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.transferHost(code, currentHostId, newHostId);
    if (!room) {
      return NextResponse.json({ success: false, error: "Transfer failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true, room: RoomManager.getSanitizedClientState(room, currentHostId) });
  } catch (error) {
    console.error("Transfer Host Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
