import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";

    // Check timer transitions
    let room = RoomManager.checkAndAdvanceState(code);

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    const sanitized = RoomManager.getSanitizedClientState(room, userId);

    return NextResponse.json({
      success: true,
      room: sanitized,
    });
  } catch (error) {
    console.error("Get Room Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
