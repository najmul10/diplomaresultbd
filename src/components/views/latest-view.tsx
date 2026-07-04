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
  Building2,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ordinal, gpaColor, formatDate } from "@/lib/grade";
import type { Publication, StudentResult } from "@/lib/types";

type Analytics = {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  avgGpa: number;
  gradeDistribution: Record<string, number>;
  departmentDistribution: Array<{
    code: string;
    name: string;
    count: number;
    passed: number;
    passRate: number;
  }>;
  instituteTop: Array<{
    code: string;
    name: string;
    count: number;
    passed: number;
    passRate: number;
  }>;
};

type LatestResponse = {
  latest: StudentResult[];
  publications: Publication[];
  analytics: Analytics;
};

async function fetchLatest(publicationId: string): Promise<LatestResponse> {
  const url = publicationId
    ? `/api/results/latest?publicationId=${encodeURIComponent(publicationId)}`
    : "/api/results/latest";
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Failed");
  return json.data as LatestResponse;
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

const DEPT_COLORS = ["#10b981", "#14b8a6", "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444", "#84cc16"];

export function LatestView() {
  const [publicationId, setPublicationId] = React.useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["latest", publicationId],
    queryFn: () => fetchLatest(publicationId === "all" ? "" : publicationId),
  });

  const analytics = data?.analytics;
  const publications = data?.publications;

  const gradeData = React.useMemo(() => {
    if (!analytics) return [];
    return ["A+", "A", "A-", "B", "C", "D", "F"]
      .map((g) => ({ grade: g, count: analytics.gradeDistribution[g] || 0 }))
      .filter((d) => d.count > 0);
  }, [analytics]);

  const deptData = React.useMemo(() => {
    if (!analytics) return [];
    return [...analytics.departmentDistribution]
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [analytics]);

  const instData = React.useMemo(() => {
    if (!analytics) return [];
    return analytics.instituteTop.slice(0, 8);
  }, [analytics]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Latest Results & Analytics"
        description="Stay updated with the latest BTEB results and comprehensive statistical analysis."
        icon={BarChart3}
      />

      {/* Filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Publication:</span>
        <Select value={publicationId} onValueChange={setPublicationId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="All publications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All publications (combined)</SelectItem>
            {publications?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {ordinal(p.semester)} Sem • {p.examYear} • {formatDate(p.publicationDate)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {publications ? (
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3.5 w-3.5" />
            {publications.length} publications
          </Badge>
        ) : null}
      </div>

      {isLoading || !analytics ? (
        <Card className="mt-6">
          <CardContent className="flex items-center justify-center gap-2 py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Crunching the numbers...</span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard icon={Users} label="Total Students" value={String(analytics.total)} />
            <StatCard icon={CheckCircle2} label="Passed" value={String(analytics.passed)} tone="emerald" />
            <StatCard icon={XCircle} label="Failed" value={String(analytics.failed)} tone="rose" />
            <StatCard icon={TrendingUp} label="Pass Rate" value={`${analytics.passRate}%`} tone="teal" />
            <StatCard icon={Award} label="Avg GPA" value={analytics.avgGpa.toFixed(2)} tone="amber" />
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
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
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
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
                          { name: "Passed", value: analytics.passed, fill: "#10b981" },
                          { name: "Failed", value: analytics.failed, fill: "#ef4444" },
                        ]}
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
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Top Institutes by Pass Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={instData}
                      layout="vertical"
                      margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                      <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        width={150}
                        tickFormatter={(v: string) => (v.length > 22 ? v.slice(0, 22) + "…" : v)}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--muted)" }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                        formatter={(value: number, _name, props) => [
                          `${value} passed (${props.payload.passRate}%)`,
                          props.payload.name,
                        ]}
                      />
                      <Bar dataKey="passed" radius={[0, 6, 6, 0]} fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Department-wise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis
                        dataKey="code"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                      <Tooltip
                        cursor={{ fill: "var(--muted)" }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                        formatter={(value: number, _name, props) => [
                          `${value} students (${props.payload.passRate}% pass)`,
                          props.payload.name,
                        ]}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {deptData.map((_, i) => (
                          <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Latest results table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-primary" />
                Latest Published Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
                      <TableRow>
                        <TableHead>Roll</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Institute</TableHead>
                        <TableHead className="hidden md:table-cell">Dept</TableHead>
                        <TableHead className="hidden sm:table-cell">Sem</TableHead>
                        <TableHead className="text-center">GPA</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.latest.map((r) => (
                        <TableRow key={r.roll}>
                          <TableCell className="font-mono text-xs">{r.roll}</TableCell>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                            {r.instituteName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {r.departmentCode}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                            {ordinal(r.semester)}
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
              </div>
            </CardContent>
          </Card>
        </>
      )}
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
