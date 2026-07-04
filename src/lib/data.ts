/**
 * Server-side data access layer.
 * Reads bundled JSON data files (Vercel-ready: read-only filesystem safe).
 */
import { readFileSync } from "fs";
import { join } from "path";
import type {
  Department,
  Institute,
  Publication,
  StudentResult,
  Routine,
  Booklist,
  PlatformStats,
} from "@/lib/types";

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

let cache: {
  departments: Department[];
  institutes: Institute[];
  publications: Publication[];
  results: StudentResult[];
  routines: Routine[];
  booklists: Booklist[];
  stats: PlatformStats;
} | null = null;

function load() {
  if (cache) return cache;
  cache = {
    departments: readJson<Department[]>("departments.json"),
    institutes: readJson<Institute[]>("institutes.json"),
    publications: readJson<Publication[]>("publications.json"),
    results: readJson<StudentResult[]>("results.json"),
    routines: readJson<Routine[]>("routines.json"),
    booklists: readJson<Booklist[]>("booklists.json"),
    stats: readJson<PlatformStats>("stats.json"),
  };
  return cache;
}

export function getDepartments() {
  return load().departments;
}

export function getInstitutes() {
  return load().institutes;
}

export function getPublications() {
  return load().publications;
}

export function getResults() {
  return load().results;
}

export function getRoutines() {
  return load().routines;
}

export function getBooklists() {
  return load().booklists;
}

export function getStats() {
  return load().stats;
}

// ---------------- Query helpers ----------------

export function findResultByRoll(roll: string): StudentResult | undefined {
  const normalized = roll.trim().replace(/\s+/g, "").toUpperCase();
  // Also compare with leading zeros stripped so "100001" matches "00100001"
  const stripped = normalized.replace(/^0+/, "");
  return load().results.find(
    (r) =>
      r.roll === normalized ||
      r.roll === roll.trim() ||
      r.registrationNo === normalized ||
      r.roll.replace(/^0+/, "") === stripped
  );
}

export function findResultsByRolls(rolls: string[]): StudentResult[] {
  const data = load().results;
  const set = new Set(
    rolls.map((r) => r.trim().replace(/\s+/g, "").replace(/^0+/, ""))
  );
  return data.filter((r) => set.has(r.roll) || set.has(r.roll.replace(/^0+/, "")));
}

export function getInstituteResults(
  instituteCode: string,
  opts?: { publicationId?: string; departmentCode?: string }
): StudentResult[] {
  return load().results.filter(
    (r) =>
      r.instituteCode === instituteCode &&
      (!opts?.publicationId || r.publicationId === opts.publicationId) &&
      (!opts?.departmentCode || r.departmentCode === opts.departmentCode)
  );
}

export function getPublicationResults(publicationId: string): StudentResult[] {
  return load().results.filter((r) => r.publicationId === publicationId);
}

export function getLatestResults(limit = 12): StudentResult[] {
  return [...load().results]
    .sort((a, b) => (a.publicationDate < b.publicationDate ? 1 : -1))
    .slice(0, limit);
}

export function getAnalytics(publicationId?: string) {
  const data = publicationId
    ? load().results.filter((r) => r.publicationId === publicationId)
    : load().results;

  const total = data.length;
  const passed = data.filter((r) => r.result === "PASSED").length;
  const failed = total - passed;
  const passRate = total ? Math.round((passed / total) * 1000) / 10 : 0;
  const avgGpa =
    passed > 0
      ? Math.round(
          (data.filter((r) => r.result === "PASSED").reduce((a, b) => a + b.gpa, 0) / passed) * 100
        ) / 100
      : 0;

  const gradeDistribution: Record<string, number> = {};
  for (const r of data) {
    gradeDistribution[r.letterGrade] = (gradeDistribution[r.letterGrade] || 0) + 1;
  }

  const departmentDistribution: Record<string, { name: string; count: number; passed: number }> = {};
  const depts = load().departments;
  for (const r of data) {
    if (!departmentDistribution[r.departmentCode]) {
      const d = depts.find((x) => x.code === r.departmentCode);
      departmentDistribution[r.departmentCode] = {
        name: d?.name || r.departmentCode,
        count: 0,
        passed: 0,
      };
    }
    departmentDistribution[r.departmentCode].count += 1;
    if (r.result === "PASSED") departmentDistribution[r.departmentCode].passed += 1;
  }

  const instituteTop = (() => {
    const map: Record<string, { name: string; count: number; passed: number }> = {};
    for (const r of data) {
      if (!map[r.instituteCode]) {
        map[r.instituteCode] = { name: r.instituteName, count: 0, passed: 0 };
      }
      map[r.instituteCode].count += 1;
      if (r.result === "PASSED") map[r.instituteCode].passed += 1;
    }
    return Object.entries(map)
      .map(([code, v]) => ({ code, ...v, passRate: v.count ? Math.round((v.passed / v.count) * 1000) / 10 : 0 }))
      .sort((a, b) => b.passed - a.passed)
      .slice(0, 8);
  })();

  return {
    total,
    passed,
    failed,
    passRate,
    avgGpa,
    gradeDistribution,
    departmentDistribution: Object.entries(departmentDistribution).map(([code, v]) => ({
      code,
      name: v.name,
      count: v.count,
      passed: v.passed,
      passRate: v.count ? Math.round((v.passed / v.count) * 1000) / 10 : 0,
    })),
    instituteTop,
  };
}
