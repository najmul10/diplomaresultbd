import { NextResponse } from "next/server";
import {
  OFFICIAL_EXAM_OPTIONS,
  OFFICIAL_SESSION_PARTS,
  OFFICIAL_YEARS,
  fetchLiveCurricula,
} from "@/lib/bteb-scraper";

export const dynamic = "force-dynamic";

/**
 * Returns the official BTEB exam types (fetched LIVE from the official new
 * archive's public API), years, and session parts for the live search form.
 */
export async function GET() {
  const curricula = await fetchLiveCurricula();
  const exams = curricula.length > 0
    ? curricula.map((c) => ({ code: c.code, name: c.name, totalSemesters: c.totalSemesters }))
    : OFFICIAL_EXAM_OPTIONS;
  return NextResponse.json({
    success: true,
    data: {
      exams,
      years: OFFICIAL_YEARS,
      sessionParts: OFFICIAL_SESSION_PARTS,
      live: curricula.length > 0,
    },
  });
}
