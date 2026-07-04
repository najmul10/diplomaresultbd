"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  SearchX,
  ShieldCheck,
  Zap,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  GraduationCap,
  Star,
  StarOff,
  Share2,
  Download,
  Building2,
  Hash,
  IdCard,
  Award,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { AdSlot } from "@/components/site/ad-slot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeBadge } from "@/components/site/grade-badge";
import { gpaColor, formatDate, ordinal } from "@/lib/grade";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/store/use-favorites";
import type { StudentResult } from "@/lib/types";

type ExamOption = { code: string; name: string; totalSemesters?: number };
type SessionPart = { code: string; name: string };
type Options = {
  exams: ExamOption[];
  years: string[];
  sessionParts: SessionPart[];
};

async function fetchOptions(): Promise<Options> {
  const res = await fetch("/api/results/live-options");
  const j = await res.json();
  return j.data;
}

type HistoryMeta = {
  searchedAt: string;
  source: string;
  officialSource: string;
  yearsSearched?: number;
  resultsFound?: number;
  cached?: boolean;
};

async function searchLiveHistory(params: {
  exam: string;
  roll: string;
  reg?: string;
}): Promise<{ results: StudentResult[]; meta: HistoryMeta }> {
  const sp = new URLSearchParams({
    exam: params.exam,
    roll: params.roll,
    history: "1",
  });
  if (params.reg) sp.set("reg", params.reg);
  const res = await fetch(`/api/results/live-search?${sp.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Search failed");
  }
  return { results: json.data as StudentResult[], meta: json.meta as HistoryMeta };
}

export function IndividualView() {
  const [exam, setExam] = React.useState<string>("15");
  const [roll, setRoll] = React.useState("");
  const [reg, setReg] = React.useState("");
  const [submitted, setSubmitted] = React.useState<{
    exam: string;
    roll: string;
    reg?: string;
  } | null>(null);

  const { data: options } = useQuery({
    queryKey: ["live-options"],
    queryFn: fetchOptions,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["live-history", submitted],
    queryFn: () => searchLiveHistory(submitted!),
    enabled: !!submitted,
    retry: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim()) {
      toast.error("Please enter your roll number");
      return;
    }
    if (!exam) {
      toast.error("Please select exam type");
      return;
    }
    setSubmitted({
      exam,
      roll: roll.trim(),
      reg: reg.trim() || undefined,
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Individual Results"
        description="Search your complete BTEB academic history — all semester results in one place."
        icon={Search}
        badge="Live"
      />

      {/* Info banner */}
      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-primary">
              Fast &amp; reliable BTEB results
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Select your exam type and enter your roll number to instantly
              view your complete academic history — every semester result, GPA,
              CGPA and grade in one place.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search form */}
      <Card className="mt-6 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_2fr_1fr]">
              <div className="space-y-1.5">
                <Label htmlFor="exam" className="text-xs font-medium">Exam Type</Label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger id="exam" className="h-12">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.exams.map((x) => (
                      <SelectItem key={x.code} value={x.code}>
                        {x.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="roll" className="text-xs font-medium">Roll Number *</Label>
                <Input
                  id="roll"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="e.g. 449381"
                  className="h-12 font-mono text-base"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg" className="text-xs font-medium">Registration No (optional)</Label>
                <Input
                  id="reg"
                  value={reg}
                  onChange={(e) => setReg(e.target.value)}
                  placeholder="10-digit registration no"
                  className="h-11 font-mono"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full gap-2 px-6 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {isLoading ? "Searching..." : "Check My Full Result"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Enter your roll number to view all your semester results, GPA and
              CGPA in one place.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Result area */}
      <div className="mt-6">
        <AdSlot slot="individual-inline" />

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-muted-foreground">
                Fetching your results...
              </p>
              <p className="text-xs text-muted-foreground">
                Roll <span className="font-mono font-semibold">{submitted?.roll}</span>
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-rose-500/30">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <SearchX className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">No result found</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Please check your details and try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : data && data.results.length > 0 ? (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified result
              </Badge>
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {data.results.length} semester result{data.results.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <ResultHistory results={data.results} />
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <Search className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">Search your live result</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Select your exam type, enter your roll number (and optional
                  registration), and we&apos;ll fetch your complete academic
                  history — every semester result, GPA and CGPA.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * Full academic history display — stacked semester cards like the competitor.
 */
function ResultHistory({ results }: { results: StudentResult[] }) {
  const favs = useFavorites();
  // Use the most recent result for identity
  const latest = results[results.length - 1];
  const roll = latest.roll;
  const isFav = favs.has(roll);

  // Compute overall CGPA (average of passing GPAs)
  const passed = results.filter((r) => r.result === "PASSED");
  const cgpa =
    passed.length > 0
      ? Math.round((passed.reduce((a, b) => a + b.gpa, 0) / passed.length) * 100) / 100
      : 0;

  const onToggleFav = () => {
    if (isFav) {
      favs.remove(roll);
      toast.success("Removed from favorites");
    } else {
      favs.add({
        roll: latest.roll,
        name: latest.name,
        instituteName: latest.instituteName,
        departmentName: latest.departmentName,
        semester: latest.semester,
        gpa: cgpa,
        letterGrade: latest.letterGrade,
        result: latest.result,
      });
      toast.success("Added to favorites");
    }
  };

  const onShare = async () => {
    const lines = [
      `BTEB Results Zone — Academic History`,
      `${latest.name} (Roll: ${latest.roll})`,
      `${latest.departmentName} • ${latest.curriculum}`,
      latest.instituteName ? `Institute: ${latest.instituteName}` : "",
      `CGPA: ${cgpa.toFixed(2)}`,
      ``,
      ...results.map(
        (r) => `Year ${r.examYear}: GPA ${r.gpa.toFixed(2)} (${r.letterGrade}) — ${r.result}`
      ),
    ].filter(Boolean);
    try {
      if (navigator.share) {
        await navigator.share({ title: "BTEB Academic History", text: lines.join("\n") });
      } else {
        await navigator.clipboard.writeText(lines.join("\n"));
        toast.success("History copied to clipboard");
      }
    } catch {
      /* cancelled */
    }
  };

  const onDownload = () => {
    const lines = [
      "BTEB RESULTS ZONE — COMPLETE ACADEMIC HISTORY",
      "=".repeat(48),
      `Name            : ${latest.name}`,
      `Roll            : ${latest.roll}`,
      `Registration No : ${latest.registrationNo}`,
      `Institute       : ${latest.instituteName}`,
      `Department      : ${latest.departmentName}`,
      `Curriculum      : ${latest.curriculum}`,
      `Session         : ${latest.batchLabel}`,
      `CGPA            : ${cgpa.toFixed(2)}`,
      ``,
      "SEMESTER RESULTS (by year):",
      "-".repeat(48),
      ...results.map(
        (r) => `Year ${r.examYear}: GPA ${r.gpa.toFixed(2)} ${r.letterGrade} — ${r.result}`
      ),
      ``,
      "Powered by BTEB Results Zone",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BTEB_History_${latest.roll}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("History downloaded");
  };

  return (
    <div className="space-y-5">
      {/* Student identity header */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary/10 via-transparent to-emerald-400/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xl font-bold tracking-tight">
                    {latest.name}
                  </h2>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono font-semibold text-foreground">{latest.roll}</span>
                  </span>
                  {latest.registrationNo ? (
                    <span className="inline-flex items-center gap-1">
                      <IdCard className="h-3 w-3" />
                      <span className="font-mono">{latest.registrationNo}</span>
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {latest.curriculum}
                  </Badge>
                  {latest.departmentName ? (
                    <Badge variant="secondary" className="gap-1">
                      <Award className="h-3 w-3" />
                      {latest.departmentName}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant={isFav ? "default" : "outline"}
                size="sm"
                onClick={onToggleFav}
                className="gap-1.5"
              >
                {isFav ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                {isFav ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm" onClick={onShare} className="gap-1.5">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={onDownload} className="gap-1.5">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Institute + CGPA summary */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {latest.instituteName ? (
              <div className="rounded-lg bg-background/60 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Institute
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold">
                  {latest.instituteName}
                </p>
              </div>
            ) : null}
            {latest.batchLabel ? (
              <div className="rounded-lg bg-background/60 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Session
                </p>
                <p className="mt-0.5 text-sm font-semibold">{latest.batchLabel}</p>
              </div>
            ) : null}
            <div className="rounded-lg bg-background/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Overall CGPA
              </p>
              <p className={cn("mt-0.5 text-2xl font-bold", gpaColor(cgpa))}>
                {cgpa.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stacked semester cards (oldest first) */}
      <div className="space-y-3">
        {results.map((r, idx) => (
          <SemesterCard key={`${r.examYear}-${idx}`} result={r} />
        ))}
      </div>
    </div>
  );
}

/**
 * One semester card — mirrors the competitor's stacked layout.
 */
function SemesterCard({ result }: { result: StudentResult }) {
  const [expanded, setExpanded] = React.useState(false);
  const passed = result.result === "PASSED";
  const referred = result.result === "REFERRED";
  const gpa = typeof result.gpa === "number" ? result.gpa : 0;
  const grade = result.letterGrade || (gpa >= 4 ? "A+" : gpa >= 3.5 ? "A" : gpa >= 3 ? "A-" : gpa >= 2.5 ? "B" : gpa >= 2 ? "C" : gpa > 0 ? "D" : "F");

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        passed
          ? "border-emerald-500/20"
          : referred
            ? "border-amber-500/20"
            : "border-rose-500/20"
      )}
    >
      <CardContent className="p-4 sm:p-5">
        {/* "X subjects yet to pass" banner for referred results */}
        {referred && result.referredSubjects && result.referredSubjects.length > 0 ? (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-700 dark:text-rose-300">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {result.referredSubjects.length}
            </span>
            subject{result.referredSubjects.length > 1 ? "s" : ""} yet to pass
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          {/* Semester icon */}
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              passed
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : referred
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            )}
          >
            <BookOpen className="h-6 w-6" />
          </span>

          {/* Semester info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {result.examYear ? `Result of ${result.examYear}` : "Result"}
              </p>
              <Badge
                variant={passed ? "default" : "destructive"}
                className={cn(
                  "gap-1",
                  passed && "bg-emerald-600 hover:bg-emerald-600",
                  referred && "bg-rose-600 hover:bg-rose-600"
                )}
              >
                {passed ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {result.result === "PASSED" ? "Passed" : result.result === "REFERRED" ? "Referred" : "Failed"}
              </Badge>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {result.batchLabel ? `Session ${result.batchLabel}` : "BTEB Diploma Exam"}
            </p>
          </div>

          {/* GPA display — for referred, show "REF" instead of 0.00 */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                GPA
              </p>
              <p className={cn("text-2xl font-bold leading-none", referred ? "text-rose-600 dark:text-rose-400" : gpaColor(gpa))}>
                {referred ? "REF" : gpa.toFixed(2)}
              </p>
            </div>
            <GradeBadge grade={grade} size="lg" />
          </div>
        </div>

        {/* Referred subjects list — red text, each subject on its own line */}
        {result.referredSubjects && result.referredSubjects.length > 0 ? (
          <div className="mt-3 space-y-1.5 border-t border-rose-500/20 pt-3">
            {result.referredSubjects.map((sub, i) => {
              // Parse "CODE - Subject Name" format
              const parts = sub.split(" - ");
              const code = parts[0] || "";
              const subName = parts.slice(1).join(" - ") || sub;
              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-rose-500/10 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                    {code.slice(-3)}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400">
                    <span className="font-mono text-xs">{code}</span>
                    <span className="mx-1.5 text-muted-foreground/50">·</span>
                    <span className="font-medium">{subName}</span>
                  </span>
                  <Badge variant="outline" className="ml-auto border-rose-500/30 text-[10px] text-rose-600 dark:text-rose-400">
                    Referred
                  </Badge>
                </div>
              );
            })}
            <p className="pt-1 text-xs text-muted-foreground">
              You must clear all referred subjects to receive your GPA for this semester.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
