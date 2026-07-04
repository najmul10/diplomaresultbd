import { NextRequest, NextResponse } from "next/server";
import { getLatestResults, getPublications, getAnalytics } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10) || 12, 60);
  const publicationId = searchParams.get("publicationId") || undefined;

  const latest = getLatestResults(limit);
  const publications = [...getPublications()].sort((a, b) =>
    a.publicationDate < b.publicationDate ? 1 : -1
  );
  const analytics = getAnalytics(publicationId);

  return NextResponse.json({
    success: true,
    data: { latest, publications, analytics },
  });
}
