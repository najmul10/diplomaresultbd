"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  Loader2,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Search,
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
} from "recharts";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeBadge } from "@/components/site/grade-badge";
import { gpaColor } from "@/lib/grade";
import { cn } from "@/lib/utils";

type ExamOption = { code: string; name: string };
type Options = {
  exams: ExamOption[];
  years: string[];
};

async function fetchOptions(): Promise<Options> {
  const res = await fetch("/api/results/live-options");
  const j = await res.json();
  return { exams: j.data.exams, years: j.data.years };
}

type PointResult = {
  roll: string;
  name: string;
  gpa: number;
  letterGrade: string;
  result: string;
  instituteName: string;
  departmentName: string;
};

async function searchByPoint(params: {
  exam: string;
  year: string;
  startRoll: string;
  count: string;
}): Promise<{ results: PointResult[]; total: number; gradeCounts: Record<string, number> }> {
  const sp = new URLSearchParams({
    exam: params.exam,
    year: params.year,
    count: params.count,
    start: params.startRoll,
  });
  const res = await fetch(`/api/results/live-analytics?${sp.toString()}`);
  const j = await res.json();
  if (!j.success) throw new Error(j.error);
  const data = j.data;
  const results: PointResult[] = (data.latest || []).map((r: any) => ({
    roll: r.roll,
    name: r.name || "—",
    gpa: r.gpa,
    letterGrade: r.letterGrade,
    result: r.result,
    instituteName: r.instituteName || "",
    departmentName: r.departmentName || "",
  }));
  const gradeCounts: Record<string, number> = data.gradeDistribution || {};
  return { results, total: data.found, gradeCounts };
}

const GRADE_COLORS: Record<string, string> = {
  "A+": "#10b981",
  A: "#22c55e",
  "A-": "#14b8a6",
  B: "#f59e0b",
  C: "#f97316",
  D: "#f43f5e",
  F: "#ef4444",
  REF: "#ef4444",
};

export function PointView() {
  const { data: options } = useQuery({
    queryKey: ["live-options"],
    queryFn: fetchOptions,
  });

  const [exam, setExam] = React.useState("15");
  const [year, setYear] = React.useState("2023");
  const [startRoll, setStartRoll] = React.useState("100001");
  const [count, setCount] = React.useState("30");
  const [trigger, setTrigger] = React.useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["point-search", exam, year, startRoll, count, trigger],
    queryFn: () => searchByPoint({ exam, year, startRoll, count }),
    enabled: trigger > 0,
  });

  const gradeData = React.useMemo(() => {
    if (!data) return [];
    return ["A+", "A", "A-", "B", "C", "D", "F", "REF"]
      .map((g) => ({ grade: g, count: data.gradeCounts[g] || 0 }))
      .filter((d) => d.count > 0);
  }, [data]);

  const filteredResults = data?.results || [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Point Results"
        description="Find students by GPA and grade point. Browse results by grade distribution."
        icon={Filter}
        badge="New"
      />

      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold text-primary">Search by grade point</p>
            <p className="mt-0.5 text-muted-foreground">
              Select exam type, year and a roll range. We&apos;ll find all results
              in that range and show them grouped by GPA and grade.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <Label className="text-xs">Start Roll</Label>
              <Input
                value={startRoll}
                onChange={(e) => setStartRoll(e.target.value)}
                className="h-10 font-mono"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">How many rolls?</Label>
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
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isLoading ? "Searching..." : "Find by Point"}
          </Button>
        </CardContent>
      </Card>

      {error ? (
        <Card className="mt-6 border-rose-500/30">
          <CardContent className="py-10 text-center text-sm text-rose-600 dark:text-rose-400">
            {error instanceof Error ? error.message : "Search failed. Try a different range."}
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Processing {count} rolls...</p>
          </CardContent>
        </Card>
      ) : data ? (
        <>
          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Users} label="Total Found" value={String(data.total)} />
            <StatCard icon={Award} label="A+ Students" value={String(data.gradeCounts["A+"] || 0)} tone="emerald" />
            <StatCard icon={TrendingUp} label="Passed" value={String(Object.entries(data.gradeCounts).filter(([g]) => g !== "F" && g !== "REF").reduce((a, [, v]) => a + v, 0))} tone="teal" />
            <StatCard icon={BarChart3} label="Grades" value={String(gradeData.length)} tone="amber" />
          </div>

          {/* Grade chart */}
          {gradeData.length > 0 ? (
            <Card className="mt-5">
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
                          <Cell key={d.grade} fill={GRADE_COLORS[d.grade] || "#2A3990"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Results table */}
          {filteredResults.length > 0 ? (
            <Card className="mt-5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  Students Found ({filteredResults.length})
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
                        {filteredResults.map((r) => (
                          <tr key={r.roll} className="border-b last:border-0">
                            <td className="px-3 py-2 font-mono text-xs">{r.roll}</td>
                            <td className="px-3 py-2 font-medium">{r.name}</td>
                            <td className="hidden px-3 py-2 text-xs text-muted-foreground sm:table-cell">{r.instituteName || "—"}</td>
                            <td className={cn("px-3 py-2 text-center font-mono font-semibold", gpaColor(r.gpa))}>
                              {r.result === "REFERRED" ? "REF" : r.gpa.toFixed(2)}
                            </td>
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
          ) : (
            <Card className="mt-5 border-dashed">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No results found in the selected range. Try a different roll range or year.
              </CardContent>
            </Card>
          )}
        </>
      ) : !error ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Filter className="h-7 w-7" />
            </span>
            <div>
              <p className="font-semibold">Find students by grade point</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Select exam type, year and roll range above, then click{" "}
                <span className="font-semibold">Find by Point</span> to see results grouped by GPA.
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
  tone?: "muted" | "emerald" | "teal" | "amber";
}) {
  const toneCls = {
    muted: "bg-muted/50",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
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
