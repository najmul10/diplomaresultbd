"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GradeBadge } from "@/components/site/grade-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarDays,
  TrendingUp,
  Award,
  Star,
  StarOff,
  Share2,
  Download,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import type { StudentHistory } from "@/lib/types";
import { formatDate, ordinal, gpaColor } from "@/lib/grade";
import { useFavorites } from "@/store/use-favorites";
import { cn } from "@/lib/utils";

export function HistoryTimeline({ history }: { history: StudentHistory }) {
  const { student, results, cgpa } = history;
  const [expandedSem, setExpandedSem] = React.useState<number | null>(
    results.length > 0 ? results[results.length - 1].semester : null
  );

  return (
    <div className="space-y-5">
      {/* Summary band */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <span className="text-2xl font-bold leading-none">
                  {cgpa.toFixed(2)}
                </span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  CGPA
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight">
                  {student.name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {student.departmentName} • {student.curriculum}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    Roll: <span className="font-mono font-semibold text-foreground">{student.roll}</span>
                  </span>
                  <span>
                    Reg: <span className="font-mono">{student.registrationNo}</span>
                  </span>
                  <span>Batch: {student.batchLabel}</span>
                  <span>Regulation: {student.regulation}</span>
                </div>
              </div>
            </div>
            <HistoryActions history={history} />
          </div>

          {/* Institute + progress */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-background/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Institute
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold">
                {student.instituteName}
              </p>
            </div>
            <div className="rounded-lg bg-background/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Board exam from
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {ordinal(student.boardExamStartSemester)} Semester
              </p>
            </div>
            <div className="rounded-lg bg-background/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Progress
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                {results.length} / {9 - student.boardExamStartSemester} semesters
              </p>
              <Progress
                value={
                  (results.length /
                    Math.max(1, 9 - student.boardExamStartSemester)) *
                  100
                }
                className="mt-1.5 h-1.5"
              />
            </div>
          </div>

          {/* Stat pills */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill
              icon={CheckCircle2}
              label="Passed"
              value={String(history.passedSemesters)}
              tone="emerald"
            />
            <StatPill
              icon={AlertTriangle}
              label="Referred"
              value={String(history.referredSemesters)}
              tone={history.referredSemesters > 0 ? "amber" : "muted"}
            />
            <StatPill
              icon={Clock}
              label="Pending"
              value={String(history.pendingSemesters.length)}
              tone={history.pendingSemesters.length > 0 ? "muted" : "emerald"}
            />
            <StatPill
              icon={Award}
              label="Current CGPA"
              value={cgpa.toFixed(2)}
              tone="teal"
            />
          </div>
        </div>
      </Card>

      {/* Semester timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Academic History — Semester Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Build the full semester list from boardStart..8, marking done vs pending */}
          {Array.from(
            { length: 9 - student.boardExamStartSemester },
            (_, i) => student.boardExamStartSemester + i
          ).map((sem) => {
            const res = results.find((r) => r.semester === sem);
            const isPending = !res;
            const isExpanded = expandedSem === sem;
            if (isPending) {
              return (
                <div
                  key={sem}
                  className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {ordinal(sem)} Semester
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Result not yet published
                    </p>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    Pending
                  </Badge>
                </div>
              );
            }
            const passed = res!.result === "PASSED";
            const referred = res!.result === "REFERRED";
            return (
              <Collapsible
                key={sem}
                open={isExpanded}
                onOpenChange={() => setExpandedSem(isExpanded ? null : sem)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-accent",
                      passed
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : referred
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-rose-500/20 bg-rose-500/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-md text-xs font-bold",
                        passed
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : referred
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                      )}
                    >
                      <span className="text-[9px] uppercase">Sem</span>
                      {sem}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">
                        {ordinal(sem)} Semester
                      </p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {res!.examYear} • Published {formatDate(res!.publicationDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={cn("text-lg font-bold leading-none", gpaColor(res!.gpa))}>
                          {res!.gpa.toFixed(2)}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          GPA
                        </p>
                      </div>
                      <GradeBadge grade={res!.letterGrade} size="md" />
                      <Badge
                        variant={passed ? "default" : referred ? "secondary" : "destructive"}
                        className={cn(
                          "gap-1",
                          passed && "bg-emerald-600 hover:bg-emerald-600",
                          referred && "bg-amber-600 text-white hover:bg-amber-600"
                        )}
                      >
                        {passed ? "Passed" : referred ? "Referred" : "Failed"}
                      </Badge>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 overflow-hidden rounded-lg ring-1 ring-border">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-20">Code</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead className="w-16 text-center">Credit</TableHead>
                          <TableHead className="w-20 text-center">Marks</TableHead>
                          <TableHead className="w-20 text-center">Grade</TableHead>
                          <TableHead className="w-20 text-center">Point</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {res!.subjects.map((s) => (
                          <TableRow
                            key={s.code}
                            className={s.referred ? "bg-rose-500/5" : ""}
                          >
                            <TableCell className="font-mono text-xs">{s.code}</TableCell>
                            <TableCell className="font-medium">
                              {s.name}
                              {s.referred ? (
                                <Badge
                                  variant="destructive"
                                  className="ml-2 h-4 px-1.5 text-[10px]"
                                >
                                  Referred
                                </Badge>
                              ) : null}
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {s.credit}
                            </TableCell>
                            <TableCell className="text-center">{s.marks}</TableCell>
                            <TableCell className="text-center">
                              <GradeBadge grade={s.letter} size="sm" />
                            </TableCell>
                            <TableCell className="text-center font-mono text-sm">
                              {s.point.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {res!.referredSubjects.length > 0 ? (
                    <div className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
                      You must clear{" "}
                      <span className="font-semibold">
                        {res!.referredSubjects.length}
                      </span>{" "}
                      referred subject(s) to receive a GPA for this semester.
                      Contact your institute after clearing them for an updated GPA.
                    </div>
                  ) : null}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function HistoryActions({ history }: { history: StudentHistory }) {
  const favs = useFavorites();
  const isFav = favs.has(history.student.roll);

  const onToggleFav = () => {
    if (isFav) {
      favs.remove(history.student.roll);
      toast.success("Removed from favorites");
    } else {
      favs.add({
        roll: history.student.roll,
        name: history.student.name,
        instituteName: history.student.instituteName,
        departmentName: history.student.departmentName,
        semester: history.results.length
          ? history.results[history.results.length - 1].semester
          : 0,
        gpa: history.cgpa,
        letterGrade: history.results.length
          ? history.results[history.results.length - 1].letterGrade
          : "-",
        result: history.referredSemesters > 0 ? "REFERRED" : "PASSED",
      });
      toast.success("Added to favorites");
    }
  };

  const onShare = async () => {
    const lines = [
      `BTEB Results Zone — Academic History`,
      `${history.student.name} (Roll: ${history.student.roll})`,
      `${history.student.departmentName} • ${history.student.curriculum}`,
      `Batch: ${history.student.batchLabel} • CGPA: ${history.cgpa.toFixed(2)}`,
      ``,
      ...history.results.map(
        (r) =>
          `Sem ${r.semester} (${r.examYear}): GPA ${r.gpa.toFixed(2)} (${r.letterGrade}) — ${r.result}`
      ),
    ];
    try {
      if (navigator.share) {
        await navigator.share({ title: "BTEB Academic History", text: lines.join("\n") });
      } else {
        await navigator.clipboard.writeText(lines.join("\n"));
        toast.success("History copied to clipboard");
      }
    } catch {
      /* cancelled */
    }
  };

  const onDownload = () => {
    const lines = [
      "BTEB RESULTS ZONE — COMPLETE ACADEMIC HISTORY",
      "=".repeat(48),
      `Name            : ${history.student.name}`,
      `Roll            : ${history.student.roll}`,
      `Registration No : ${history.student.registrationNo}`,
      `Institute       : ${history.student.instituteName} (${history.student.instituteCode})`,
      `Department      : ${history.student.departmentName} (${history.student.departmentCode})`,
      `Curriculum      : ${history.student.curriculum}`,
      `Regulation      : ${history.student.regulation}`,
      `Batch           : ${history.student.batchLabel}`,
      `Board Exam From : ${ordinal(history.student.boardExamStartSemester)} Semester`,
      `CGPA            : ${history.cgpa.toFixed(2)}`,
      ``,
      "SEMESTER RESULTS:",
      "-".repeat(48),
      ...history.results.map((r) => {
        const head = `Sem ${r.semester} (${r.examYear}) — GPA ${r.gpa.toFixed(2)} ${r.letterGrade} — ${r.result} — Published ${formatDate(r.publicationDate)}`;
        const subs = r.subjects
          .map(
            (s) =>
              `   ${s.code}  ${s.name}  Marks:${s.marks}  ${s.letter} (${s.point.toFixed(2)})${s.referred ? "  [REFERRED]" : ""}`
          )
          .join("\n");
        return head + "\n" + subs;
      }),
      ``,
      "Powered by BTEB Results Zone",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BTEB_History_${history.student.roll}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("History downloaded");
  };

  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      <Button
        variant={isFav ? "default" : "outline"}
        size="sm"
        onClick={onToggleFav}
        className="gap-1.5"
      >
        {isFav ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
        {isFav ? "Saved" : "Save"}
      </Button>
      <Button variant="outline" size="sm" onClick={onShare} className="gap-1.5">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={onDownload} className="gap-1.5">
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone = "muted",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "muted" | "emerald" | "amber" | "teal";
}) {
  const toneCls = {
    muted: "bg-muted/40",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  }[tone];
  return (
    <div className={cn("flex items-center gap-2.5 rounded-lg p-2.5", toneCls)}>
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
          {label}
        </p>
        <p className="text-base font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}
