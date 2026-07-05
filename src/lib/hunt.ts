/**
 * Auto-Hunt Crawler Job Manager (LIVE).
 *
 * Each hunt job crawls a roll-number range against the OFFICIAL BTEB archive
 * (http://180.211.162.102:8444/result_arch/) in real time. No bundled data —
 * every roll is fetched live. Jobs run in the background with concurrency +
 * politeness delay, and expose live progress.
 */
import { searchLive } from "@/lib/bteb-scraper";
import type { StudentResult } from "@/lib/types";

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
  exam: string;
  examName: string;
  year: string;
  sessPart: string | null;
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
  throughput: number;
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
  exam: string;
  examName: string;
  year: string;
  sessPart: string | null;
  rollStart: number;
  rollEnd: number;
  source: string;
}): HuntJob {
  const id = `hunt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const total = opts.rollEnd - opts.rollStart + 1;
  const job: HuntJob = {
    id,
    exam: opts.exam,
    examName: opts.examName,
    year: opts.year,
    sessPart: opts.sessPart,
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

function pushLog(job: HuntJob, entry: HuntLogEntry) {
  job.log.push(entry);
  if (job.log.length > MAX_LOG) {
    job.log = job.log.slice(-MAX_LOG);
  }
}

/**
 * Run a hunt job in the background. Processes rolls in small batches in
 * parallel, each fetched LIVE from the official BTEB archive.
 */
export async function runJob(
  id: string,
  opts: { concurrency?: number; delayMs?: number } = {}
): Promise<void> {
  const job = jobs.get(id);
  if (!job) return;
  const { concurrency = 6, delayMs = 100 } = opts;

  job.status = "running";
  const started = Date.now();

  let cursor = job.rollStart;
  while (cursor <= job.rollEnd && job.status === "running") {
    const batch: number[] = [];
    for (let i = 0; i < concurrency && cursor <= job.rollEnd; i++) {
      batch.push(cursor);
      cursor++;
    }
    await Promise.all(
      batch.map(async (rollInt) => {
        try {
          const r = await searchLive({
            exam: job.exam,
            year: job.year,
            roll: String(rollInt),
            sessPart: job.sessPart || undefined,
          });
          if (r.success && r.data) {
            job.found += 1;
            job.results.push(r.data);
            pushLog(job, {
              t: new Date().toISOString(),
              roll: String(rollInt),
              status: "found",
              gpa: r.data.gpa,
              grade: r.data.letterGrade,
            });
          } else {
            job.notFound += 1;
            if (Math.random() < 0.3) {
              pushLog(job, {
                t: new Date().toISOString(),
                roll: String(rollInt),
                status: "not_found",
                msg: "roll not in archive",
              });
            }
          }
        } catch (e) {
          job.errors += 1;
          pushLog(job, {
            t: new Date().toISOString(),
            roll: String(rollInt),
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
