"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Loader2,
  Search,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeBadge } from "@/components/site/grade-badge";
import { ResultCard } from "@/components/site/result-card";
import { useRouter } from "@/store/use-router";
import { ordinal, gpaColor, formatDate } from "@/lib/grade";
import type { Institute, Publication, Department, StudentResult } from "@/lib/types";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Request failed");
  return json.data as T;
}

export function InstituteView() {
  const navigate = useRouter((s) => s.navigate);
  const { data: institutes } = useQuery({
    queryKey: ["institutes-all"],
    queryFn: () => fetchJson<Institute[]>("/api/institutes"),
  });
  const { data: publications } = useQuery({
    queryKey: ["publications"],
    queryFn: () => fetchJson<Publication[]>("/api/publications"),
  });
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchJson<Department[]>("/api/departments"),
  });

  const [query, setQuery] = React.useState("");
  const [selectedInstitute, setSelectedInstitute] = React.useState<string>("");
  const [publicationId, setPublicationId] = React.useState<string>("all");
  const [departmentCode, setDepartmentCode] = React.useState<string>("all");
  const [selectedRoll, setSelectedRoll] = React.useState<string | null>(null);

  const filteredInstitutes = React.useMemo(() => {
    if (!institutes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return institutes;
    return institutes.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q)
    );
  }, [institutes, query]);

  const { data, isLoading } = useQuery({
    queryKey: ["institute-results", selectedInstitute, publicationId, departmentCode],
    queryFn: async () => {
      const params = new URLSearchParams({ instituteCode: selectedInstitute });
      if (publicationId !== "all") params.set("publicationId", publicationId);
      if (departmentCode !== "all") params.set("departmentCode", departmentCode);
      return fetchJson<{
        results: StudentResult[];
        summary: { total: number; passed: number; failed: number; passRate: number; avgGpa: number };
      }>(`/api/results/institute?${params.toString()}`);
    },
    enabled: !!selectedInstitute,
  });

  const selectedResult = data?.results.find((r) => r.roll === selectedRoll) || null;
  const selectedInstObj = institutes?.find((i) => i.code === selectedInstitute);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Institute-wise Results"
        description="View complete results for any institute, filtered by publication and department."
        icon={Building2}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: filters */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Select institute</h3>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search institute / district / code"
                  className="pl-9"
                />
              </div>
              <div className="mt-3 max-h-72 space-y-1 overflow-y-auto scrollbar-thin">
                {filteredInstitutes.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No institutes found
                  </p>
                ) : (
                  filteredInstitutes.map((inst) => (
                    <button
                      key={inst.code}
                      onClick={() => {
                        setSelectedInstitute(inst.code);
                        setSelectedRoll(null);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedInstitute === inst.code
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate">{inst.name}</span>
                      <span
                        className={`shrink-0 font-mono text-xs ${
                          selectedInstitute === inst.code
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {inst.code}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Publication
                </label>
                <Select value={publicationId} onValueChange={setPublicationId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="All publications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All publications</SelectItem>
                    {publications?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {ordinal(p.semester)} Sem • {p.examYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Department
                </label>
                <Select value={departmentCode} onValueChange={setDepartmentCode}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments?.map((d) => (
                      <SelectItem key={d.code} value={d.code}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: results */}
        <div className="flex flex-col gap-4">
          {!selectedInstitute ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-semibold">Select an institute</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Choose an institute from the list to view its results.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-2 py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading results...</span>
              </CardContent>
            </Card>
          ) : data ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{selectedInstObj?.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedInstObj?.district} • {selectedInstObj?.type} • Code{" "}
                    <span className="font-mono">{selectedInstObj?.code}</span>
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {data.summary.total} students
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={Users} label="Total" value={String(data.summary.total)} />
                <Stat icon={CheckCircle2} label="Passed" value={String(data.summary.passed)} tone="emerald" />
                <Stat icon={XCircle} label="Failed" value={String(data.summary.failed)} tone="rose" />
                <Stat icon={TrendingUp} label="Pass Rate" value={`${data.summary.passRate}%`} tone="teal" />
              </div>

              {data.results.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    No results match the selected filters.
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <div className="overflow-hidden rounded-lg ring-1 ring-border">
                    <div className="max-h-[28rem] overflow-y-auto scrollbar-thin">
                      <Table>
                        <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
                          <TableRow>
                            <TableHead>Roll</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Dept</TableHead>
                            <TableHead className="hidden sm:table-cell">Sem</TableHead>
                            <TableHead className="text-center">GPA</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead className="text-center">Result</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.results.map((r) => (
                            <TableRow
                              key={r.roll}
                              className="cursor-pointer"
                              onClick={() => setSelectedRoll(r.roll)}
                            >
                              <TableCell className="font-mono text-xs">{r.roll}</TableCell>
                              <TableCell className="font-medium">{r.name}</TableCell>
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
                              <TableCell className="text-center">
                                <Badge
                                  variant={r.result === "PASSED" ? "default" : "destructive"}
                                  className={
                                    r.result === "PASSED"
                                      ? "bg-emerald-600 hover:bg-emerald-600"
                                      : ""
                                  }
                                >
                                  {r.result === "PASSED" ? "Pass" : "Fail"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRoll(r.roll);
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <CardContent className="p-3 text-xs text-muted-foreground">
                    Published on {formatDate(data.results[0]?.publicationDate || "")} • Click a row for details
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Detail modal-like inline card */}
      {selectedResult ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" />
              Detailed result — {selectedResult.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRoll(null)}
            >
              Close
            </Button>
          </div>
          <ResultCard result={selectedResult} />
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => navigate("individual")}>
              Search another roll
            </Button>
          </div>
        </div>
      ) : null}
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
  tone?: "muted" | "emerald" | "rose" | "teal";
}) {
  const toneCls = {
    muted: "bg-muted/50",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  }[tone];
  return (
    <div className={`rounded-xl p-3 ${toneCls}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
