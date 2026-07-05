import { NextResponse } from "next/server";
import { getRoutines } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  const data = [...getRoutines()].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
  return NextResponse.json({ success: true, data });
}
