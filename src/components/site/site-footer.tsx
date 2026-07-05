"use client";

import { useRouter, type ViewId } from "@/store/use-router";
import { Logo } from "@/components/site/logo";
import { Send, Heart, Mail, ShieldCheck, Zap, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const groups: { title: string; links: { label: string; view: ViewId }[] }[] = [
  {
    title: "Results",
    links: [
      { label: "Individual Results", view: "individual" },
      { label: "Group Results", view: "group" },
      { label: "Institute Directory", view: "institute" },
      { label: "Statistics", view: "latest" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "CGPA Calculator", view: "cgpa" },
      { label: "GPA Calculator", view: "gpa" },
      { label: "Booklists", view: "booklists" },
      { label: "Exam Routines", view: "routines" },
      { label: "Favorites", view: "favorites" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Bulk Result Finder", view: "hunt" },
      { label: "About Us", view: "about" },
      { label: "Contact", view: "contact" },
      { label: "Privacy Policy", view: "privacy" },
      { label: "Terms of Service", view: "terms" },
    ],
  },
];

const trust = [
  { icon: ShieldCheck, label: "Secure" },
  { icon: Zap, label: "Fast" },
  { icon: Gift, label: "Free" },
  { icon: TrendingUp, label: "Updated" },
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
              Bangladesh&apos;s fastest platform for diploma and polytechnic
              results. Fast, accurate and always free for students nationwide.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {trust.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border"
                >
                  <b.icon className="h-3 w-3 text-primary" />
                  {b.label}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" asChild>
                <a href="https://t.me/diplomaresultbd" target="_blank" rel="noopener noreferrer">
                  <Send className="h-3.5 w-3.5" />
                  Telegram
                </a>
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" asChild>
                <a href="mailto:support@diplomaresultbd.com">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </a>
              </Button>
            </div>
          </div>

          {/* Link groups */}
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
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
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Diploma Result BD. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Developed by <span className="font-semibold text-foreground">Kazi Rifat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
