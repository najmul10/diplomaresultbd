"use client";

import * as React from "react";
import {
  Star,
  Trash2,
  Search,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GradeBadge } from "@/components/site/grade-badge";
import { useFavorites, type FavoriteItem } from "@/store/use-favorites";
import { useRouter } from "@/store/use-router";
import { ordinal, gpaColor, formatDate } from "@/lib/grade";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function FavoritesView() {
  const { items, remove, clear } = useFavorites();
  const navigate = useRouter((s) => s.navigate);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.roll.toLowerCase().includes(q) ||
        i.instituteName.toLowerCase().includes(q) ||
        i.departmentName.toLowerCase().includes(q)
    );
  }, [items, query]);

  const onShareAll = async () => {
    if (items.length === 0) return;
    const text = `My BTEB Favorites (${items.length}):\n` +
      items
        .map(
          (i) =>
            `• ${i.name} — ${i.roll} — ${ordinal(i.semester)} Sem — GPA ${typeof i.gpa === "number" ? i.gpa.toFixed(2) : "—"} (${i.letterGrade || "—"})`
        )
        .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Favorites list copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="Favorites"
        description="Your saved BTEB results, stored privately on this device."
        icon={Star}
        badge={`${items.length} saved`}
      />

      {items.length === 0 ? (
        <Card className="mt-6 border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Heart className="h-8 w-8" />
            </span>
            <div>
              <p className="text-lg font-semibold">No favorites yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                When you check a result, tap the{" "}
                <Star className="inline h-3.5 w-3.5 text-amber-500" /> Save button to keep
                it here for quick access.
              </p>
            </div>
            <Button className="mt-2 gap-2" onClick={() => navigate("individual")}>
              <Search className="h-4 w-4" />
              Check a Result
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved results by name, roll, institute..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onShareAll} className="gap-1.5">
                <Share2 className="h-4 w-4" />
                Share list
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-rose-600 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" />
                    Clear all
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all {items.length} saved results from this device. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        clear();
                        toast.success("All favorites cleared");
                      }}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      Clear all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filtered.length === 0 ? (
              <Card className="border-dashed sm:col-span-2">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No favorites match your search.
                </CardContent>
              </Card>
            ) : (
              filtered.map((item) => (
                <FavoriteRow key={item.roll} item={item} onRemove={remove} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function FavoriteRow({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: (roll: string) => void;
}) {
  const navigate = useRouter((s) => s.navigate);
  const passed = item.result === "PASSED";
  return (
    <Card className="group transition-all hover:shadow-md hover:shadow-primary/5">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-center ring-1 ${
            passed
              ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
              : "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300"
          }`}
        >
          <span className="text-lg font-bold leading-none">{typeof item.gpa === "number" ? item.gpa.toFixed(2) : "—"}</span>
          <span className="text-[9px] font-semibold uppercase">GPA</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">{item.name}</p>
            <GradeBadge grade={item.letterGrade || "F"} size="sm" />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {item.instituteName}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="font-mono">{item.roll}</span>
            <span>{item.departmentName}</span>
            <span>{ordinal(item.semester)} Sem</span>
            <span className={`font-semibold ${gpaColor(item.gpa)}`}>
              GPA {typeof item.gpa === "number" ? item.gpa.toFixed(2) : "—"}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => navigate("individual")}
            aria-label="View result"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-rose-500"
            onClick={() => {
              onRemove(item.roll);
              toast.success("Removed from favorites");
            }}
            aria-label="Remove from favorites"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
