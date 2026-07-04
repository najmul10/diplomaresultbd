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
  Info,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GradeBadge } from "@/components/site/grade-badge";
import { gpaColor } from "@/lib/grade";
import { toast } from "sonner";
import { useRouter } from "@/store/use-router";

type Publication = {
  id: string;
  title: string;
  examType: string;
  curriculum: string;
  semester: number;
  examYear: number;
  publicationDate: string;
  totalStudents: number;
  passRate: number;
};

type HuntJobSummary = {
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
    departmentName: string;
  }>;
};

async function fetchPublications(): Promise<Publication[]> {
  const res = await fetch("/api/publications");
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
  publicationId: string;
  rollStart: number;
  rollEnd: number;
  source: string;
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
  const r = s % 60;
  return `${m}m ${r}s`;
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
  const { data: publications } = useQuery({
    queryKey: ["publications"],
    queryFn: fetchPublications,
  });

  const [pubId, setPubId] = React.useState<string>("");
  const [rollStart, setRollStart] = React.useState<string>("100001");
  const [rollEnd, setRollEnd] = React.useState<string>("100400");
  const [source, setSource] = React.useState("https://result.bteb.gov.bd");
  const [selectedJob, setSelectedJob] = React.useState<string | null>(null);

  const selectedPub = publications?.find((p) => p.id === pubId);

  React.useEffect(() => {
    if (publications && publications.length > 0 && !pubId) {
      setPubId(publications[0].id);
    }
  }, [publications, pubId]);

  // Auto-fill the roll range from the selected publication's official range
  React.useEffect(() => {
    if (selectedPub) {
      setRollStart(String(selectedPub.rollStart));
      setRollEnd(String(selectedPub.rollEnd));
    }
  }, [pubId, selectedPub]);

  const startMut = useMutation({
    mutationFn: startHunt,
    onSuccess: (data) => {
      toast.success(`Hunt started — ${data.total} rolls to crawl`);
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

  const onSubmit = () => {
    if (!pubId) {
      toast.error("Select a publication");
      return;
    }
    const s = Number(rollStart);
    const e = Number(rollEnd);
    if (!Number.isFinite(s) || !Number.isFinite(e) || e < s) {
      toast.error("Roll range invalid (end must be >= start)");
      return;
    }
    if (e - s + 1 > 5000) {
      toast.error("Max 5000 rolls per job");
      return;
    }
    startMut.mutate({ publicationId: pubId, rollStart: s, rollEnd: e, source });
  };

  const hasRunning = jobs?.some((j) => j.status === "running" || j.status === "queued");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Auto-Hunt Crawler"
        description="Bulk-crawl all results for a publication from the official BTEB archive — the same ingestion mechanism that powers this platform."
        icon={Radar}
        badge="Admin"
      />

      {/* Info banner */}
      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">How auto-hunt works</p>
            <p className="mt-1 text-muted-foreground">
              When BTEB publishes a new result batch on{" "}
              <a
                href="https://result.bteb.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-primary underline-offset-2 hover:underline"
              >
                result.bteb.gov.bd
                <ExternalLink className="h-3 w-3" />
              </a>
              , a crawl job iterates through the roll-number range, fetches each
              result, and stores it for instant search. This demo resolves rolls
              against the bundled dataset; in production, swap the resolver with a
              live scrape of the official archive.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: start form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              Start a hunt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Publication</Label>
              <Select value={pubId} onValueChange={setPubId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select publication" />
                </SelectTrigger>
                <SelectContent>
                  {publications?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.curriculum} • {p.semester} Sem • {p.examYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPub ? (
                <p className="text-xs text-muted-foreground">
                  {selectedPub.title}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rs">Roll start</Label>
                <Input
                  id="rs"
                  value={rollStart}
                  onChange={(e) => setRollStart(e.target.value)}
                  inputMode="numeric"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="re">Roll end</Label>
                <Input
                  id="re"
                  value={rollEnd}
                  onChange={(e) => setRollEnd(e.target.value)}
                  inputMode="numeric"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="src">Source archive</Label>
              <Input
                id="src"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              Will crawl{" "}
              <span className="font-mono font-semibold text-foreground">
                {Math.max(0, (Number(rollEnd) || 0) - (Number(rollStart) || 0) + 1)}
              </span>{" "}
              rolls with 8-way concurrency (~120ms politeness delay).
            </div>

            <Button
              className="w-full gap-2"
              onClick={onSubmit}
              disabled={startMut.isPending}
            >
              {startMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {startMut.isPending ? "Starting..." : "Start Hunt"}
            </Button>
          </CardContent>
        </Card>

        {/* Right: jobs list + detail */}
        <div className="flex flex-col gap-5">
          {/* Jobs list */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" />
                Crawl jobs
                {hasRunning ? (
                  <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    Live
                  </Badge>
                ) : null}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="gap-1.5 text-muted-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {jobs && jobs.length > 0 ? (
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
                      <TableRow>
                        <TableHead>Publication</TableHead>
                        <TableHead className="text-center">Range</TableHead>
                        <TableHead className="text-center">Progress</TableHead>
                        <TableHead className="text-center">Found</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((j) => {
                        const pct = j.total ? Math.round((j.processed / j.total) * 100) : 0;
                        return (
                          <TableRow
                            key={j.id}
                            className={`cursor-pointer ${selectedJob === j.id ? "bg-accent" : ""}`}
                            onClick={() => setSelectedJob(j.id)}
                          >
                            <TableCell className="min-w-0">
                              <p className="truncate text-xs font-medium">
                                {j.curriculum}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {j.semester} Sem • {j.examYear}
                              </p>
                            </TableCell>
                            <TableCell className="text-center font-mono text-[11px] text-muted-foreground">
                              {j.rollStart}-{j.rollEnd}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center gap-1">
                                <Progress value={pct} className="h-1.5 w-16" />
                                <span className="text-[11px] text-muted-foreground">
                                  {pct}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {j.found}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                /{j.processed}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="secondary"
                                className={`text-[10px] ${STATUS_TONE[j.status]}`}
                              >
                                {j.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {(j.status === "running" || j.status === "queued") ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-amber-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    stopMut.mutate(j.id);
                                  }}
                                  aria-label="Stop"
                                >
                                  <Square className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-rose-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearMut.mutate(j.id);
                                  }}
                                  aria-label="Clear"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No crawl jobs yet. Configure a hunt on the left and click{" "}
                  <span className="font-semibold text-foreground">Start Hunt</span>.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected job detail */}
          {detail ? (
            <div className="grid gap-5 md:grid-cols-2">
              {/* Live stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4 text-primary" />
                    Live progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {detail.processed} / {detail.total} rolls
                      </span>
                      <span className="font-semibold">
                        {detail.total ? Math.round((detail.processed / detail.total) * 100) : 0}%
                      </span>
                    </div>
                    <Progress
                      value={detail.total ? (detail.processed / detail.total) * 100 : 0}
                      className="mt-2 h-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat
                      icon={CheckCircle2}
                      label="Found"
                      value={String(detail.found)}
                      tone="emerald"
                    />
                    <Stat
                      icon={XCircle}
                      label="Not found"
                      value={String(detail.notFound)}
                      tone="muted"
                    />
                    <Stat
                      icon={Zap}
                      label="Throughput"
                      value={`${detail.throughput}/s`}
                      tone="teal"
                    />
                    <Stat
                      icon={Clock}
                      label="ETA"
                      value={formatDuration(detail.etaSeconds)}
                      tone="amber"
                    />
                  </div>
                  {detail.status === "running" ? (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Crawling rolls {detail.rollStart}–{detail.rollEnd} from{" "}
                      <span className="font-mono text-xs">{detail.source}</span>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      Job <span className="font-semibold">{detail.status}</span> at{" "}
                      {detail.finishedAt ? formatTime(detail.finishedAt) : "—"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live log */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="h-4 w-4 text-primary" />
                    Crawl log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-56 space-y-1 overflow-y-auto scrollbar-thin rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
                    {detail.log.length === 0 ? (
                      <p className="text-zinc-500">Waiting for first fetch...</p>
                    ) : (
                      detail.log
                        .slice()
                        .reverse()
                        .map((l, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="shrink-0 text-zinc-500">
                              {formatTime(l.t)}
                            </span>
                            <span className="shrink-0 text-zinc-400">{l.roll}</span>
                            {l.status === "found" ? (
                              <span className="text-emerald-400">
                                ✓ found — GPA {l.gpa?.toFixed(2)} ({l.grade})
                              </span>
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

              {/* Found results preview */}
              {detail.results.length > 0 ? (
                <Card className="md:col-span-2">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">
                      Hunted results ({detail.results.length})
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("individual")}
                      className="gap-1.5"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Search in Individual
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-72 overflow-y-auto scrollbar-thin">
                      <Table>
                        <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
                          <TableRow>
                            <TableHead>Roll</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Institute</TableHead>
                            <TableHead className="text-center">GPA</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detail.results.slice(0, 100).map((r) => (
                            <TableRow key={r.roll}>
                              <TableCell className="font-mono text-xs">{r.roll}</TableCell>
                              <TableCell className="font-medium">{r.name}</TableCell>
                              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                {r.instituteName}
                              </TableCell>
                              <TableCell className={`text-center font-mono font-semibold ${gpaColor(r.gpa)}`}>
                                {r.gpa.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center">
                                <GradeBadge grade={r.letterGrade} size="sm" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Radar className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-semibold">No job selected</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Start a hunt, then click a job in the list above to see live
                    progress, the crawl log, and hunted results.
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
