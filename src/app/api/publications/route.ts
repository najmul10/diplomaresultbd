import { NextResponse } from "next/server";
import { getPublications } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  const data = [...getPublications()].sort((a, b) =>
    a.publicationDate < b.publicationDate ? 1 : -1
  );
  return NextResponse.json({ success: true, data });
}
