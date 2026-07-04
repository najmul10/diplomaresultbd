"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudentResult } from "@/lib/types";
import { toast } from "sonner";

type GroupResponse = {
  results: StudentResult[];
  missing: string[];
  totalRequested: number;
  totalFound: number;
};

async function fetchGroup(rolls: string[]): Promise<GroupResponse> {
  const res = await fetch("/api/results/group", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rolls }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch group results");
  }
  return json.data as GroupResponse;
}

export function GroupView() {
  const [rollsText, setRollsText] = React.useState("");
  const [singleRoll, setSingleRoll] = React.useState("");
  const [rolls, setRolls] = React.useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: fetchGroup,
    onSuccess: () => toast.success("Group results loaded"),
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
    const merged = Array.from(new Set([...rolls, ...parsed]));
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
    mutation.mutate(rolls);
  };

  const avgGpa = data && data.results.length > 0
    ? data.results.filter(r => r.result === "PASSED").reduce((a, b) => a + b.gpa, 0) /
      Math.max(1, data.results.filter((r) => r.result === "PASSED").length)
    : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Group Results"
        description="Check multiple students' results together. Add roll numbers, then fetch all at once."
        icon={Users}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: input panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold">Add roll numbers</h3>
              <div className="mt-3 flex gap-2">
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
                />
                <Button type="button" onClick={addRoll} size="icon" aria-label="Add roll">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-muted-foreground">
                  Or paste many (comma / space / newline separated)
                </label>
                <Textarea
                  value={rollsText}
                  onChange={(e) => setRollsText(e.target.value)}
                  placeholder={"100156\n100203, 100318\n100477"}
                  className="mt-1.5 min-h-24 font-mono text-sm"
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
              <div className="mt-3 max-h-52 space-y-1.5 overflow-y-auto scrollbar-thin">
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
                Check {rolls.length > 0 ? `${rolls.length} ` : ""}Results
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: results */}
        <div className="flex flex-col gap-4">
          {data ? (
            <>
              {/* Summary */}
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
                      {data.missing.length} roll(s) not found:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {data.missing.map((r) => (
                        <Badge key={r} variant="outline" className="font-mono">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <div className="grid gap-4 xl:grid-cols-2">
                {data.results.map((r) => (
                  <ResultCard key={r.roll} result={r} />
                ))}
              </div>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UsersRound className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-semibold">No group results yet</p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Add roll numbers on the left, then click{" "}
                    <span className="font-semibold">Check Results</span> to view them
                    all together.
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
        <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">
          {label}
        </p>
        <p className="text-lg font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}
