import { NextResponse } from "next/server";
import { getDepartments } from "@/lib/data";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ success: true, data: getDepartments() });
}
