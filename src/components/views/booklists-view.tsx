"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, Search, Download, BookMarked } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import type { Booklist, Department } from "@/lib/types";
import { toast } from "sonner";

async function fetchBooklists(): Promise<Booklist[]> {
  const res = await fetch("/api/booklists");
  const json = await res.json();
  return json.data as Booklist[];
}
async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch("/api/departments");
  const json = await res.json();
  return json.data as Department[];
}

export function BooklistsView() {
  const { data: booklists, isLoading } = useQuery({
    queryKey: ["booklists"],
    queryFn: fetchBooklists,
  });
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const [selectedDept, setSelectedDept] = React.useState<string>("CMT");
  const [search, setSearch] = React.useState("");

  const current = booklists?.find((b) => b.departmentCode === selectedDept);
  const filteredBooks = React.useMemo(() => {
    if (!current) return [];
    const q = search.trim().toLowerCase();
    if (!q) return current.books;
    return current.books.filter(
      (b) => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }, [current, search]);

  const onDownload = () => {
    if (!current) return;
    const lines = [
      `Diploma Result BD — Department Booklist`,
      `Department: ${current.departmentName} (${current.departmentCode})`,
      `Curriculum Year: ${current.curriculumYear}`,
      `Total Books: ${current.totalBooks}`,
      "=".repeat(50),
      ...current.books.map(
        (b) => `${b.code}  ${b.name}  (${b.credit} cr)  ${b.author}  ${b.edition}  ${b.publisher}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Booklist_${current.departmentCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Booklist downloaded");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Department Booklists"
        description="Access comprehensive booklists for all polytechnic departments and curricula."
        icon={BookOpen}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Department list */}
        <Card className="h-fit">
          <CardContent className="p-3">
            <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Departments
            </p>
            <div className="max-h-96 space-y-1 overflow-y-auto scrollbar-thin">
              {departments?.map((d) => (
                <button
                  key={d.code}
                  onClick={() => setSelectedDept(d.code)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedDept === d.code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <span className="truncate">{d.name}</span>
                  <span
                    className={`shrink-0 font-mono text-xs ${
                      selectedDept === d.code ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {d.code}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booklist */}
        {isLoading || !current ? (
          <Card>
            <CardContent className="flex items-center justify-center gap-2 py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading booklist...</span>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookMarked className="h-5 w-5 text-primary" />
                    {current.departmentName}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Curriculum {current.curriculumYear} • {current.totalBooks} books • Code{" "}
                    <span className="font-mono">{current.departmentCode}</span>
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onDownload} className="gap-1.5">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by subject, code, or author"
                    className="pl-9"
                  />
                </div>
                <div className="overflow-hidden rounded-lg ring-1 ring-border">
                  <div className="max-h-[28rem] overflow-y-auto scrollbar-thin">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur">
                        <TableRow>
                          <TableHead className="w-20">Code</TableHead>
                          <TableHead>Subject / Book</TableHead>
                          <TableHead className="w-16 text-center">Credit</TableHead>
                          <TableHead className="hidden md:table-cell">Author</TableHead>
                          <TableHead className="hidden lg:table-cell">Publisher</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBooks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                              No books match your search.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredBooks.map((b) => (
                            <TableRow key={b.code}>
                              <TableCell className="font-mono text-xs">{b.code}</TableCell>
                              <TableCell className="font-medium">{b.name}</TableCell>
                              <TableCell className="text-center text-muted-foreground">{b.credit}</TableCell>
                              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                {b.author}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                                {b.publisher}
                                <Badge variant="outline" className="ml-2 text-[10px]">
                                  {b.edition}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
