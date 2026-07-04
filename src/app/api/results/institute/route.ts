import { NextRequest, NextResponse } from "next/server";
import { getInstituteResults } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const instituteCode = searchParams.get("instituteCode") || "";
  const publicationId = searchParams.get("publicationId") || undefined;
  const departmentCode = searchParams.get("departmentCode") || undefined;

  if (!instituteCode) {
    return NextResponse.json(
      { success: false, error: "instituteCode is required." },
      { status: 400 }
    );
  }

  const results = getInstituteResults(instituteCode, { publicationId, departmentCode });

  // Build a small summary
  const total = results.length;
  const passed = results.filter((r) => r.result === "PASSED").length;
  const passRate = total ? Math.round((passed / total) * 1000) / 10 : 0;
  const avgGpa =
    passed > 0
      ? Math.round(
          (results.filter((r) => r.result === "PASSED").reduce((a, b) => a + b.gpa, 0) / passed) *
            100
        ) / 100
      : 0;

  return NextResponse.json({
    success: true,
    data: {
      results,
      summary: { total, passed, failed: total - passed, passRate, avgGpa },
    },
  });
}
