"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  SearchX,
  Lightbulb,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { HistoryTimeline } from "@/components/site/history-timeline";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { StudentHistory } from "@/lib/types";
import { toast } from "sonner";

type Options = {
  examTypes: string[];
  curricula: string[];
  years: number[];
  semesters: number[];
};

async function fetchOptions(): Promise<Options> {
  const res = await fetch("/api/results/options");
  const j = await res.json();
  return j.data;
}

async function searchResult(params: {
  roll: string;
  registrationNo?: string;
  examType?: string;
  curriculum?: string;
  semester?: string;
  examYear?: string;
}): Promise<StudentHistory> {
  const sp = new URLSearchParams();
  sp.set("roll", params.roll);
  if (params.registrationNo) sp.set("registrationNo", params.registrationNo);
  if (params.examType) sp.set("examType", params.examType);
  if (params.curriculum) sp.set("curriculum", params.curriculum);
  if (params.semester) sp.set("semester", params.semester);
  if (params.examYear) sp.set("examYear", params.examYear);
  const res = await fetch(`/api/results/search?${sp.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Search failed");
  }
  return json.data as StudentHistory;
}

export function IndividualView() {
  const [roll, setRoll] = React.useState("");
  const [registrationNo, setRegistrationNo] = React.useState("");
  const [examType, setExamType] = React.useState<string>("all");
  const [curriculum, setCurriculum] = React.useState<string>("all");
  const [semester, setSemester] = React.useState<string>("all");
  const [examYear, setExamYear] = React.useState<string>("all");
  const [advanced, setAdvanced] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  const { data: options } = useQuery({
    queryKey: ["result-options"],
    queryFn: fetchOptions,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "result",
      submitted,
      examType,
      curriculum,
      semester,
      examYear,
    ],
    queryFn: () =>
      searchResult({
        roll: submitted!,
        examType: examType === "all" ? undefined : examType,
        curriculum: curriculum === "all" ? undefined : curriculum,
        semester: semester === "all" ? undefined : semester,
        examYear: examYear === "all" ? undefined : examYear,
      }),
    enabled: !!submitted && submitted.length > 0,
    retry: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = roll.trim();
    if (!v && !registrationNo.trim()) {
      toast.error("Please enter a roll number or registration number");
      return;
    }
    setSubmitted(v);
  };

  const trySample = (r: string) => {
    setRoll(r);
    setSubmitted(r);
  };

  const activeFilters =
    (examType !== "all" ? 1 : 0) +
    (curriculum !== "all" ? 1 : 0) +
    (semester !== "all" ? 1 : 0) +
    (examYear !== "all" ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Individual Results"
        description="Find your BTEB result by roll number — same fields as the official BTEB Archive System."
        icon={Search}
        badge="Most Popular"
      />

      {/* Search form */}
      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="roll">Roll No *</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="roll"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    placeholder="e.g. 100156"
                    className="h-11 pl-9 font-mono"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg">Registration No (optional)</Label>
                <Input
                  id="reg"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder="e.g. 202110100567"
                  className="h-11 font-mono"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Advanced filters (official BTEB form fields) */}
            <Collapsible open={advanced} onOpenChange={setAdvanced}>
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 px-2 text-muted-foreground"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Advanced filters
                    {activeFilters > 0 ? (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {activeFilters}
                      </Badge>
                    ) : null}
                  </Button>
                </CollapsibleTrigger>
                <a
                  href="https://result.bteb.gov.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-underline hover:text-primary"
                >
                  <ExternalLink className="h-3 w-3" />
                  Official source
                </a>
              </div>
              <CollapsibleContent className="mt-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Exam Type</Label>
                    <Select value={examType} onValueChange={setExamType}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {options?.examTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Curriculum</Label>
                    <Select value={curriculum} onValueChange={setCurriculum}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {options?.curricula.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Semester</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {options?.semesters.map((s) => (
                          <SelectItem key={s} value={String(s)}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Exam Year</Label>
                    <Select value={examYear} onValueChange={setExamYear}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {options?.years.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                size="lg"
                className="h-11 gap-2 px-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                {isLoading ? "Searching..." : "Check Result"}
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  Try:
                </span>
                {["440001", "449381", "451234", "455678"].map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 font-mono text-xs"
                    onClick={() => trySample(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result area */}
      <div className="mt-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Fetching result for roll{" "}
                <span className="font-mono font-semibold">{submitted}</span>...
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
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Please check your roll number and try again."}
                </p>
              </div>
              {activeFilters > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Tip: relax the advanced filters and retry.
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : data ? (
          <>
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Resolved from BTEB Results Zone mirror of the official archive —
              showing complete academic history ({data.results.length} semester
              result{data.results.length !== 1 ? "s" : ""})
            </div>
            <HistoryTimeline history={data} />
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="h-7 w-7" />
              </span>
              <div>
                <p className="font-semibold">Search for a result</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Enter your roll number above and click{" "}
                  <Badge variant="secondary" className="mx-0.5">
                    Check Result
                  </Badge>{" "}
                  to view your BTEB result.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
