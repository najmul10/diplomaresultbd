"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Radar,
  Play,
  Square,
  Trash2,
  Loader2,
  RefreshCw,
  Database,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  Activity,
  Clock,
  ExternalLink,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { AdSlot } from "@/components/site/ad-slot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeBadge } from "@/components/site/grade-badge";
import { gpaColor } from "@/lib/grade";
import { toast } from "sonner";
import { useRouter } from "@/store/use-router";

type ExamOption = { code: string; name: string };
type SessionPart = { code: string; name: string };
type Options = {
  exams: ExamOption[];
  years: string[];
  sessionParts: SessionPart[];
};

type HuntJobSummary = {
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
  status: "queued" | "running" | "paused" | "completed" | "failed" | "stopped";
  startedAt: string;
  finishedAt: string | null;
  throughput: number;
  etaSeconds: number;
  source: string;
};

type HuntLogEntry = {
  t: string;
  roll: string;
  status: "found" | "not_found" | "error";
  gpa?: number;
  grade?: string;
  msg?: string;
};

type HuntJobFull = HuntJobSummary & {
  log: HuntLogEntry[];
  results: Array<{
    roll: string;
    name: string;
    gpa: number;
    letterGrade: string;
    result: string;
    instituteName: string;
  }>;
};

async function fetchOptions(): Promise<Options> {
  const res = await fetch("/api/results/live-options");
  const j = await res.json();
  return j.data;
}

async function fetchJobs(): Promise<HuntJobSummary[]> {
  const res = await fetch("/api/admin/hunt/status");
  const j = await res.json();
  if (!j.success) throw new Error(j.error);
  return j.data;
}

async function fetchJobDetail(id: string): Promise<HuntJobFull> {
  const res = await fetch(`/api/admin/hunt/status?id=${id}`);
  const j = await res.json();
  if (!j.success) throw new Error(j.error);
  return j.data;
}

async function startHunt(payload: {
  exam: string;
  year: string;
  sessPart?: string;
  rollStart: number;
  rollEnd: number;
}) {
  const res = await fetch("/api/admin/hunt/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await res.json();
  if (!j.success) throw new Error(j.error);
  return j.data;
}

async function stopHunt(id: string, clear = false) {
  const res = await fetch("/api/admin/hunt/stop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, clear }),
  });
  const j = await res.json();
  if (!j.success) throw new Error(j.error);
  return j.data;
}

