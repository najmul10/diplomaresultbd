import { NextRequest, NextResponse } from "next/server";
import { findResultsByRolls } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { rolls?: string[] | string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  let rolls: string[] = [];
  if (Array.isArray(body.rolls)) {
    rolls = body.rolls;
  } else if (typeof body.rolls === "string") {
    rolls = body.rolls
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (rolls.length === 0) {
    return NextResponse.json(
      { success: false, error: "Provide at least one roll number." },
      { status: 400 }
    );
  }

  if (rolls.length > 50) {
    return NextResponse.json(
      { success: false, error: "A maximum of 50 roll numbers can be checked at once." },
      { status: 400 }
    );
  }

  const results = findResultsByRolls(rolls);
  const found = new Set(results.map((r) => r.roll));
  const missing = rolls.filter((r) => !found.has(r.trim().replace(/\s+/g, "")));

  return NextResponse.json({
    success: true,
    data: {
      results,
      missing,
      totalRequested: rolls.length,
      totalFound: results.length,
    },
  });
}
