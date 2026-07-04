"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Loader2,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Award,
  Radio,
  ExternalLink,
  Database,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { SectionHeading } from "@/components/site/section-heading";
import { AdSlot } from "@/components/site/ad-slot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeBadge } from "@/components/site/grade-badge";
import { gpaColor } from "@/lib/grade";

type ExamOption = { code: string; name: string; totalSemesters?: number };
type SessionPart = { code: string; name: string };
type Options = {
  exams: ExamOption[];
  years: string[];
  sessionParts: SessionPart[];
};

type Analytics = {
  exam: string;
  examName: string;
  year: string;
  sessPart: string | null;
  sampleSize: number;
  rollStart: number;
  totalRequested: number;
  found: number;
  notFound: number;
  passed: number;
  referred: number;
  failed: number;
  passRate: number;
  avgGpa: number;
  gradeDistribution: Record<string, number>;
  latest: Array<{
    roll: string;
    name: string;
    gpa: number;
    letterGrade: string;
    result: string;
    instituteName: string;
  }>;
  source: string;
  note: string;
};

async function fetchOptions(): Promise<Options> {
  const res = await fetch("/api/results/live-options");
  const j = await res.json();
  return j.data;
}

async function fetchAnalytics(params: {
  exam: string;
  year: string;
  sessPart: string;
  start: string;
  count: string;
}): Promise<Analytics> {
  const sp = new URLSearchParams({
    exam: params.exam,
    year: params.year,
    count: params.count,
    start: params.start,
  });
  if (params.sessPart && params.sessPart !== "any") sp.set("sessPart", params.sessPart);
  const res = await fetch(`/api/results/live-analytics?${sp.toString()}`);
  const j = await res.json();
  if (!j.success) throw new Error(j.error);
  return j.data as Analytics;
}

const GRADE_COLORS: Record<string, string> = {
  "A+": "#10b981",
  A: "#22c55e",
  "A-": "#14b8a6",
  B: "#f59e0b",
  C: "#f97316",
  D: "#f43f5e",
  F: "#ef4444",
};

