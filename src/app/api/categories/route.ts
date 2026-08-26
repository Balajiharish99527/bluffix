import { NextResponse } from "next/server";
import { CATEGORIES_DATA } from "@/lib/words";
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: CATEGORIES_DATA,
  });
}
