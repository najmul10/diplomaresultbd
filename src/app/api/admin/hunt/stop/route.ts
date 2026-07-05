import { NextRequest, NextResponse } from "next/server";
import { stopJob, clearJob } from "@/lib/hunt";

export const dynamic = "force-dynamic";

/**
 * Stop a running hunt job.
 *   POST /api/admin/hunt/stop  { id: string }      -> stop
 *   POST /api/admin/hunt/stop  { id, clear: true } -> stop + delete
 */
export async function POST(req: NextRequest) {
  let body: { id?: string; clear?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { id, clear } = body;
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Job id is required." },
      { status: 400 }
    );
  }

  const stopped = stopJob(id);
  if (clear) {
    clearJob(id);
  }
  return NextResponse.json({
    success: true,
    data: { id, stopped, cleared: !!clear },
  });
}
