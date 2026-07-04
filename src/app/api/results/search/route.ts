import { NextRequest, NextResponse } from "next/server";
import { findStudentHistory, getPublications } from "@/lib/data";
import type { StudentHistory } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Individual result search — mirrors the official BTEB Archive System
 * (result.bteb.gov.bd) form fields AND the original btebresultszone.com
 * behaviour: searching a roll returns the student's COMPLETE ACADEMIC
 * HISTORY (every semester result, GPA, CGPA, referred subjects).
 *
 * Query params:
 *   - roll          (required, or registrationNo)
 *   - registrationNo
 *   - examType, curriculum, semester, examYear  (optional filters — applied
 *     to narrow which semester result is "highlighted", but all history is
 *     still returned)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roll = (searchParams.get("roll") || "").trim();
  const registrationNo = (searchParams.get("registrationNo") || "").trim();

  if (!roll && !registrationNo) {
    return NextResponse.json(
      { success: false, error: "Roll number or registration number is required." },
      { status: 400 }
    );
  }

  await new Promise((r) => setTimeout(r, 250));

  const lookupKey = roll || registrationNo;
  const history: StudentHistory | undefined = findStudentHistory(lookupKey);

  if (!history) {
    return NextResponse.json(
      {
        success: false,
        error: `No result found for ${roll ? `roll "${roll}"` : `registration "${registrationNo}"`}. Please verify and try again.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: history,
    meta: {
      searchedAt: new Date().toISOString(),
      source: "BTEB Results Zone mirror",
      officialSource: "https://result.bteb.gov.bd",
      note:
        "Showing complete academic history across all published semesters.",
    },
  });
}

// Convenience: list distinct exam types / curricula / years for the form dropdowns
export async function POST() {
  const pubs = getPublications();
  const examTypes = [...new Set(pubs.map((p) => p.examType))];
  const curricula = [...new Set(pubs.map((p) => p.curriculum))];
  const years = [...new Set(pubs.map((p) => p.examYear))].sort((a, b) => b - a);
  const semesters = [...new Set(pubs.map((p) => p.semester))].sort((a, b) => a - b);
  return NextResponse.json({ success: true, data: { examTypes, curricula, years, semesters } });
}
