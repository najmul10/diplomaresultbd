import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    name: "Diploma Result BD API",
    status: "ok",
    description: "Live diploma result search for BTEB polytechnic students in Bangladesh.",
    endpoints: {
      live: [
        "/api/results/live-options (exam types, years, session parts)",
        "/api/results/live-search?exam=15&year=2023&roll=449381 (single year search)",
        "/api/results/live-search?exam=15&roll=449381&history=1 (full history search)",
        "/api/results/live-analytics?exam=15&year=2024&count=40 (sample statistics)",
        "/api/results/group (POST — batch search)",
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
  });
}
