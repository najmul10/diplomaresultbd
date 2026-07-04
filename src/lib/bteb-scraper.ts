/**
 * Live BTEB result scraper.
 *
 * Fetches REAL results from the official Bangladesh Technical Education Board
 * archive at http://180.211.162.102:8444/result_arch/result.php (the public
 * PHP archive — no captcha, no auth). This is the same source that
 * btebresultszone.com mirrors.
 *
 * The official form submits via GET with params: exam, year, roll, reg,
 * sess_part. It returns an HTML page containing either the result table or a
 * "Doesn't match / Result doesn't exist" message.
 *
 * We parse that HTML into a structured StudentResult. Results are cached
 * in-memory for 1 hour so repeated searches are instant.
 */
import type { StudentResult, SubjectResult } from "@/lib/types";

const OFFICIAL_BASE = "http://180.211.162.102:8444/result_arch/result.php";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type CacheEntry = { at: number; data: StudentResult | null };
const cache = new Map<string, CacheEntry>();

export type LiveSearchParams = {
  exam: string; // e.g. "15" = Diploma in Engineering
  year: string; // e.g. "2022"
  roll: string;
  reg?: string;
  sessPart?: string; // e.g. "21" Jan-Jun, "22" Jul-Dec
};

export type LiveSearchResult =
  | { success: true; data: StudentResult | null; cached: boolean; source: string }
  | { success: false; error: string };

function cacheKey(p: LiveSearchParams): string {
  return `${p.exam}|${p.year}|${p.roll}|${p.reg || ""}|${p.sessPart || ""}`;
}

/**
 * Fetch the raw HTML result page from the official BTEB archive.
 */
