import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    name: "BTEB Results Zone API",
    status: "live",
    description:
      "Live result search proxy for the official BTEB archive (http://180.211.162.102:8444/result_arch/). No stored/demo data.",
    endpoints: {
      live: [
        "/api/results/live-options (official exam types, years, session parts)",
        "/api/results/live-search?exam=15&year=2022&roll=449381 (live single search)",
        "/api/results/live-analytics?exam=15&year=2022&count=40 (live sample crawl + stats)",
        "/api/results/group (POST — live batch search)",
      ],
      reference: [
        "/api/departments",
        "/api/institutes",
        "/api/routines",
        "/api/booklists",
      ],
      admin: ["/api/admin/hunt/start (POST)", "/api/admin/hunt/status", "/api/admin/hunt/stop (POST)"],
      feedback: "/api/feedback (POST)",
    },
    officialSource: "http://180.211.162.102:8444/result_arch/",
  });
}
