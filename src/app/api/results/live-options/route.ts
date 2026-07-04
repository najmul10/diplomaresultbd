import { NextResponse } from "next/server";
import {
  OFFICIAL_EXAM_OPTIONS,
  OFFICIAL_SESSION_PARTS,
  OFFICIAL_YEARS,
} from "@/lib/bteb-scraper";

export const dynamic = "force-static";

/**
 * Returns the official BTEB exam types, years, and session parts for the
 * live search form. These mirror the official archive's dropdown options.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      exams: OFFICIAL_EXAM_OPTIONS,
      years: OFFICIAL_YEARS,
      sessionParts: OFFICIAL_SESSION_PARTS,
    },
  });
}
