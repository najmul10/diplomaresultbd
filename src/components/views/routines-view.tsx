"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Loader2,
  Download,
  MapPin,
  Clock,
  CalendarRange,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Routine } from "@/lib/types";
import { formatDate, ordinal } from "@/lib/grade";
import { toast } from "sonner";

async function fetchRoutines(): Promise<Routine[]> {
  const res = await fetch("/api/routines");
  const json = await res.json();
  return json.data as Routine[];
}

export function RoutinesView() {
  const { data: routines, isLoading } = useQuery({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
  });

  const [selectedId, setSelectedId] = React.useState<string>("");
  const current = React.useMemo(() => {
    if (!routines || routines.length === 0) return undefined;
    return routines.find((r) => r.id === selectedId) || routines[0];
  }, [routines, selectedId]);

  React.useEffect(() => {
    if (routines && routines.length > 0 && !selectedId) {
      setSelectedId(routines[0].id);
    }
  }, [routines, selectedId]);

  const onDownload = () => {
    if (!current) return;
    const lines = [
      `Diploma Result BD — Exam Routine`,
      current.title,
      "=".repeat(50),
      `Department: ${current.departmentName} (${current.departmentCode})`,
      `Semester: ${ordinal(current.semester)}`,
      `Exam Year: ${current.examYear}`,
      `Start: ${formatDate(current.startDate)}  •  End: ${formatDate(current.endDate)}`,
      "-".repeat(50),
      ...current.schedule.map(
        (s) => `${s.date} (${s.day})  ${s.time}  ${s.subjectCode} - ${s.subjectName}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Routine_${current.departmentCode}_Sem${current.semester}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Routine downloaded");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Exam Routines"
        description="Access the latest exam routines and schedules for all diploma departments."
        icon={CalendarDays}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Routine:</span>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select a routine" />
          </SelectTrigger>
          <SelectContent>
            {routines?.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {ordinal(r.semester)} Sem • {r.examYear} • {r.departmentName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading || !current ? (
        <Card className="mt-6">
          <CardContent className="flex items-center justify-center gap-2 py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading routines...</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">{current.title}</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {current.departmentName}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <CalendarRange className="h-3.5 w-3.5" />
                  {formatDate(current.startDate)} → {formatDate(current.endDate)}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  10:00 AM - 1:00 PM
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onDownload} className="gap-1.5">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Date</TableHead>
                    <TableHead className="w-28">Day</TableHead>
                    <TableHead className="w-44">Time</TableHead>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {current.schedule.map((s, i) => (
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{formatDate(s.date)}</TableCell>
                      <TableCell className="text-muted-foreground">{s.day}</TableCell>
                      <TableCell className="text-muted-foreground">{s.time}</TableCell>
                      <TableCell className="font-mono text-xs">{s.subjectCode}</TableCell>
                      <TableCell className="font-medium">{s.subjectName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
