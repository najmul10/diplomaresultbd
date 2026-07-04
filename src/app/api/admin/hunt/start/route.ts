import { NextRequest, NextResponse } from "next/server";
import { OFFICIAL_EXAM_OPTIONS } from "@/lib/bteb-scraper";
import { createJob, runJob } from "@/lib/hunt";

export const dynamic = "force-dynamic";

/**
 * Start a new LIVE auto-hunt crawl job.
 *
 * Body:
 *   - exam       exam code (e.g. "15")
 *   - year       exam year (e.g. "2022")
 *   - sessPart   optional session part
 *   - rollStart  first roll in the range
 *   - rollEnd    last roll in the range
 *   - concurrency (default 6)
 *   - delayMs    (default 100)
 */
export async function POST(req: NextRequest) {
  let body: {
    exam?: string;
    year?: string;
    sessPart?: string;
    rollStart?: number;
    rollEnd?: number;
    concurrency?: number;
    delayMs?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { exam, year, sessPart, rollStart, rollEnd, concurrency, delayMs } = body;

  if (!exam || !year) {
    return NextResponse.json(
      { success: false, error: "exam and year are required." },
      { status: 400 }
    );
  }

  const start = Math.floor(Number(rollStart));
  const end = Math.floor(Number(rollEnd));
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return NextResponse.json(
      { success: false, error: "rollStart and rollEnd must be valid numbers with end >= start." },
      { status: 400 }
    );
  }
  const MAX_RANGE = 2000;
  if (end - start + 1 > MAX_RANGE) {
    return NextResponse.json(
      { success: false, error: `Roll range too large. Max ${MAX_RANGE} rolls per job (live crawling is slow).` },
      { status: 400 }
    );
  }

  const examName =
    OFFICIAL_EXAM_OPTIONS.find((e) => e.code === exam)?.name || `Exam ${exam}`;

  const job = createJob({
    exam,
    examName,
    year,
    sessPart: sessPart && sessPart !== "any" ? sessPart : null,
    rollStart: start,
    rollEnd: end,
    source: "http://180.211.162.102:8444/result_arch/result.php",
  });

  runJob(job.id, { concurrency: concurrency ?? 6, delayMs: delayMs ?? 100 }).catch((e) => {
    job.status = "failed";
    job.finishedAt = new Date().toISOString();
    job.log.push({
      t: new Date().toISOString(),
      roll: "-",
      status: "error",
      msg: e instanceof Error ? e.message : "crawl failed",
    });
  });

  return NextResponse.json({
    success: true,
    data: { jobId: job.id, status: job.status, total: job.total },
  });
}