export function LatestView() {
  const { data: options } = useQuery({
    queryKey: ["live-options"],
    queryFn: fetchOptions,
  });

  const [exam, setExam] = React.useState("15");
  const [year, setYear] = React.useState("2022");
  const [sessPart, setSessPart] = React.useState("any");
  const [start, setStart] = React.useState("100001");
  const [count, setCount] = React.useState("40");
  const [trigger, setTrigger] = React.useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["live-analytics", exam, year, sessPart, start, count, trigger],
    queryFn: () => fetchAnalytics({ exam, year, sessPart, start, count }),
    enabled: trigger > 0,
  });

  const gradeData = React.useMemo(() => {
    if (!data) return [];
    return ["A+", "A", "A-", "B", "C", "D", "F"]
      .map((g) => ({ grade: g, count: data.gradeDistribution[g] || 0 }))
      .filter((d) => d.count > 0);
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Latest Results & Analytics"
        description="Live aggregate statistics computed by crawling the official BTEB archive on demand."
        icon={BarChart3}
        badge="Live"
      />

      <Card className="mt-6 border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Radio className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              100% live — no stored data
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Pick an exam type, year and a roll range. We crawl that sample
              live from the official BTEB archive
              (<a href="http://180.211.162.102:8444/result_arch/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300">180.211.162.102:8444/result_arch <ExternalLink className="h-3 w-3" /></a>)
              and compute real pass rates, grade distribution and average GPA
              from whatever results come back. Larger samples = more accurate
              stats but slower.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
            <div className="space-y-1.5">
              <Label className="text-xs">Session Part</Label>
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
            <div className="space-y-1.5">
              <Label className="text-xs">Start roll</Label>
              <Input
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-10 font-mono"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sample size (max 80)</Label>
              <Input
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="h-10 font-mono"
                inputMode="numeric"
              />
            </div>
          </div>
          <Button
            className="mt-4 gap-2"
            onClick={() => setTrigger((t) => t + 1)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            {isLoading ? "Crawling official archive..." : "Run Live Analysis"}
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <Card className="mt-6 border-rose-500/30">
          <CardContent className="py-10 text-center text-sm text-rose-600 dark:text-rose-400">
            {error instanceof Error ? error.message : "Live crawl failed. Try a smaller sample."}
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-sm text-muted-foreground">
              Crawling {count} rolls live from the official BTEB archive...
            </p>
            <p className="text-xs text-muted-foreground">This takes ~{Math.ceil(Number(count) / 6)} seconds</p>
          </CardContent>
        </Card>
      ) : data ? (
        <>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
              <Radio className="h-3.5 w-3.5" /> Live
            </Badge>
            {data.note}
          </div>

          {/* Summary stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard icon={Users} label="Rolls Crawled" value={String(data.totalRequested)} />
            <StatCard icon={CheckCircle2} label="Found" value={String(data.found)} tone="emerald" />
            <StatCard icon={TrendingUp} label="Pass Rate" value={`${data.passRate}%`} tone="teal" />
            <StatCard icon={Award} label="Avg GPA" value={data.avgGpa.toFixed(2)} tone="amber" />
            <StatCard icon={XCircle} label="Not Found" value={String(data.notFound)} tone="muted" />
          </div>

          {/* Charts */}
          {data.found > 0 ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                        <XAxis dataKey="grade" tickLine={false} axisLine={false} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                        <Tooltip
                          cursor={{ fill: "var(--muted)" }}
                          contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)", color: "var(--popover-foreground)", fontSize: 12 }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {gradeData.map((d) => (
                            <Cell key={d.grade} fill={GRADE_COLORS[d.grade] || "#10b981"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Result Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Passed", value: data.passed, fill: "#10b981" },
                            { name: "Referred", value: data.referred, fill: "#f59e0b" },
                            { name: "Failed", value: data.failed, fill: "#ef4444" },
                          ].filter((d) => d.value > 0)}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          labelLine={false}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)", color: "var(--popover-foreground)", fontSize: 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="mt-5 border-dashed">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No results found in the crawled sample. Try a different roll range, year, or session part.
              </CardContent>
            </Card>
          )}

          <AdSlot slot="home-inline" className="mt-6" />

          {/* Latest found table */}
          {data.latest.length > 0 ? (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Sample Results Found
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                        <tr className="border-b">
                          <th className="px-3 py-2 text-left font-medium">Roll</th>
                          <th className="px-3 py-2 text-left font-medium">Name</th>
                          <th className="hidden px-3 py-2 text-left font-medium sm:table-cell">Institute</th>
                          <th className="px-3 py-2 text-center font-medium">GPA</th>
                          <th className="px-3 py-2 text-center font-medium">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.latest.map((r) => (
                          <tr key={r.roll} className="border-b last:border-0">
                            <td className="px-3 py-2 font-mono text-xs">{r.roll}</td>
                            <td className="px-3 py-2 font-medium">{r.name || "—"}</td>
                            <td className="hidden px-3 py-2 text-xs text-muted-foreground sm:table-cell">{r.instituteName || "—"}</td>
                            <td className={`px-3 py-2 text-center font-mono font-semibold ${gpaColor(r.gpa)}`}>{r.gpa.toFixed(2)}</td>
                            <td className="px-3 py-2 text-center">
                              <GradeBadge grade={r.letterGrade} size="sm" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : !error ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Database className="h-7 w-7" />
            </span>
            <div>
              <p className="font-semibold">Run a live analysis</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Select an exam type, year and sample size above, then click{" "}
                <span className="font-semibold">Run Live Analysis</span>. We&apos;ll
                crawl the official BTEB archive and compute real stats.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "muted",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "muted" | "emerald" | "rose" | "teal" | "amber";
}) {
  const toneCls = {
    muted: "bg-muted/50",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  }[tone];
  return (
    <Card>
      <CardContent className={`flex items-center gap-3 p-4 ${toneCls}`}>
        <Icon className="h-5 w-5 opacity-80" />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</p>
          <p className="text-xl font-bold leading-none">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
