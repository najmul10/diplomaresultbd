"use client";

import * as React from "react";
import { useRouter, type ViewId } from "@/store/use-router";

const KEY_MAP: Record<string, ViewId> = {
  "1": "home",
  "2": "individual",
  "3": "group",
  "4": "institute",
  "5": "latest",
  "6": "point",
  "7": "cgpa",
  "8": "booklists",
  "9": "routines",
  "0": "favorites",
};

export function useKeyboardShortcuts() {
  const navigate = useRouter((s) => s.navigate);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Only trigger with Alt + number
      if (!e.altKey) return;
      // Skip if typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const view = KEY_MAP[e.key];
      if (view) {
        e.preventDefault();
        navigate(view);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
}
