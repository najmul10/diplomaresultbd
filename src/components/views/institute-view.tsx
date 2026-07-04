"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Search,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { AdSlot } from "@/components/site/ad-slot";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Institute } from "@/lib/types";
import { useRouter } from "@/store/use-router";

async function fetchInstitutes(): Promise<Institute[]> {
  const res = await fetch("/api/institutes");
  const j = await res.json();
  return j.data;
}

export function InstituteView() {
  const navigate = useRouter((s) => s.navigate);
  const { data: institutes, isLoading } = useQuery({
    queryKey: ["institutes-all"],
    queryFn: fetchInstitutes,
  });
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!institutes) return [];
    const q = query.trim().toLowerCase();
    if (!q) return institutes;
    return institutes.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q)
    );
  }, [institutes, query]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Institute Directory"
        description="Browse polytechnic institutes across Bangladesh."
        icon={Building2}
      />

      <Card className="mt-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold text-primary">
              Find any institute
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Browse polytechnic institutes across Bangladesh. To check a
              student&apos;s result, use{" "}
              <button
                onClick={() => navigate("individual")}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Individual Results
              </button>{" "}
              with their roll number and exam type.
            </p>
          </div>
        </CardContent>
      </Card>

      <AdSlot slot="individual-inline" className="mt-6" />

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search institute by name, district, or code..."
              className="pl-9"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {filtered.length} of {institutes?.length || 0} institutes
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="mt-4">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Loading institute directory...
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((inst) => (
            <Card key={inst.code} className="group transition-all hover:border-emerald-500/40 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold leading-tight">{inst.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {inst.district}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {inst.code}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={
                      inst.type === "Government"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                    }
                  >
                    {inst.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground"
                    onClick={() => navigate("individual")}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Search student
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
