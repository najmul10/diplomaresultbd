/**
 * Auto-Hunt Crawler Job Manager (in-memory).
 *
 * This mirrors how the original btebresultszone.com "auto hunts" all
 * results: when BTEB publishes a new batch on the official archive
 * (result.bteb.gov.bd), a crawl job iterates through the roll-number
 * range for that publication, fetches each result, and stores it.
 *
 * Here we simulate that crawl against our bundled dataset. Each "fetch"
 * resolves a roll against results.json — a hit is "found", otherwise the
 * roll is marked "not_published". The job runs in the background with
 * configurable concurrency + delay, and exposes live progress.
 *
 * Swap `_fetchOneRoll` with a real scraper call to result.bteb.gov.bd
 * (with captcha solving) to turn this into a production crawler.
 */
import type { StudentResult, Publication } from "@/lib/types";

export type HuntStatus = "queued" | "running" | "paused" | "completed" | "failed" | "stopped";

export type HuntLogEntry = {
  t: string;
  roll: string;
  status: "found" | "not_found" | "error";
  gpa?: number;
  grade?: string;
  msg?: string;
};

export type HuntJob = {
  id: string;
  publicationId: string;
  publicationTitle: string;
  curriculum: string;
  semester: number;
  examYear: number;
  rollStart: number;
  rollEnd: number;
  total: number;
  processed: number;
  found: number;
  notFound: number;
  errors: number;
  status: HuntStatus;
  startedAt: string;
  finishedAt: string | null;
  throughput: number; // rolls/sec
  etaSeconds: number;
  source: string;
  log: HuntLogEntry[];
  results: StudentResult[];
};

const jobs = new Map<string, HuntJob>();
const MAX_LOG = 80;

export function getJob(id: string): HuntJob | undefined {
  return jobs.get(id);
}

export function listJobs(): HuntJob[] {
  return Array.from(jobs.values()).sort((a, b) =>
    a.startedAt < b.startedAt ? 1 : -1
  );
}

export function createJob(opts: {
  publication: Publication;
  rollStart: number;
  rollEnd: number;
  source: string;
}): HuntJob {
  const id = `hunt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const total = opts.rollEnd - opts.rollStart + 1;
  const job: HuntJob = {
    id,
    publicationId: opts.publication.id,
    publicationTitle: opts.publication.title,
    curriculum: opts.publication.curriculum,
    semester: opts.publication.semester,
    examYear: opts.publication.examYear,
    rollStart: opts.rollStart,
    rollEnd: opts.rollEnd,
    total,
    processed: 0,
    found: 0,
    notFound: 0,
    errors: 0,
    status: "queued",
    startedAt: new Date().toISOString(),
    finishedAt: null,
    throughput: 0,
    etaSeconds: 0,
    source: opts.source,
    log: [],
    results: [],
  };
  jobs.set(id, job);
  return job;
}

// Load results lazily (server-side only)
let _results: StudentResult[] | null = null;
async function getResultsData(): Promise<StudentResult[]> {
  if (_results) return _results;
  const { getResults } = await import("@/lib/data");
  _results = getResults();
  return _results!;
}

function _resolveRoll(
  data: StudentResult[],
  rollInt: number,
  publicationId: string
): StudentResult | undefined {
  const padded = String(rollInt).padStart(8, "0");
  return data.find(
    (r) =>
      r.publicationId === publicationId &&
      (r.roll === padded || r.roll.replace(/^0+/, "") === String(rollInt))
  );
}

function pushLog(job: HuntJob, entry: HuntLogEntry) {
  job.log.push(entry);
  if (job.log.length > MAX_LOG) {
    job.log = job.log.slice(-MAX_LOG);
  }
}

/**
 * Run a hunt job in the background. Processes rolls in small batches
 * with a delay to mimic a polite crawl of the official archive.
 */
export async function runJob(
  id: string,
  opts: { concurrency?: number; delayMs?: number } = {}
): Promise<void> {
  const job = jobs.get(id);
  if (!job) return;
  const { concurrency = 8, delayMs = 120 } = opts;

  job.status = "running";
  const data = await getResultsData();
  const started = Date.now();

  let cursor = job.rollStart;
  // keep going until we cover the range or job is stopped/paused/failed
  while (cursor <= job.rollEnd && job.status === "running") {
    const batch: number[] = [];
    for (let i = 0; i < concurrency && cursor <= job.rollEnd; i++) {
      batch.push(cursor);
      cursor++;
    }
    // process batch in parallel
    await Promise.all(
      batch.map(async (rollInt) => {
        try {
          // simulate network fetch latency per roll
          await new Promise((r) => setTimeout(r, 20 + Math.random() * 60));
          const res = _resolveRoll(data, rollInt, job.publicationId);
          if (res) {
            job.found += 1;
            job.results.push(res);
            pushLog(job, {
              t: new Date().toISOString(),
              roll: String(rollInt).padStart(8, "0"),
              status: "found",
              gpa: res.gpa,
              grade: res.letterGrade,
            });
          } else {
            job.notFound += 1;
            // Only log some not_found entries to keep the log readable
            if (Math.random() < 0.25) {
              pushLog(job, {
                t: new Date().toISOString(),
                roll: String(rollInt).padStart(8, "0"),
                status: "not_found",
                msg: "roll not in published range",
              });
            }
          }
        } catch (e) {
          job.errors += 1;
          pushLog(job, {
            t: new Date().toISOString(),
            roll: String(rollInt).padStart(8, "0"),
            status: "error",
            msg: e instanceof Error ? e.message : "unknown error",
          });
        } finally {
          job.processed += 1;
        }
      })
    );

    const elapsed = (Date.now() - started) / 1000;
    job.throughput = elapsed > 0 ? Math.round((job.processed / elapsed) * 10) / 10 : 0;
    const remaining = job.total - job.processed;
    job.etaSeconds = job.throughput > 0 ? Math.round(remaining / job.throughput) : 0;

    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  if (job.status === "running") {
    job.status = "completed";
  }
  job.finishedAt = new Date().toISOString();
  job.etaSeconds = 0;
}

export function stopJob(id: string): boolean {
  const job = jobs.get(id);
  if (!job) return false;
  if (job.status === "running" || job.status === "queued") {
    job.status = "stopped";
    job.finishedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export function clearJob(id: string): boolean {
  return jobs.delete(id);
}
