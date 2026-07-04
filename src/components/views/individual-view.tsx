"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Loader2,
  SearchX,
  ExternalLink,
  ShieldCheck,
  Radio,
  Database,
  Zap,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ResultCard } from "@/components/site/result-card";
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
import type { StudentResult } from "@/lib/types";
import { toast } from "sonner";

type ExamOption = { code: string; name: string };
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

async function searchLive(params: {
  exam: string;
  year: string;
  roll: string;
  reg?: string;
  sessPart?: string;
}): Promise<StudentResult> {
  const sp = new URLSearchParams();
  sp.set("exam", params.exam);
  sp.set("year", params.year);
  sp.set("roll", params.roll);
  if (params.reg) sp.set("reg", params.reg);
  if (params.sessPart) sp.set("sessPart", params.sessPart);
  const res = await fetch(`/api/results/live-search?${sp.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Search failed");
  }
  return json.data as StudentResult;
}

export function IndividualView() {
  const [exam, setExam] = React.useState<string>("15"); // Diploma in Engineering default
  const [year, setYear] = React.useState<string>("2022");
  const [roll, setRoll] = React.useState("");
  const [reg, setReg] = React.useState("");
  const [sessPart, setSessPart] = React.useState<string>("any");
  const [submitted, setSubmitted] = React.useState<{
    exam: string;
    year: string;
    roll: string;
    reg?: string;
    sessPart?: string;
  } | null>(null);

  const { data: options } = useQuery({
    queryKey: ["live-options"],
    queryFn: fetchOptions,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["live-result", submitted],
    queryFn: () => searchLive(submitted!),
    enabled: !!submitted,
    retry: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim()) {
      toast.error("Please enter your roll number");
      return;
    }
    if (!exam || !year) {
      toast.error("Please select exam type and year");
      return;
    }
    setSubmitted({
      exam,
      year,
      roll: roll.trim(),
      reg: reg.trim() || undefined,
      sessPart: sessPart && sessPart !== "any" ? sessPart : undefined,
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Individual Results"
        description="Search your real BTEB result live from the official Bangladesh Technical Education Board archive."
        icon={Search}
        badge="Live"
      />

      {/* Live source banner */}
      <Card className="mt-6 border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Radio className="h-5 w-5" />
          </span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              Connected to the official BTEB archive
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Results are fetched in real time from the Bangladesh Technical
              Education Board&apos;s public archive. Enter your exact exam type,
              year, roll and registration to see your real result. No demo data —
              this is the live government source.
            </p>
            <a
              href="http://180.211.162.102:8444/result_arch/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300"
            >
              <ExternalLink className="h-3 w-3" />
              Official source: 180.211.162.102:8444/result_arch
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Search form */}
      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="exam">Exam Type *</Label>
                <Select value={exam} onValueChange={setExam}>
                  <SelectTrigger id="exam" className="h-11">
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
                <Label htmlFor="year">Exam Year *</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year" className="h-11">
                    <SelectValue placeholder="Select year" />
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="roll">Roll No *</Label>
                <Input
                  id="roll"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="e.g. 449381"
                  className="h-11 font-mono"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg">Registration No</Label>
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

            <div className="space-y-1.5">
              <Label htmlFor="sess">Session Part (optional)</Label>
              <Select value={sessPart} onValueChange={setSessPart}>
                <SelectTrigger id="sess" className="h-11">
                  <SelectValue placeholder="Any / All" />
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
              {isLoading ? "Searching official archive..." : "Check Live Result"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result area */}
      <div className="mt-6">
        {/* Ad slot above results */}
        <AdSlot slot="individual-inline" className="mb-6" />

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-sm text-muted-foreground">
                Fetching from official BTEB archive...
              </p>
              <p className="text-xs text-muted-foreground">
                Roll <span className="font-mono font-semibold">{submitted?.roll}</span> • {submitted?.year} • {submitted?.exam}
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
              <div className="mt-2 max-w-md rounded-lg bg-muted/50 p-3 text-left text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Tips:</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  <li>Make sure the exam type matches your curriculum.</li>
                  <li>The exam year should be the year you sat that semester&apos;s board exam.</li>
                  <li>Enter your registration number for a more precise match.</li>
                  <li>Try a session part if the default doesn&apos;t return a result.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : data ? (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Live from official BTEB archive
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                Real-time fetch
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" />
                Cached for repeat searches
              </span>
            </div>
            <ResultCard result={data} />
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
                  Select your exam type, year, and enter your roll number to
                  fetch your real BTEB result from the official government
                  archive.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