async function fetchOfficialHtml(params: LiveSearchParams): Promise<string> {
  const url = new URL(OFFICIAL_BASE);
  url.searchParams.set("exam", params.exam);
  url.searchParams.set("year", params.year);
  url.searchParams.set("roll", params.roll);
  url.searchParams.set("reg", params.reg || "");
  url.searchParams.set("sess_part", params.sessPart || "");
  url.searchParams.set("Submit", " View Result");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "http://180.211.162.102:8444/result_arch/index.php",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    // The official archive is HTTP on a raw IP; allow it.
    // @ts-expect-error - Next.js fetch allows this via RequestInit
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Official archive returned HTTP ${res.status}`);
  }
  return res.text();
}

/**
 * Decode HTML entities and strip tags from a string.
 */
function decodeHtml(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse the official BTEB HTML result page into a structured StudentResult.
 *
 * The official result page (result.php) uses a TABLE with key-value rows:
 *   <tr><td>Roll No</td><td>449381</td></tr>
 *   <tr><td>Name</td><td>MD. RIFAT HOSSAIN</td></tr>
 *   ...etc...
 * We extract each labeled field from these rows.
 *
 * Returns null if the page says "doesn't match" / "doesn't exist".
 */
function parseOfficialHtml(html: string, params: LiveSearchParams): StudentResult | null {
  const lower = html.toLowerCase();

  // Not-found detection
  if (
    lower.includes("doesn't match") ||
    lower.includes("doesn&#39;t match") ||
    lower.includes("doesn t match") ||
    lower.includes("doesn't exist") ||
    lower.includes("doesn&#39;t exist") ||
    lower.includes("doesn t exist") ||
    lower.includes("result not found")
  ) {
    return null;
  }

  // Strip scripts/styles
  const cleaned = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");

  // Extract all table rows as key-value pairs
  // The official page has: <tr><td>Label</td><td>Value</td></tr>
  const kvPairs: Record<string, string> = {};
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(cleaned)) !== null) {
    const row = rowMatch[1];
    const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) =>
      decodeHtml(m[1])
    );
    if (cells.length >= 2) {
      const label = cells[0].trim().toLowerCase();
      const value = cells[1].trim();
      if (label && value) {
        kvPairs[label] = value;
      }
    }
  }

  // Also try a plain-text fallback for fields that might not be in table cells
  const plainText = cleaned.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

  function getValue(...labels: string[]): string {
    // Pass 1: exact match
    for (const l of labels) {
      const key = l.toLowerCase().trim();
      if (kvPairs[key]) return kvPairs[key];
    }
    // Pass 2: label key contains our search term as a whole word
    for (const l of labels) {
      const key = l.toLowerCase().trim();
      for (const k in kvPairs) {
        // Only match if the kv key starts with our search OR our search starts with kv key
        // but avoid "name" matching "father's name" — require that our key is the FULL kv key
        // or our key is a prefix of the kv key
        if (k.startsWith(key) && k.length <= key.length + 2) return kvPairs[k];
      }
    }
    // Pass 3: regex in plain text (last resort)
    for (const l of labels) {
      const escaped = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const m = plainText.match(new RegExp(escaped + "\\s*[:\\-]?\\s*([\\w\\d/\\-.]+)", "i"));
      if (m && m[1]) return m[1];
    }
    return "";
  }

  const rollNo = getValue("roll no", "roll number", "roll") || params.roll;
  const regNo = getValue("registration no", "registration number", "registration") || params.reg || "";
  const name = getValue("name") || "";
  const institute = getValue("institute name", "institute", "college") || "";
  const session = getValue("session") || "";
  const technology = getValue("technology name", "technology", "department") || "";
  const examYearVal = getValue("exam year", "year") || params.year;
  const resultStatus = getValue("result") || "";
  // CGPA/Division/Grade field — extract the numeric GPA
  const cgpaRaw = getValue("cgpa/division/grade", "cgpa", "gpa", "grade") || "";
  const gpa = parseFloat(cgpaRaw) || 0;
  const cgpa = gpa; // in the official archive, this is the overall CGPA

  // Determine result status
  const statusUpper = resultStatus.toUpperCase().trim();
  const result: StudentResult["result"] =
    statusUpper === "PASSED" || statusUpper === "PASS"
      ? "PASSED"
      : statusUpper === "REFERRED" || statusUpper === "REFER"
        ? "REFERRED"
        : statusUpper === "FAILED" || statusUpper === "FAIL"
          ? "FAILED"
          : gpa > 0
            ? "PASSED"
            : "FAILED";

  // Letter grade from GPA (BTEB standard scale)
  const letterGrade =
    gpa >= 4 ? "A+" : gpa >= 3.5 ? "A" : gpa >= 3 ? "A-" : gpa >= 2.5 ? "B" : gpa >= 2 ? "C" : gpa > 0 ? "D" : "F";

  // The official archive doesn't always show subject-wise marks in the HTML
  // (it's in a comment block). So subjects may be empty — that's OK.
  const subjects: SubjectResult[] = [];

  return {
    roll: rollNo,
    registrationNo: regNo,
    name,
    instituteCode: "",
    instituteName: institute,
    departmentCode: "",
    departmentName: technology,
    examType: "Diploma",
    curriculum: EXAM_CODE_TO_NAME[params.exam] || "",
    regulation: session && session.includes("2019") ? 2016 : 2022,
    batchLabel: session || "",
    admissionYear: session ? parseInt(session.split("-")[0]) || 0 : 0,
    semester: 0,
    examYear: parseInt(examYearVal, 10) || 0,
    publicationId: "live",
    publicationDate: "",
    subjects,
    gpa,
    cgpa,
    letterGrade,
    result,
    referredSubjects: [],
  };
}

export const EXAM_CODE_TO_NAME: Record<string, string> = {
  "15": "Diploma in Engineering",
  "17": "Diploma in Engineering (Army)",
  "14": "Diploma in Engineering (Naval)",
  "19": "Diploma in Textile Engineering",
  "21": "Diploma in Textile (Jute)",
  "49": "Diploma in Textile (Garments)",
  "23": "Diploma in Agriculture",
  "74": "Diploma in Fisheries",
  "72": "Diploma in Livestock",
  "20": "Diploma in Forestry",
  "75": "Diploma in Medical",
  "80": "Advanced Certificate Course",
  "79": "Certificate-in-Health Technology",
  "76": "Certificate in Marine Trade",
  "81": "Certificate Course (One Year)",
  "30": "Basic Trade 360 Hours",
  "41": "Computer Short Course 200 Hours",
  "29": "National Skill Standard",
};

export const OFFICIAL_EXAM_OPTIONS = [
  { code: "15", name: "Diploma in Engineering" },
  { code: "17", name: "Diploma in Engineering (Army)" },
  { code: "14", name: "Diploma in Engineering (Naval)" },
  { code: "19", name: "Diploma in Textile" },
  { code: "21", name: "Diploma in Textile (Jute)" },
  { code: "49", name: "Diploma in Textile (Garments)" },
  { code: "23", name: "Diploma in Agriculture" },
  { code: "74", name: "Diploma in Fisheries" },
  { code: "72", name: "Diploma in Livestock" },
  { code: "20", name: "Diploma in Forestry" },
  { code: "75", name: "Diploma in Medical" },
  { code: "80", name: "Advanced Certificate Course" },
  { code: "76", name: "Certificate in Marine Trade" },
  { code: "81", name: "Certificate Course (One Year)" },
  { code: "30", name: "Basic Trade 360 Hours" },
  { code: "41", name: "Computer Short Course 200 Hours" },
  { code: "29", name: "National Skill Standard" },
];

export const OFFICIAL_SESSION_PARTS = [
  { code: "", name: "Any / All" },
  { code: "21", name: "January - June (Jan-Jun)" },
  { code: "22", name: "July - December (Jul-Dec)" },
  { code: "31", name: "January - March (Jan-Mar)" },
  { code: "32", name: "April - June (Apr-Jun)" },
  { code: "33", name: "July - September (Jul-Sep)" },
  { code: "34", name: "October - December (Oct-Dec)" },
];

export const OFFICIAL_YEARS = [
  "2025", "2024", "2023", "2022", "2021", "2020", "2019",
  "2018", "2017", "2016", "2015", "2014", "2013", "2012",
  "2011", "2010", "2009", "2008", "2007", "2006", "2005",
];

/**
 * Search the official BTEB archive live. Cached for 1 hour.
 */
export async function searchLive(params: LiveSearchParams): Promise<LiveSearchResult> {
  const key = cacheKey(params);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return { success: true, data: hit.data, cached: true, source: "official-archive (cached)" };
  }

  try {
    const html = await fetchOfficialHtml(params);
    const parsed = parseOfficialHtml(html, params);
    cache.set(key, { at: Date.now(), data: parsed });
    return { success: true, data: parsed, cached: false, source: "official-archive" };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error
          ? `Could not reach the official BTEB archive: ${e.message}. Please try again in a moment.`
          : "Unknown error contacting official BTEB archive.",
    };
  }
}

/**
 * Batch live search — fetch multiple rolls in parallel from the official
 * archive. Used by Group Results. Returns one result per roll (null = not
 * found). Concurrency-limited to be polite to the government server.
 */
export async function searchLiveBatch(
  base: Omit<LiveSearchParams, "roll">,
  rolls: string[]
): Promise<Array<{ roll: string; result: StudentResult | null; error?: string }>> {
  const CONCURRENCY = 6;
  const out: Array<{ roll: string; result: StudentResult | null; error?: string }> = [];
  for (let i = 0; i < rolls.length; i += CONCURRENCY) {
    const batch = rolls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (roll) => {
        try {
          const r = await searchLive({ ...base, roll });
          return { roll, result: r.success ? r.data : null, error: r.success ? undefined : r.error };
        } catch (e) {
          return { roll, result: null, error: e instanceof Error ? e.message : "error" };
        }
      })
    );
    out.push(...results);
  }
  return out;
}

/**
 * Fetch the REAL curriculum list from the official new archive's public API.
 * Falls back to OFFICIAL_EXAM_OPTIONS if the API is unreachable.
 */
export async function fetchLiveCurricula(): Promise<
  Array<{ code: string; name: string; totalSemesters: number }>
> {
  try {
    const res = await fetch("https://result.bteb.gov.bd/api/public/curriculums", {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://result.bteb.gov.bd/result-search",
      },
      // @ts-expect-error next fetch option
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Array<{
      curriculumCode: string;
      curriculumName: string;
      totalSemesters: number;
    }>;
    return data
      .filter((c) => c.curriculumCode !== "99")
      .map((c) => ({
        code: c.curriculumCode,
        name: c.curriculumName.replace(/-/g, " ").replace(/\s+/g, " ").trim(),
        totalSemesters: c.totalSemesters,
      }));
  } catch {
    // Fallback to the legacy archive's exam list
    return OFFICIAL_EXAM_OPTIONS.map((e) => ({
      code: e.code,
      name: e.name,
      totalSemesters: 8,
    }));
  }
}
