import { NextRequest, NextResponse } from "next/server";
import { searchLive, searchLiveHistory, type LiveSearchParams } from "@/lib/bteb-scraper";

export const dynamic = "force-dynamic";

/**
 * LIVE result search — fetches REAL data from the official BTEB archive
 * (http://180.211.162.102:8444/result_arch/result.php). No demo data here.
 *
 * Two modes:
 *  1) Single year search (default): pass `year` to search one specific year.
 *  2) Full history search: pass `history=1` (omit `year`) to crawl the roll
 *     across all years 2017–2026 and return every found result — this mirrors
 *     the competitor site's "all semesters in one view" experience.
 *
 * Query params:
 *   - exam     (required) exam code, e.g. "15" for Diploma in Engineering
 *   - year     (required for single mode) exam year, e.g. "2023"
 *   - history  (optional) set to "1" to enable multi-year crawl
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
  const historyMode = searchParams.get("history") === "1";

  if (!exam || !roll) {
    return NextResponse.json(
      { success: false, error: "Exam type and roll number are required." },
      { status: 400 }
    );
  }

  if (historyMode) {
    // Multi-year crawl: returns ALL semester results for the student
    const base: Omit<LiveSearchParams, "year"> = {
      exam,
      roll,
      reg: reg || undefined,
      sessPart: sessPart || undefined,
    };
    const result = await searchLiveHistory(base);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }
    if (result.results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No result found for this roll across the years 2017–2026. Please verify your exam type and roll number.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: result.results,
      meta: {
        searchedAt: new Date().toISOString(),
        source: result.source,
        officialSource: "http://180.211.162.102:8444/result_arch/",
        yearsSearched: result.yearsSearched,
        resultsFound: result.results.length,
      },
    });
  }

  // Single-year search
  if (!year) {
    return NextResponse.json(
      { success: false, error: "Year is required (or set history=1 for full multi-year search)." },
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
