"use client";

import { cn } from "@/lib/utils";
import { gradeColor } from "@/lib/grade";

export function GradeBadge({
  grade,
  size = "md",
  showLabel = false,
  className,
}: {
  grade: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const c = gradeColor(grade);
  const sizeCls =
    size === "lg"
      ? "h-12 min-w-12 px-3 text-lg"
      : size === "sm"
        ? "h-6 min-w-6 px-1.5 text-xs"
        : "h-9 min-w-9 px-2 text-sm";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md font-bold ring-1",
          c.bg,
          c.text,
          c.ring,
          sizeCls,
          className
        )}
      >
        {grade}
      </span>
      {showLabel && c.label ? (
        <span className="text-xs text-muted-foreground">{c.label}</span>
      ) : null}
    </span>
  );
}
