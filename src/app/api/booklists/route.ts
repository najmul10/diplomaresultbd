import { NextRequest, NextResponse } from "next/server";
import { getBooklists } from "@/lib/data";

export const dynamic = "force-static";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const departmentCode = searchParams.get("departmentCode");

  let data = getBooklists();
  if (departmentCode) {
    data = data.filter((b) => b.departmentCode === departmentCode);
  }
  return NextResponse.json({ success: true, data });
}
