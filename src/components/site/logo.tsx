"use client";

import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 transition-opacity hover:opacity-90",
        className
      )}
      aria-label="Diploma Result BD home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-teal-600 to-emerald-600 text-primary-foreground shadow-md shadow-primary/25 transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
        <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-background" />
      </span>
      <span className="flex flex-col items-start leading-none">
        <span className="text-sm font-extrabold tracking-tight sm:text-base">
          Diploma <span className="text-primary">Result</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          BD
        </span>
      </span>
    </button>
  );
}
