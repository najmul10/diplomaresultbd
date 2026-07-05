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
        "group flex items-center transition-opacity hover:opacity-90",
        className
      )}
      aria-label="Diploma Result BD home"
    >
      <Image
        src="/logo.png"
        alt="Diploma Result BD"
        width={220}
        height={55}
        priority
        className="h-10 w-auto object-contain sm:h-12"
      />
    </button>
  );
}
