import { NextRequest, NextResponse } from "next/server";
import { getAnalytics } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publicationId = searchParams.get("publicationId") || undefined;
  const data = getAnalytics(publicationId);
  return NextResponse.json({ success: true, data });
}
