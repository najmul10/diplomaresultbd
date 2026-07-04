import { NextRequest, NextResponse } from "next/server";
import { searchLive, type LiveSearchParams } from "@/lib/bteb-scraper";

export const dynamic = "force-dynamic";
// The official archive is HTTP on a raw IP — allow it.
export const fetchOptions = {};

/**
 * LIVE result search — fetches REAL data from the official BTEB archive
 * (http://180.211.162.102:8444/result_arch/result.php). No demo data here.
 *
 * Query params:
 *   - exam     (required) exam code, e.g. "15" for Diploma in Engineering
 *   - year     (required) exam year, e.g. "2022"
 *   - roll     (required) roll number
 *   - reg      (optional) registration number
 *   - sessPart (optional) session part code
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exam = (searchParams.get("exam") || "").trim();
  const year = (searchParams.get("year") || "").trim();
  const roll = (searchParams.get("roll") || "").trim();
  const reg = (searchParams.get("reg") || "").trim();
  const sessPart = (searchParams.get("sessPart") || "").trim();

  if (!exam || !year || !roll) {
    return NextResponse.json(
      { success: false, error: "Exam type, year, and roll number are required." },
      { status: 400 }
    );
  }

  const params: LiveSearchParams = { exam, year, roll, reg: reg || undefined, sessPart: sessPart || undefined };
  const result = await searchLive(params);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 502 });
  }

  if (result.data === null) {
    return NextResponse.json(
      {
        success: false,
        error:
          "No result found for the given roll, registration, exam type and year. Please verify your details and try again.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result.data,
    meta: {
      searchedAt: new Date().toISOString(),
      source: result.source,
      officialSource: "http://180.211.162.102:8444/result_arch/",
      cached: result.cached,
    },
  });
}
