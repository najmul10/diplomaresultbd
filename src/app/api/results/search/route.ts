import { NextRequest, NextResponse } from "next/server";
import { getResults, getPublications } from "@/lib/data";
import type { StudentResult } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Individual result search — mirrors the official BTEB Archive System
 * (result.bteb.gov.bd) form fields:
 *   - examType     (Diploma / SSC VOC / HSC VOC / Short Course)
 *   - curriculum   (Diploma in Engineering / Textile / Agriculture...)
 *   - semester
 *   - examYear
 *   - roll  (and/or registrationNo)
 *
 * The original btebresultszone.com resolves this server-side against
 * MongoDB (populated by crawling the official archive). We resolve it
 * against our bundled JSON dataset with the same query semantics.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roll = (searchParams.get("roll") || "").trim();
  const registrationNo = (searchParams.get("registrationNo") || "").trim();
  const examType = searchParams.get("examType") || undefined;
  const curriculum = searchParams.get("curriculum") || undefined;
  const semester = searchParams.get("semester");
  const examYear = searchParams.get("examYear");

  if (!roll && !registrationNo) {
    return NextResponse.json(
      { success: false, error: "Roll number or registration number is required." },
      { status: 400 }
    );
  }

  // Simulate realistic backend latency
  await new Promise((r) => setTimeout(r, 250));

  const data = getResults();
  const rollNorm = roll.replace(/\s+/g, "");
  const rollStripped = rollNorm.replace(/^0+/, "");
  const regNorm = registrationNo.replace(/\s+/g, "").toUpperCase();

  let match: StudentResult | undefined = data.find((r) => {
    if (roll) {
      const rNorm = r.roll.replace(/^0+/, "");
      if (r.roll !== rollNorm && rNorm !== rollStripped) return false;
    } else if (regNorm && r.registrationNo.toUpperCase() !== regNorm) {
      return false;
    }
    if (examType && r.examType !== examType) return false;
    if (curriculum && r.curriculum !== curriculum) return false;
    if (semester && r.semester !== Number(semester)) return false;
    if (examYear && r.examYear !== Number(examYear)) return false;
    return true;
  });

  if (!match) {
    return NextResponse.json(
      {
        success: false,
        error: `No result found${roll ? ` for roll "${roll}"` : registrationNo ? ` for registration "${registrationNo}"` : ""} with the selected filters. Please verify and try again.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: match,
    meta: {
      searchedAt: new Date().toISOString(),
      source: "BTEB Results Zone mirror",
      officialSource: "https://result.bteb.gov.bd",
    },
  });
}

// Convenience: list distinct exam types / curricula / years for the form dropdowns
export async function POST(req: NextRequest) {
  const pubs = getPublications();
  const examTypes = [...new Set(pubs.map((p) => p.examType))];
  const curricula = [...new Set(pubs.map((p) => p.curriculum))];
  const years = [...new Set(pubs.map((p) => p.examYear))].sort((a, b) => b - a);
  const semesters = [...new Set(pubs.map((p) => p.semester))].sort((a, b) => a - b);
  return NextResponse.json({ success: true, data: { examTypes, curricula, years, semesters } });
}
