import { NextRequest, NextResponse } from "next/server";
import { getJob, listJobs } from "@/lib/hunt";

export const dynamic = "force-dynamic";

/**
 * Get hunt job status.
 *   GET /api/admin/hunt/status         -> list all jobs
 *   GET /api/admin/hunt/status?id=xxx  -> single job (full log + results)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const job = getJob(id);
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: job });
  }

  // list view (omit heavy log/results arrays)
  const jobs = listJobs().map((j) => ({
    id: j.id,
    publicationId: j.publicationId,
    publicationTitle: j.publicationTitle,
    curriculum: j.curriculum,
    semester: j.semester,
    examYear: j.examYear,
    rollStart: j.rollStart,
    rollEnd: j.rollEnd,
    total: j.total,
    processed: j.processed,
    found: j.found,
    notFound: j.notFound,
    errors: j.errors,
    status: j.status,
    startedAt: j.startedAt,
    finishedAt: j.finishedAt,
    throughput: j.throughput,
    etaSeconds: j.etaSeconds,
    source: j.source,
  }));
  return NextResponse.json({ success: true, data: jobs });
}
