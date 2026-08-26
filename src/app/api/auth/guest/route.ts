import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
export const dynamic = "force-static";

function getUUID(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { guestId, username, avatar } = body;

    if (!guestId) {
      guestId = "guest_" + getUUID();
    }

    if (!username || typeof username !== "string" || username.trim().length === 0) {
      username = "Agent" + Math.floor(1000 + Math.random() * 9000);
    }

    if (!avatar) {
      const avatars = ["User", "Shield", "Zap", "Target", "Ghost", "Sword", "Heart", "Star"];
      avatar = avatars[Math.floor(Math.random() * avatars.length)];
    }

    let user = {
      id: getUUID(),
      guestId,
      username,
      avatar,
      totalGames: 0,
      totalWins: 0,
      totalPoints: 0,
    };

    // Database Sync (Optional)
    if (db) {
      try {
        const existing = await db.select().from(users).where(eq(users.guestId, guestId)).limit(1);

        if (existing.length > 0) {
          const dbUser = existing[0];
          await db
            .update(users)
            .set({ username, avatar, updatedAt: new Date() })
            .where(eq(users.id, dbUser.id));
          user = {
            id: dbUser.id,
            guestId: dbUser.guestId,
            username,
            avatar,
            totalGames: dbUser.totalGames,
            totalWins: dbUser.totalWins,
            totalPoints: dbUser.totalPoints,
          };
        } else {
          const inserted = await db
            .insert(users)
            .values({
              id: user.id,
              guestId,
              username,
              avatar,
            })
            .returning();
          const dbUser = inserted[0];
          user.id = dbUser.id;
        }
      } catch (dbErr) {
        console.error("Database unavailable, continuing with transient session:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Guest Auth Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
