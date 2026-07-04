import { NextResponse } from "next/server";
import { getPublications } from "@/lib/data";

export const dynamic = "force-static";

/**
 * Returns the distinct dropdown options for the official BTEB-style
 * result search form (examType, curriculum, semester, examYear).
 */
export async function GET() {
  const pubs = getPublications();
  const examTypes = [...new Set(pubs.map((p) => p.examType))];
  const curricula = [...new Set(pubs.map((p) => p.curriculum))];
  const years = [...new Set(pubs.map((p) => p.examYear))].sort((a, b) => b - a);
  const semesters = [...new Set(pubs.map((p) => p.semester))].sort((a, b) => a - b);
  return NextResponse.json({
    success: true,
    data: { examTypes, curricula, years, semesters },
  });
}
