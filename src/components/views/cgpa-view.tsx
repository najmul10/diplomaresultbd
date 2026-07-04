"use client";

import * as React from "react";
import {
  Calculator,
  Plus,
  Trash2,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { gpaColor } from "@/lib/grade";
import { toast } from "sonner";

const GRADE_POINTS: { letter: string; point: number }[] = [
  { letter: "A+", point: 4.0 },
  { letter: "A", point: 3.5 },
  { letter: "A-", point: 3.0 },
  { letter: "B", point: 2.5 },
  { letter: "C", point: 2.0 },
  { letter: "D", point: 1.0 },
  { letter: "F", point: 0.0 },
];

type Subject = { id: string; name: string; credit: number; letter: string };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ---------------- Semester GPA Calculator ---------------- */
function SemesterGpaCalculator() {
  const [subjects, setSubjects] = React.useState<Subject[]>([
    { id: uid(), name: "Mathematics I", credit: 4, letter: "A+" },
    { id: uid(), name: "Physics I", credit: 3, letter: "A" },
    { id: uid(), name: "English I", credit: 3, letter: "A-" },
  ]);

  const totalCredit = subjects.reduce((a, b) => a + b.credit, 0);
  const weighted = subjects.reduce((a, b) => {
    const p = GRADE_POINTS.find((g) => g.letter === b.letter)?.point ?? 0;
    return a + p * b.credit;
  }, 0);
  const gpa = totalCredit > 0 ? weighted / totalCredit : 0;
  const hasFail = subjects.some((s) => s.letter === "F");
  const finalGpa = hasFail ? 0 : gpa;

  const addSubject = () =>
    setSubjects((s) => [...s, { id: uid(), name: "", credit: 3, letter: "A" }]);
  const removeSubject = (id: string) =>
    setSubjects((s) => s.filter((x) => x.id !== id));
  const update = (id: string, patch: Partial<Subject>) =>
    setSubjects((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Subjects this semester</CardTitle>
          <Button size="sm" variant="outline" onClick={addSubject} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {subjects.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No subjects added. Click &quot;Add Subject&quot; to begin.
            </p>
          ) : (
            subjects.map((s, i) => {
              const p = GRADE_POINTS.find((g) => g.letter === s.letter)?.point ?? 0;
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-12 items-center gap-2 rounded-lg bg-muted/40 p-2"
                >
                  <div className="col-span-12 flex items-center gap-2 sm:col-span-6">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <Input
                      value={s.name}
                      onChange={(e) => update(s.id, { name: e.target.value })}
                      placeholder="Subject name"
                      className="h-9 bg-background"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Select
                      value={String(s.credit)}
                      onValueChange={(v) => update(s.id, { credit: Number(v) })}
                    >
                      <SelectTrigger className="h-9 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((c) => (
                          <SelectItem key={c} value={String(c)}>
                            {c} cr
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    <Select
                      value={s.letter}
                      onValueChange={(v) => update(s.id, { letter: v })}
                    >
                      <SelectTrigger className="h-9 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_POINTS.map((g) => (
                          <SelectItem key={g.letter} value={g.letter}>
                            {g.letter} ({g.point.toFixed(1)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-rose-500"
                      onClick={() => removeSubject(s.id)}
                      aria-label="Remove subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="col-span-12 -mt-1 pl-8 text-xs text-muted-foreground sm:hidden">
                    Point: <span className="font-mono">{p.toFixed(2)}</span>
                  </p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Result panel */}
      <Card className="h-fit bg-gradient-to-br from-primary/10 via-transparent to-amber-400/5">
        <CardContent className="p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Semester GPA
          </p>
          <p className={`mt-2 text-6xl font-extrabold tracking-tight ${gpaColor(finalGpa)}`}>
            {finalGpa.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFail
              ? "GPA is 0.00 due to a failing grade (F)"
              : `Based on ${subjects.length} subjects • ${totalCredit} credits`}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-lg bg-background/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Credits
              </p>
              <p className="text-lg font-bold">{totalCredit}</p>
            </div>
            <div className="rounded-lg bg-background/60 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Weighted Pts
              </p>
              <p className="text-lg font-bold">{weighted.toFixed(1)}</p>
            </div>
          </div>
          {hasFail ? (
            <Badge variant="destructive" className="mt-4">
              Contains F grade
            </Badge>
          ) : finalGpa >= 3.5 ? (
            <Badge className="mt-4 gap-1 bg-emerald-600 hover:bg-emerald-600">
              <Award className="h-3.5 w-3.5" />
              Excellent
            </Badge>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- CGPA Calculator + Target Planner ---------------- */
type Semester = { id: string; label: string; gpa: number; credits: number };

function CgpaCalculator() {
  const [semesters, setSemesters] = React.useState<Semester[]>([
    { id: uid(), label: "1st Semester", gpa: 3.75, credits: 22 },
    { id: uid(), label: "2nd Semester", gpa: 3.9, credits: 24 },
    { id: uid(), label: "3rd Semester", gpa: 3.6, credits: 23 },
  ]);

  const [targetCgpa, setTargetCgpa] = React.useState(3.75);
  const [remainingCredits, setRemainingCredits] = React.useState(40);

  const totalCredits = semesters.reduce((a, b) => a + b.credits, 0);
  const totalWeighted = semesters.reduce((a, b) => a + b.gpa * b.credits, 0);
  const cgpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;

  const addSem = () =>
    setSemesters((s) => [
      ...s,
      { id: uid(), label: `${s.length + 1}th Semester`, gpa: 3.5, credits: 20 },
    ]);
  const removeSem = (id: string) =>
    setSemesters((s) => s.filter((x) => x.id !== id));
  const update = (id: string, patch: Partial<Semester>) =>
    setSemesters((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  // Target planner
  const neededWeighted = targetCgpa * (totalCredits + remainingCredits);
  const remainingWeightedNeeded = neededWeighted - totalWeighted;
  const requiredGpa = remainingCredits > 0 ? remainingWeightedNeeded / remainingCredits : 0;
  const achievable = requiredGpa <= 4.0 && requiredGpa >= 0;

  const reset = () => {
    setSemesters([]);
    toast.success("CGPA tracker reset");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Completed Semesters</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={reset} className="gap-1.5 text-muted-foreground">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" variant="outline" onClick={addSem} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Semester
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {semesters.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Add completed semesters to compute your CGPA.
            </p>
          ) : (
            semesters.map((sem, i) => (
              <div
                key={sem.id}
                className="grid grid-cols-12 items-center gap-2 rounded-lg bg-muted/40 p-2"
              >
                <div className="col-span-12 flex items-center gap-2 sm:col-span-5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <Input
                    value={sem.label}
                    onChange={(e) => update(sem.id, { label: e.target.value })}
                    className="h-9 bg-background"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={sem.gpa}
                      onChange={(e) => update(sem.id, { gpa: Number(e.target.value) })}
                      className="h-9 bg-background pr-9"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      GPA
                    </span>
                  </div>
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      value={sem.credits}
                      onChange={(e) => update(sem.id, { credits: Number(e.target.value) })}
                      className="h-9 bg-background pr-9"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      cr
                    </span>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-rose-500"
                    onClick={() => removeSem(sem.id)}
                    aria-label="Remove semester"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5">
        <Card className="bg-gradient-to-br from-primary/10 via-transparent to-teal-400/5">
          <CardContent className="p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current CGPA
            </p>
            <p className={`mt-2 text-6xl font-extrabold tracking-tight ${gpaColor(cgpa)}`}>
              {cgpa.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {semesters.length} semester(s) • {totalCredits} credits
            </p>
          </CardContent>
        </Card>

        {/* Target planner */}
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-amber-500" />
              Target Planner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Target CGPA
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={targetCgpa}
                onChange={(e) => setTargetCgpa(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Remaining Credits
              </label>
              <Input
                type="number"
                min="0"
                value={remainingCredits}
                onChange={(e) => setRemainingCredits(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Required GPA in remaining credits
              </p>
              <p
                className={`mt-1 text-4xl font-extrabold ${
                  achievable ? gpaColor(requiredGpa) : "text-rose-500"
                }`}
              >
                {achievable ? requiredGpa.toFixed(2) : "N/A"}
              </p>
              {!achievable ? (
                <p className="mt-1 text-xs text-rose-500">
                  Target is not achievable (max GPA is 4.00)
                </p>
              ) : requiredGpa >= 3.5 ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Challenging but doable — push hard!
                </p>
              ) : (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Very achievable — keep it up!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CgpaView({ gpaOnly = false }: { gpaOnly?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title={gpaOnly ? "GPA Calculator" : "CGPA Calculator"}
        description={
          gpaOnly
            ? "Calculate your semester GPA instantly by entering your subjects and grades."
            : "Calculate your CGPA, track your progress across semesters, and plan your academic targets."
        }
        icon={Calculator}
      />
      <div className="mt-6">
        {gpaOnly ? (
          <SemesterGpaCalculator />
        ) : (
          <Tabs defaultValue="cgpa" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="cgpa" className="gap-1.5">
                <Award className="h-4 w-4" />
                CGPA Tracker
              </TabsTrigger>
              <TabsTrigger value="gpa" className="gap-1.5">
                <Calculator className="h-4 w-4" />
                Semester GPA
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cgpa" className="mt-5">
              <CgpaCalculator />
            </TabsContent>
            <TabsContent value="gpa" className="mt-5">
              <SemesterGpaCalculator />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
