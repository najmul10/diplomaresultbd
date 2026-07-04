"use client";

import { useRouter, type ViewId } from "@/store/use-router";
import { Logo } from "@/components/site/logo";
import {
  Send,
  Github,
  Heart,
  Mail,
  Shield,
  Zap,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const resultLinks: { label: string; view: ViewId }[] = [
  { label: "Individual Results", view: "individual" },
  { label: "Group Results", view: "group" },
  { label: "Institute Results", view: "institute" },
  { label: "Latest Results", view: "latest" },
];

const toolLinks: { label: string; view: ViewId }[] = [
  { label: "CGPA Calculator", view: "cgpa" },
  { label: "GPA Calculator", view: "gpa" },
  { label: "Booklists", view: "booklists" },
  { label: "Exam Routines", view: "routines" },
  { label: "Favorites", view: "favorites" },
];

const moreLinks: { label: string; view: ViewId }[] = [
  { label: "About Us", view: "about" },
  { label: "Contact Us", view: "contact" },
];

const trustBadges = [
  { icon: Shield, label: "100% Secure" },
  { icon: Zap, label: "Lightning Fast" },
  { icon: Gift, label: "Always Free" },
];

export function SiteFooter() {
  const navigate = useRouter((s) => s.navigate);

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Logo onClick={() => navigate("home")} />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Bangladesh&apos;s most trusted platform for BTEB exam results. Fast,
              accurate, and always free for diploma students nationwide.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border"
                >
                  <b.icon className="h-3.5 w-3.5 text-primary" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-sm font-semibold">Results</h3>
            <ul className="mt-3 space-y-2">
              {resultLinks.map((l) => (
                <li key={l.view}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold">Tools</h3>
            <ul className="mt-3 space-y-2">
              {toolLinks.map((l) => (
                <li key={l.view}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-sm font-semibold">More</h3>
            <ul className="mt-3 space-y-2">
              {moreLinks.map((l) => (
                <li key={l.view}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button size="icon" variant="outline" aria-label="Telegram" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Send className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" aria-label="Email" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <Button size="icon" variant="outline" aria-label="GitHub" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BTEB Results Zone. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Developed with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> for
            diploma students
          </p>
        </div>
      </div>
    </footer>
  );
}
