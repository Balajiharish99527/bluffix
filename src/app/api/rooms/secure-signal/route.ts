import { NextResponse } from "next/server";
import { RoomManager } from "@/lib/roomManager";
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, userId, text } = body;

    if (!code || !userId || !text) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const room = RoomManager.submitSecureSignal(code, userId, text);
    if (!room) {
      return NextResponse.json({ success: false, error: "Unauthorized or Invalid Phase" }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Secure Signal Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
