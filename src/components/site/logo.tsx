"use client";

import Image from "next/image";
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
      <Image
        src="/logo.png"
        alt="Diploma Result BD"
        width={180}
        height={44}
        priority
        className="h-7 w-auto object-contain sm:h-8"
      />
    </button>
  );
}
