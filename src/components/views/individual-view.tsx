"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, SearchX, Lightbulb } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { ResultCard } from "@/components/site/result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudentResult } from "@/lib/types";
import { toast } from "sonner";

async function searchResult(roll: string): Promise<StudentResult> {
  const res = await fetch(`/api/results/search?roll=${encodeURIComponent(roll)}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Search failed");
  }
  return json.data as StudentResult;
}

export function IndividualView() {
  const [roll, setRoll] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["result", submitted],
    queryFn: () => searchResult(submitted),
    enabled: submitted.length > 0,
    retry: false,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = roll.trim();
    if (!v) {
      toast.error("Please enter a roll number");
      return;
    }
    setSubmitted(v);
  };

  const trySample = (r: string) => {
    setRoll(r);
    setSubmitted(r);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Individual Results"
        description="Find your BTEB result instantly by entering your roll number or registration number."
        icon={Search}
        badge="Most Popular"
      />

      {/* Search form */}
      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="Enter roll number (e.g. 100156) or registration no."
                className="h-12 pl-9 text-base"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 gap-2 px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {isLoading ? "Searching..." : "Check Result"}
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              Try a sample roll:
            </span>
            {["100156", "100203", "100318", "100477"].map((r) => (
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
        </CardContent>
      </Card>

      {/* Result area */}
      <div className="mt-6">
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Fetching result for roll <span className="font-mono font-semibold">{submitted}</span>...
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
                  {error instanceof Error ? error.message : "Please check your roll number and try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : data ? (
          <ResultCard result={data} />
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
                  <Badge variant="secondary" className="mx-0.5">Check Result</Badge>{" "}
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
