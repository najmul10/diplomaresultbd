import { NextRequest, NextResponse } from "next/server";
import { getPublications } from "@/lib/data";
import { createJob, runJob } from "@/lib/hunt";

export const dynamic = "force-dynamic";

/**
 * Start a new auto-hunt crawl job for a publication.
 *
 * Body:
 *   - publicationId: string  (which publication to crawl)
 *   - rollStart: number      (first roll in the range)
 *   - rollEnd: number        (last roll in the range)
 *   - source: string         (e.g. "https://result.bteb.gov.bd")
 *   - concurrency?: number   (default 8)
 *   - delayMs?: number       (default 120)
 *
 * This mirrors the original site's ingestion: pick a publication, define
 * a roll range, then crawl every roll and store hits.
 */
export async function POST(req: NextRequest) {
  let body: {
    publicationId?: string;
    rollStart?: number;
    rollEnd?: number;
    source?: string;
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

  const { publicationId, rollStart, rollEnd, source, concurrency, delayMs } = body;

  if (!publicationId) {
    return NextResponse.json(
      { success: false, error: "publicationId is required." },
      { status: 400 }
    );
  }
  const pub = getPublications().find((p) => p.id === publicationId);
  if (!pub) {
    return NextResponse.json(
      { success: false, error: "Publication not found." },
      { status: 404 }
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
  // Cap the range so a single job can't run forever
  const MAX_RANGE = 5000;
  if (end - start + 1 > MAX_RANGE) {
    return NextResponse.json(
      { success: false, error: `Roll range too large. Max ${MAX_RANGE} rolls per job.` },
      { status: 400 }
    );
  }

  const job = createJob({
    publication: pub,
    rollStart: start,
    rollEnd: end,
    source: source || "https://result.bteb.gov.bd",
  });

  // Fire and forget — the job runs in the background
  runJob(job.id, { concurrency: concurrency ?? 8, delayMs: delayMs ?? 120 }).catch((e) => {
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
