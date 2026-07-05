import { NextRequest, NextResponse } from "next/server";
import { getInstitutes } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();
  const type = searchParams.get("type"); // Government | Private

  let data = getInstitutes();
  if (type && (type === "Government" || type === "Private")) {
    data = data.filter((i) => i.type === type);
  }
  if (q) {
    data = data.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q)
    );
  }
  return NextResponse.json({ success: true, data });
}
