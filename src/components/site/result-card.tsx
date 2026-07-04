"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Share2,
  Star,
  StarOff,
  Download,
  CheckCircle2,
  XCircle,
  Building2,
  Hash,
  IdCard,
  GraduationCap,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import type { StudentResult } from "@/lib/types";
import { GradeBadge } from "@/components/site/grade-badge";
import { formatDate, ordinal, gpaColor } from "@/lib/grade";
import { useFavorites } from "@/store/use-favorites";
import { cn } from "@/lib/utils";

export function ResultCard({ result }: { result: StudentResult }) {
  const favs = useFavorites();
  const isFav = favs.has(result.roll);

  const onToggleFav = () => {
    if (isFav) {
      favs.remove(result.roll);
      toast.success("Removed from favorites");
    } else {
      favs.add({
        roll: result.roll,
        name: result.name,
        instituteName: result.instituteName,
        departmentName: result.departmentName,
        semester: result.semester,
        gpa,
        letterGrade,
        result: result.result,
      });
      toast.success("Added to favorites");
    }
  };

  const onShare = async () => {
    const text = `BTEB Result — ${result.name}\nRoll: ${result.roll}\n${result.departmentName || result.curriculum || "BTEB"}${result.semester ? ", " + ordinal(result.semester) + " Semester" : ""}\nGPA: ${gpa.toFixed(2)} (${letterGrade}) — ${result.result}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "BTEB Result", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Result copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  const onDownload = () => {
    const lines = [
      "BTEB RESULTS ZONE — INDIVIDUAL RESULT",
      "======================================",
      `Name            : ${result.name}`,
      `Roll            : ${result.roll}`,
      `Registration No : ${result.registrationNo}`,
      `Institute       : ${result.instituteName} (${result.instituteCode})`,
      `Department      : ${result.departmentName} (${result.departmentCode})`,
      `Curriculum      : ${result.curriculum || "—"}`,
      `Exam Type       : ${result.examType || "—"}`,
      `Semester        : ${ordinal(result.semester)}`,
      `Exam Year       : ${result.examYear}`,
      `Published On    : ${formatDate(result.publicationDate)}`,
      `GPA             : ${gpa.toFixed(2)}`,
      `Letter Grade    : ${letterGrade}`,
      `CGPA            : ${cgpa.toFixed(2)}`,
      `Result          : ${result.result}`,
      "",
      "Subject Results:",
      "--------------------------------------",
      ...subjects.map(
        (s) =>
          `${s.code || "—"}  ${(s.name || "—").padEnd(38)}  Marks:${String(s.marks ?? "—").padStart(3)}  ${s.letter || "—"} (${typeof s.point === "number" ? s.point.toFixed(2) : "—"})`
      ),
      "",
      "Powered by BTEB Results Zone",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BTEB_Result_${result.roll}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Result downloaded");
  };

  const passed = result.result === "PASSED";
  const referred = result.result === "REFERRED";

  // Defensive: live-parsed results may have missing/undefined numeric fields
  const gpa = typeof result.gpa === "number" ? result.gpa : 0;
  const cgpa = typeof result.cgpa === "number" ? result.cgpa : gpa;
  const subjects = Array.isArray(result.subjects) ? result.subjects : [];
  const letterGrade = result.letterGrade || (gpa >= 4 ? "A+" : gpa >= 3.5 ? "A" : gpa >= 3 ? "A-" : gpa >= 2.5 ? "B" : gpa >= 2 ? "C" : gpa > 0 ? "D" : "F");

  return (
    <Card className="overflow-hidden">
      {/* Header band */}
      <div
        className={cn(
          "relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
          passed
            ? "bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent"
            : referred
              ? "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent"
              : "bg-gradient-to-br from-rose-500/10 via-red-500/5 to-transparent"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center ring-1",
              passed
                ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300"
                : referred
                  ? "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:text-amber-300"
                  : "bg-rose-500/15 text-rose-700 ring-rose-500/30 dark:text-rose-300"
            )}
          >
            <span className="text-2xl font-bold leading-none">
              {gpa.toFixed(2)}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider">
              GPA
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight">{result.name}</h2>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {result.departmentName || result.curriculum || result.instituteName || "BTEB Result"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <GradeBadge grade={letterGrade} size="md" />
              <Badge
                variant={passed ? "default" : referred ? "secondary" : "destructive"}
                className={cn(
                  "gap-1",
                  passed && "bg-emerald-600 hover:bg-emerald-600",
                  referred && "bg-amber-600 text-white hover:bg-amber-600"
                )}
              >
                {passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {result.result}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
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
      </div>

      <CardContent className="p-5 sm:p-6">
        {/* Info grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow icon={Hash} label="Roll Number" value={result.roll} mono />
          <InfoRow icon={IdCard} label="Registration No" value={result.registrationNo} mono />
          <InfoRow icon={GraduationCap} label="Curriculum" value={result.curriculum || result.departmentName} />
          <InfoRow icon={Building2} label="Institute" value={result.instituteName} />
          <InfoRow
            icon={CalendarDays}
            label="Semester / Year"
            value={`${ordinal(result.semester)} Semester • ${result.examYear}`}
          />
          <InfoRow
            icon={CalendarDays}
            label="Published On"
            value={formatDate(result.publicationDate)}
          />
        </div>

        {/* CGPA summary */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryStat label="Semester GPA" value={gpa.toFixed(2)} accent={gpaColor(gpa)} />
          <SummaryStat label="Letter Grade" value={letterGrade} />
          <SummaryStat label="Cumulative CGPA" value={cgpa.toFixed(2)} accent={gpaColor(cgpa)} />
          <SummaryStat label="Subjects" value={String(subjects.length)} />
        </div>

        {/* Subjects table */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Subject-wise Results
          </h3>
          <div className="overflow-hidden rounded-lg ring-1 ring-border">
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
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
                  {subjects.map((s, i) => (
                    <TableRow key={s.code || i}>
                      <TableCell className="font-mono text-xs">{s.code || "—"}</TableCell>
                      <TableCell className="font-medium">{s.name || "—"}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{s.credit || "—"}</TableCell>
                      <TableCell className="text-center">{s.marks ?? "—"}</TableCell>
                      <TableCell className="text-center">
                        <GradeBadge grade={s.letter || "F"} size="sm" />
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">
                        {typeof s.point === "number" ? s.point.toFixed(2) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-muted/40 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={cn("truncate text-sm font-semibold", mono && "font-mono")}>{value}</p>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 text-xl font-bold", accent)}>{value}</p>
    </div>
  );
}
