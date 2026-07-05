import { NextRequest, NextResponse } from "next/server";
import { searchLiveBatch, OFFICIAL_EXAM_OPTIONS } from "@/lib/bteb-scraper";

export const dynamic = "force-dynamic";

/**
 * LIVE sample analytics — crawls a sample of rolls from the official BTEB
 * archive for the selected exam + year (+ optional session part) and computes
 * REAL aggregate statistics from whatever results come back.
 *
 * This is NOT pre-stored data. Every call hits the official government
 * archive live. The sample size is capped to be polite to the server.
 *
 * Query params:
 *   - exam     exam code (e.g. "15")
 *   - year     exam year (e.g. "2022")
 *   - sessPart optional session part
 *   - start    optional starting roll (default 100001)
 *   - count    sample size (default 40, max 80)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exam = searchParams.get("exam") || "";
  const year = searchParams.get("year") || "";
  const sessPart = searchParams.get("sessPart") || undefined;
  const start = parseInt(searchParams.get("start") || "100001", 10) || 100001;
  const count = Math.min(parseInt(searchParams.get("count") || "40", 10) || 40, 80);

  if (!exam || !year) {
    return NextResponse.json(
      { success: false, error: "exam and year are required." },
      { status: 400 }
    );
  }

  const rolls: string[] = [];
  for (let i = 0; i < count; i++) rolls.push(String(start + i));

  const fetched = await searchLiveBatch(
    { exam, year, sessPart: sessPart && sessPart !== "any" ? sessPart : undefined },
    rolls
  );

  const results = fetched
    .map((f) => f.result)
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const total = fetched.length;
  const found = results.length;
  const notFound = total - found;
  const passed = results.filter((r) => r.result === "PASSED").length;
  const referred = results.filter((r) => r.result === "REFERRED").length;
  const failed = results.filter((r) => r.result === "FAILED").length;
  const passRate = found ? Math.round((passed / found) * 1000) / 10 : 0;
  const avgGpa = passed
    ? Math.round((results.filter((r) => r.result === "PASSED").reduce((a, b) => a + b.gpa, 0) / passed) * 100) / 100
    : 0;

  const gradeDistribution: Record<string, number> = {};
  for (const r of results) {
    gradeDistribution[r.letterGrade] = (gradeDistribution[r.letterGrade] || 0) + 1;
  }

  const examName =
    OFFICIAL_EXAM_OPTIONS.find((e) => e.code === exam)?.name || `Exam ${exam}`;

  return NextResponse.json({
    success: true,
    data: {
      exam,
      examName,
      year,
      sessPart: sessPart || null,
      sampleSize: count,
      rollStart: start,
      totalRequested: total,
      found,
      notFound,
      passed,
      referred,
      failed,
      passRate,
      avgGpa,
      gradeDistribution,
      latest: results.slice(0, 12),
      source: "official-archive (live sample)",
      note: `Stats computed from a live sample of ${found} real results out of ${total} rolls crawled from the official BTEB archive.`,
    },
  });
}
