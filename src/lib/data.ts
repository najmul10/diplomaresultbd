/**
 * Server-side data access layer (reference catalogs only).
 *
 * NOTE: There is NO bundled student/result data anymore. Individual, Group,
 * Latest, Institute, and Hunt views all fetch LIVE from the official BTEB
 * archive (see src/lib/bteb-scraper.ts). The only bundled files here are
 * public reference catalogs (departments, institutes, booklists, routines).
 */
import { readFileSync } from "fs";
import { join } from "path";
import type {
  Department,
  Institute,
  Routine,
  Booklist,
} from "@/lib/types";

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

let cache: {
  departments: Department[];
  institutes: Institute[];
  routines: Routine[];
  booklists: Booklist[];
} | null = null;

function load() {
  if (cache) return cache;
  cache = {
    departments: readJson<Department[]>("departments.json"),
    institutes: readJson<Institute[]>("institutes.json"),
    routines: readJson<Routine[]>("routines.json"),
    booklists: readJson<Booklist[]>("booklists.json"),
  };
  return cache;
}

export function getDepartments() {
  return load().departments;
}

export function getInstitutes() {
  return load().institutes;
}

export function getRoutines() {
  return load().routines;
}

export function getBooklists() {
  return load().booklists;
}
