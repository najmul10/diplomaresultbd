import { NextResponse } from "next/server";
import { getStats } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  const stats = getStats();
  return NextResponse.json({
    name: "BTEB Results Zone API",
    status: "ok",
    endpoints: [
      "/api/stats",
      "/api/departments",
      "/api/institutes",
      "/api/publications",
      "/api/results/search?roll=...",
      "/api/results/group (POST)",
      "/api/results/institute?instituteCode=...",
      "/api/results/latest",
      "/api/analytics?publicationId=...",
      "/api/routines",
      "/api/booklists?departmentCode=...",
      "/api/feedback (POST)",
    ],
    stats,
  });
}