function formatDuration(s: number): string {
  if (s <= 0) return "—";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_TONE: Record<HuntJobSummary["status"], string> = {
  queued: "bg-muted text-muted-foreground",
  running: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  paused: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  completed: "bg-primary/15 text-primary",
  failed: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  stopped: "bg-muted text-muted-foreground",
};

export function HuntView() {
  const navigate = useRouter((s) => s.navigate);
  const qc = useQueryClient();
  const { data: options } = useQuery({
    queryKey: ["live-options"],
    queryFn: fetchOptions,
  });

  const [exam, setExam] = React.useState("15");
  const [year, setYear] = React.useState("2022");
  const [sessPart, setSessPart] = React.useState("any");
  const [rollStart, setRollStart] = React.useState("100001");
  const [rollEnd, setRollEnd] = React.useState("100080");
  const [selectedJob, setSelectedJob] = React.useState<string | null>(null);

  const startMut = useMutation({
    mutationFn: startHunt,
    onSuccess: (data) => {
      toast.success(`Search started — ${data.total} rolls to process`);
      setSelectedJob(data.jobId);
      qc.invalidateQueries({ queryKey: ["hunt-jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stopMut = useMutation({
    mutationFn: (id: string) => stopHunt(id, false),
    onSuccess: () => {
      toast.success("Hunt stopped");
      qc.invalidateQueries({ queryKey: ["hunt-jobs"] });
    },
  });

  const clearMut = useMutation({
    mutationFn: (id: string) => stopHunt(id, true),
    onSuccess: () => {
      toast.success("Hunt cleared");
      if (selectedJob) setSelectedJob(null);
      qc.invalidateQueries({ queryKey: ["hunt-jobs"] });
    },
  });

  const { data: jobs, refetch } = useQuery({
    queryKey: ["hunt-jobs"],
    queryFn: fetchJobs,
    refetchInterval: 1500,
  });

  const { data: detail } = useQuery({
    queryKey: ["hunt-job", selectedJob],
    queryFn: () => fetchJobDetail(selectedJob!),
    enabled: !!selectedJob,
    refetchInterval: 1200,
  });

  const hasRunning = jobs?.some((j) => j.status === "running" || j.status === "queued");

  const onSubmit = () => {
    if (!exam || !year) {
      toast.error("Select exam type and year");
      return;
    }
    const s = Number(rollStart);
    const e = Number(rollEnd);
    if (!Number.isFinite(s) || !Number.isFinite(e) || e < s) {
      toast.error("Roll range invalid");
      return;
    }
    if (e - s + 1 > 2000) {
      toast.error("Max 2000 rolls per search");
      return;
    }
    startMut.mutate({
      exam,
      year,
      sessPart: sessPart !== "any" ? sessPart : undefined,
      rollStart: s,
      rollEnd: e,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Bulk Result Finder"
        description="Search an entire roll-number range at once and collect every result found."
        icon={Radar}
        badge="Live"
      />

      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Radar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold text-primary">
              Search a full roll range
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Pick an exam type + year, define a roll range, and start. Found
              results are collected and shown live. Max 2000 rolls per job.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: start form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-emerald-600" />
              Start a search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Exam Type</Label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
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
                <Label className="text-xs">Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Session Part (optional)</Label>
              <Select value={sessPart} onValueChange={setSessPart}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options?.sessionParts.map((s) => (
                    <SelectItem key={s.code || "any"} value={s.code || "any"}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rs" className="text-xs">Roll start</Label>
                <Input id="rs" value={rollStart} onChange={(e) => setRollStart(e.target.value)} inputMode="numeric" className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="re" className="text-xs">Roll end</Label>
                <Input id="re" value={rollEnd} onChange={(e) => setRollEnd(e.target.value)} inputMode="numeric" className="font-mono" />
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              Will search{" "}
              <span className="font-mono font-semibold text-foreground">
                {Math.max(0, (Number(rollEnd) || 0) - (Number(rollStart) || 0) + 1)}
              </span>{" "}
              rolls live at 6-way concurrency. Larger ranges take longer.
            </div>
            <Button className="w-full gap-2" onClick={onSubmit} disabled={startMut.isPending}>
              {startMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {startMut.isPending ? "Starting..." : "Start Search"}
            </Button>
          </CardContent>
        </Card>

        {/* Right: jobs + detail */}
        <div className="flex flex-col gap-5">
          <AdSlot slot="individual-inline" />
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-emerald-600" />
                Search jobs
                {hasRunning ? (
                  <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    Live
                  </Badge>
                ) : null}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-1.5 text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {jobs && jobs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                      <tr className="border-b">
                        <th className="px-3 py-2 text-left font-medium">Exam</th>
                        <th className="px-3 py-2 text-center font-medium">Range</th>
                        <th className="px-3 py-2 text-center font-medium">Progress</th>
                        <th className="px-3 py-2 text-center font-medium">Found</th>
                        <th className="px-3 py-2 text-center font-medium">Status</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((j) => {
                        const pct = j.total ? Math.round((j.processed / j.total) * 100) : 0;
                        return (
                          <tr
                            key={j.id}
                            className={`cursor-pointer border-b last:border-0 ${selectedJob === j.id ? "bg-accent" : ""}`}
                            onClick={() => setSelectedJob(j.id)}
                          >
                            <td className="px-3 py-2 min-w-0">
                              <p className="truncate text-xs font-medium">{j.examName}</p>
                              <p className="text-[11px] text-muted-foreground">{j.year}{j.sessPart ? ` • ${j.sessPart}` : ""}</p>
                            </td>
                            <td className="px-3 py-2 text-center font-mono text-[11px] text-muted-foreground">{j.rollStart}-{j.rollEnd}</td>
                            <td className="px-3 py-2 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Progress value={pct} className="h-1.5 w-16" />
                                <span className="text-[11px] text-muted-foreground">{pct}%</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">{j.found}</span>
                              <span className="text-[11px] text-muted-foreground">/{j.processed}</span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Badge variant="secondary" className={`text-[10px] ${STATUS_TONE[j.status]}`}>{j.status}</Badge>
                            </td>
                            <td className="px-3 py-2 text-right">
                              {j.status === "running" || j.status === "queued" ? (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-amber-500" onClick={(e) => { e.stopPropagation(); stopMut.mutate(j.id); }} aria-label="Stop">
                                  <Square className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-rose-500" onClick={(e) => { e.stopPropagation(); clearMut.mutate(j.id); }} aria-label="Clear">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No search jobs yet. Configure above and click <span className="font-semibold text-foreground">Start Search</span>.
                </div>
              )}
            </CardContent>
          </Card>

          {detail ? (
            <div className="grid gap-5 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    Live progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{detail.processed} / {detail.total} rolls</span>
                      <span className="font-semibold">{detail.total ? Math.round((detail.processed / detail.total) * 100) : 0}%</span>
                    </div>
                    <Progress value={detail.total ? (detail.processed / detail.total) * 100 : 0} className="mt-2 h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat icon={CheckCircle2} label="Found" value={String(detail.found)} tone="emerald" />
                    <Stat icon={XCircle} label="Not found" value={String(detail.notFound)} tone="muted" />
                    <Stat icon={Zap} label="Throughput" value={`${detail.throughput}/s`} tone="teal" />
                    <Stat icon={Clock} label="ETA" value={formatDuration(detail.etaSeconds)} tone="amber" />
                  </div>
                  {detail.status === "running" ? (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching rolls {detail.rollStart}–{detail.rollEnd}...
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      Job <span className="font-semibold">{detail.status}</span> at {detail.finishedAt ? formatTime(detail.finishedAt) : "—"}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="h-4 w-4 text-emerald-600" />
                    Search log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-56 space-y-1 overflow-y-auto scrollbar-thin rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
                    {detail.log.length === 0 ? (
                      <p className="text-zinc-500">Waiting for first result...</p>
                    ) : (
                      detail.log.slice().reverse().map((l, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="shrink-0 text-zinc-500">{formatTime(l.t)}</span>
                          <span className="shrink-0 text-zinc-400">{l.roll}</span>
                          {l.status === "found" ? (
                            <span className="text-emerald-400">✓ found — GPA {l.gpa?.toFixed(2)} ({l.grade})</span>
                          ) : l.status === "not_found" ? (
                            <span className="text-zinc-500">— {l.msg || "not found"}</span>
                          ) : (
                            <span className="text-rose-400">✗ {l.msg || "error"}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {detail.results.length > 0 ? (
                <Card className="md:col-span-2">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">Results Found ({detail.results.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => navigate("individual")} className="gap-1.5">
                      <ExternalLink className="h-4 w-4" />
                      Search in Individual
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-72 overflow-y-auto scrollbar-thin">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                          <tr className="border-b">
                            <th className="px-3 py-2 text-left font-medium">Roll</th>
                            <th className="px-3 py-2 text-left font-medium">Name</th>
                            <th className="hidden px-3 py-2 text-left font-medium md:table-cell">Institute</th>
                            <th className="px-3 py-2 text-center font-medium">GPA</th>
                            <th className="px-3 py-2 text-center font-medium">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.results.slice(0, 100).map((r) => (
                            <tr key={r.roll} className="border-b last:border-0">
                              <td className="px-3 py-2 font-mono text-xs">{r.roll}</td>
                              <td className="px-3 py-2 font-medium">{r.name || "—"}</td>
                              <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{r.instituteName || "—"}</td>
                              <td className={`px-3 py-2 text-center font-mono font-semibold ${gpaColor(r.gpa)}`}>{typeof r.gpa === "number" ? r.gpa.toFixed(2) : "—"}</td>
                              <td className="px-3 py-2 text-center"><GradeBadge grade={r.letterGrade || "F"} size="sm" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Radar className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-semibold">No job selected</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Start a search, then click a job in the list above to see live progress, the log, and results found.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone = "muted",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "muted" | "emerald" | "teal" | "amber";
}) {
  const toneCls = {
    muted: "bg-muted/50",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  }[tone];
  return (
    <div className={`rounded-xl p-3 ${toneCls}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold leading-none">{value}</p>
    </div>
  );
}
