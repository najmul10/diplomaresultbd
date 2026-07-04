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
        "group flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className
      )}
      aria-label="BTEB Results Zone home"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-600 text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
        <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-background" />
      </span>
      <span className="flex flex-col items-start leading-none">
        <span className="text-base font-bold tracking-tight">
          BTEB <span className="text-primary">Results Zone</span>
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Results at your fingertips
        </span>
      </span>
    </button>
  );
}
