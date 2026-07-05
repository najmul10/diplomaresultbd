import { NextRequest, NextResponse } from "next/server";
import { searchLiveBatch } from "@/lib/bteb-scraper";

export const dynamic = "force-dynamic";

/**
 * LIVE Group result search — fetches each roll in parallel from the official
 * BTEB archive (http://180.211.162.102:8444/result_arch/).
 *
 * Body:
 *   - exam      (required) exam code, e.g. "15"
 *   - year      (required) exam year, e.g. "2022"
 *   - rolls     (string|string[]) roll numbers, or a string to parse
 *   - sessPart  (optional) session part code
 */
export async function POST(req: NextRequest) {
  let body: {
    exam?: string;
    year?: string;
    rolls?: string[] | string;
    sessPart?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const exam = body.exam;
  const year = body.year;
  const sessPart = body.sessPart && body.sessPart !== "any" ? body.sessPart : undefined;

  if (!exam || !year) {
    return NextResponse.json(
      { success: false, error: "Exam type and year are required." },
      { status: 400 }
    );
  }

  let rolls: string[] = [];
  if (Array.isArray(body.rolls)) {
    rolls = body.rolls;
  } else if (typeof body.rolls === "string") {
    // support range format "921711-921726" and comma/space separated
    const parts = body.rolls.split(/[\s,]+/).filter(Boolean);
    for (const part of parts) {
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        const start = parseInt(range[1], 10);
        const end = Math.min(parseInt(range[2], 10), start + 60); // cap ranges
        for (let r = start; r <= end; r++) rolls.push(String(r));
      } else {
        rolls.push(part);
      }
    }
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

  const results = await searchLiveBatch({ exam, year, sessPart }, rolls);
  const found = results.filter((r) => r.result !== null).map((r) => r.result!);
  const missing = results.filter((r) => r.result === null).map((r) => r.roll);
  const errored = results.filter((r) => r.error).map((r) => ({ roll: r.roll, error: r.error }));

  return NextResponse.json({
    success: true,
    data: {
      results: found,
      missing,
      errored,
      totalRequested: rolls.length,
      totalFound: found.length,
      source: "official-archive",
    },
  });
}
