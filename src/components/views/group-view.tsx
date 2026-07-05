"use client";

import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Users,
  Loader2,
  UsersRound,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ResultCard } from "@/components/site/result-card";
import { AdSlot } from "@/components/site/ad-slot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

type ExamOption = { code: string; name: string; totalSemesters?: number };
type SessionPart = { code: string; name: string };
type Options = {
  exams: ExamOption[];
  years: string[];
  sessionParts: SessionPart[];
  live?: boolean;
};

type GroupResponse = {
  results: StudentResult[];
  missing: string[];
  errored: Array<{ roll: string; error: string }>;
  totalRequested: number;
  totalFound: number;
  source: string;
};

async function fetchOptions(): Promise<Options> {
  const res = await fetch("/api/results/live-options");
  const j = await res.json();
  return j.data;
}

async function fetchGroup(payload: {
  exam: string;
  year: string;
  rolls: string;
  sessPart?: string;
}): Promise<GroupResponse> {
  const res = await fetch("/api/results/group", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await res.json();
  if (!j.success) throw new Error(j.error || "Failed");
  return j.data as GroupResponse;
}

export function GroupView() {
  const { data: options } = useQuery({
    queryKey: ["live-options"],
    queryFn: fetchOptions,
  });

  const [exam, setExam] = React.useState("15");
  const [year, setYear] = React.useState("2024");
  const [sessPart, setSessPart] = React.useState("any");
  const [rollsText, setRollsText] = React.useState("");
  const [singleRoll, setSingleRoll] = React.useState("");
  const [rolls, setRolls] = React.useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: fetchGroup,
    onSuccess: () => toast.success("Live group results loaded"),
    onError: (e: Error) => toast.error(e.message),
  });

  const data = mutation.data;

  const addRoll = () => {
    const v = singleRoll.trim();
    if (!v) return;
    if (rolls.includes(v)) {
      toast.error("Roll already added");
      return;
    }
    setRolls((r) => [...r, v]);
    setSingleRoll("");
  };

  const removeRoll = (r: string) => setRolls((cur) => cur.filter((x) => x !== r));

  const importText = () => {
    const parsed = rollsText
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    // expand ranges
    const expanded: string[] = [];
    for (const part of parsed) {
      const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        const start = parseInt(range[1], 10);
        const end = Math.min(parseInt(range[2], 10), start + 60);
        for (let r = start; r <= end; r++) expanded.push(String(r));
      } else {
        expanded.push(part);
      }
    }
    const merged = Array.from(new Set([...rolls, ...expanded])).slice(0, 50);
    setRolls(merged);
    setRollsText("");
    toast.success(`Added ${merged.length - rolls.length} roll(s)`);
  };

  const clearAll = () => {
    setRolls([]);
    mutation.reset();
  };

  const onSubmit = () => {
    if (rolls.length === 0) {
      toast.error("Add at least one roll number");
      return;
    }
    mutation.mutate({
      exam,
      year,
      rolls: rolls.join(", "),
      sessPart: sessPart !== "any" ? sessPart : undefined,
    });
  };

  const passedResults = data?.results?.filter((r) => r.result === "PASSED" && typeof r.gpa === "number") || [];
  const avgGpa =
    passedResults.length > 0
      ? passedResults.reduce((a, b) => a + (b.gpa || 0), 0) / passedResults.length
      : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Group Results"
        description="Compare multiple students' BTEB results side by side."
        icon={Users}
        badge="Live"
      />

      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold text-primary">
              Compare results instantly
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Select the same exam type + year for all rolls, then add roll numbers
              (supports ranges like <span className="font-mono">100001-100010</span>).
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Left: input panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-5">
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
              <div className="mt-3 space-y-1.5">
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

              <div className="mt-4 flex gap-2">
                <Input
                  value={singleRoll}
                  onChange={(e) => setSingleRoll(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRoll();
                    }
                  }}
                  placeholder="Roll number"
                  inputMode="numeric"
                  className="font-mono"
                />
                <Button type="button" onClick={addRoll} size="icon" aria-label="Add roll">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <Label className="text-xs text-muted-foreground">
                  Or paste rolls (comma / space / range, e.g. 100001-100010)
                </Label>
                <Textarea
                  value={rollsText}
                  onChange={(e) => setRollsText(e.target.value)}
                  placeholder={"100001\n100002, 100003\n100010-100015"}
                  className="mt-1.5 min-h-20 font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={importText}
                >
                  Import & merge
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Roll list{" "}
                  <Badge variant="secondary" className="ml-1">{rolls.length}</Badge>
                </h3>
                {rolls.length > 0 ? (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 text-xs text-muted-foreground">
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Clear
                  </Button>
                ) : null}
              </div>
              <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto scrollbar-thin">
                {rolls.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No rolls added yet
                  </p>
                ) : (
                  rolls.map((r) => (
                    <div
                      key={r}
                      className="flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5"
                    >
                      <span className="font-mono text-sm">{r}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-rose-500"
                        onClick={() => removeRoll(r)}
                        aria-label={`Remove ${r}`}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <Button
                className="mt-4 w-full gap-2"
                onClick={onSubmit}
                disabled={mutation.isPending || rolls.length === 0}
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UsersRound className="h-4 w-4" />
                )}
                {mutation.isPending
                  ? "Fetching live..."
                  : `Check ${rolls.length > 0 ? `${rolls.length} ` : ""}Results (Live)`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: results */}
        <div className="flex flex-col gap-4">
          <AdSlot slot="individual-inline" />
          {data ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SummaryPill label="Requested" value={String(data.totalRequested)} icon={Users} />
                <SummaryPill label="Found" value={String(data.totalFound)} icon={CheckCircle2} tone="emerald" />
                <SummaryPill label="Missing" value={String(data.missing.length)} icon={XCircle} tone={data.missing.length ? "rose" : "muted"} />
                <SummaryPill label="Avg GPA" value={avgGpa.toFixed(2)} icon={Users} tone="teal" />
              </div>

              {data.missing.length > 0 ? (
                <Card className="border-amber-500/30">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      {data.missing.length} roll(s) not found. Please verify the roll numbers and exam details:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {data.missing.slice(0, 30).map((r) => (
                        <Badge key={r} variant="outline" className="font-mono">
                          {r}
                        </Badge>
                      ))}
                      {data.missing.length > 30 ? <Badge variant="outline">+{data.missing.length - 30} more</Badge> : null}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {data.results.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    No results found for any of the {data.totalRequested} roll(s). Verify the
                    exam type and year match.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {data.results.map((r) => (
                    <ResultCard key={r.roll} result={r} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <UsersRound className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-semibold">Live group results</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Select exam type + year, add roll numbers on the left, then click{" "}
                    <span className="font-semibold">Check Results</span> to compare
                    all students side by side.
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

function SummaryPill({
  label,
  value,
  icon: Icon,
  tone = "muted",
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone?: "muted" | "emerald" | "rose" | "teal";
}) {
  const toneCls = {
    muted: "bg-muted/50 text-foreground",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  }[tone];
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${toneCls}`}>
      <Icon className="h-5 w-5 opacity-80" />
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">{label}</p>
        <p className="text-lg font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}
