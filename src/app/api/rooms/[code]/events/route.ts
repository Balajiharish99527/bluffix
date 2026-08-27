import { RoomManager } from "@/lib/roomManager";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ code: "_build" }];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let lastUpdatedAt = 0;

      const interval = setInterval(() => {
        try {
          let room = RoomManager.checkAndAdvanceState(code);
          if (!room) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "Room closed" })}\n\n`)
            );
            clearInterval(interval);
            controller.close();
            return;
          }

          if (room.updatedAt > lastUpdatedAt || room.activeGame) {
            lastUpdatedAt = room.updatedAt;
            const sanitized = RoomManager.getSanitizedClientState(room, userId);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "ROOM_UPDATE", room: sanitized })}\n\n`)
            );
          }
        } catch {
          clearInterval(interval);
          try {
            controller.close();
          } catch {
            // ignore
          }
        }
      }, 1000);

      try {
        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
        });
      } catch {
        // Static build - no real signal
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
