import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, username, avatar, settings } = body;

    if (!userId || !username) {
      return NextResponse.json({ success: false, error: "userId and username required" }, { status: 400 });
    }

    const room = await RoomManager.createRoom(userId, username, avatar || "User", settings);

    return NextResponse.json({
      success: true,
      code: room.code,
      room,
    });
  } catch (error) {
    console.error("Create Room Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create room" }, { status: 500 });
  }
}
