"use client";

import { ChevronRight, Home } from "lucide-react";
import { useRouter, type ViewId } from "@/store/use-router";
import { cn } from "@/lib/utils";

const VIEW_TITLES: Record<ViewId, string> = {
  home: "Home",
  individual: "Individual Results",
  group: "Group Results",
  institute: "Institute Directory",
  latest: "Statistics",
  point: "Point Results",
  cgpa: "CGPA Calculator",
  gpa: "GPA Calculator",
  booklists: "Booklists",
  routines: "Exam Routines",
  favorites: "Favorites",
  hunt: "Bulk Result Finder",
  about: "About",
  contact: "Contact",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

export function Breadcrumbs({ view }: { view: ViewId }) {
  const navigate = useRouter((s) => s.navigate);
  if (view === "home") return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8"
    >
      <ol className="flex items-center gap-1 text-xs text-muted-foreground">
        <li>
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-3 w-3" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{VIEW_TITLES[view]}</span>
        </li>
      </ol>
    </nav>
  );
}
