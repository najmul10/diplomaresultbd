"use client";

import { create } from "zustand";

export type ViewId =
  | "home"
  | "individual"
  | "group"
  | "institute"
  | "latest"
  | "cgpa"
  | "gpa"
  | "booklists"
  | "routines"
  | "favorites"
  | "hunt"
  | "about"
  | "contact";

type RouterState = {
  view: ViewId;
  navigate: (view: ViewId) => void;
};

export const useRouter = create<RouterState>((set) => ({
  view: "home",
  navigate: (view) => {
    set({ view });
    if (typeof window !== "undefined") {
      window.location.hash = view === "home" ? "" : `#${view}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));

export function initFromHash(): ViewId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace("#", "") as ViewId;
  const valid: ViewId[] = [
    "home",
    "individual",
    "group",
    "institute",
    "latest",
    "cgpa",
    "gpa",
    "booklists",
    "routines",
    "favorites",
    "hunt",
    "about",
    "contact",
  ];
  return valid.includes(h) ? h : "home";
}
