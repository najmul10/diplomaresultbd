import { NextRequest, NextResponse } from "next/server";
import { findResultByRoll } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roll = searchParams.get("roll") || "";

  if (!roll.trim()) {
    return NextResponse.json(
      { success: false, error: "Roll number is required." },
      { status: 400 }
    );
  }

  // Simulate a tiny bit of latency for realistic UX (also gives loading state meaning)
  await new Promise((r) => setTimeout(r, 250));

  const result = findResultByRoll(roll);
  if (!result) {
    return NextResponse.json(
      {
        success: false,
        error: `No result found for roll/registration "${roll.trim()}". Please check and try again.`,
      },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: result });
}
