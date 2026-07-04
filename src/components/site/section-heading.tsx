"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, type ViewId } from "@/store/use-router";

export function SectionHeading({
  title,
  description,
  icon: Icon,
  badge,
  backTo = "home",
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  badge?: string;
  backTo?: ViewId;
  className?: string;
}) {
  const navigate = useRouter((s) => s.navigate);
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(backTo)}
        className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            {badge ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {badge}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
