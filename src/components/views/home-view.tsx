"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter, type ViewId } from "@/store/use-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  Building2,
  BarChart3,
  Calculator,
  BookOpen,
  CalendarDays,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Layers,
  Radar,
  ChevronRight,
} from "lucide-react";
import { AdSlot } from "@/components/site/ad-slot";

type Feature = {
  view: ViewId;
  icon: React.ElementType;
  title: string;
  desc: string;
  popular?: boolean;
  accent: string;
};

const FEATURES: Feature[] = [
  {
    view: "individual",
    icon: Search,
    title: "Result Search",
    desc: "Enter your roll number to view your complete academic history — every semester, GPA and CGPA.",
    popular: true,
    accent: "from-emerald-500/20 to-teal-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    view: "group",
    icon: Users,
    title: "Group Results",
    desc: "Compare multiple students' results side by side in seconds.",
    accent: "from-violet-500/20 to-purple-500/5 text-violet-600 dark:text-violet-400",
  },
  {
    view: "institute",
    icon: Building2,
    title: "Institute Directory",
    desc: "Browse polytechnic institutes across Bangladesh and find any student's result.",
    accent: "from-teal-500/20 to-cyan-500/5 text-teal-600 dark:text-teal-400",
  },
  {
    view: "latest",
    icon: BarChart3,
    title: "Statistics",
    desc: "Browse pass rates, grade distribution and average GPA across BTEB results.",
    accent: "from-amber-500/20 to-orange-500/5 text-amber-600 dark:text-amber-400",
  },
  {
    view: "cgpa",
    icon: Calculator,
    title: "CGPA Calculator",
    desc: "Calculate your CGPA and plan your academic targets with our smart calculator.",
    accent: "from-rose-500/20 to-pink-500/5 text-rose-600 dark:text-rose-400",
  },
  {
    view: "booklists",
    icon: BookOpen,
    title: "Department Booklists",
    desc: "Access comprehensive booklists for all polytechnic departments.",
    accent: "from-lime-500/20 to-green-500/5 text-lime-600 dark:text-lime-400",
  },
  {
    view: "routines",
    icon: CalendarDays,
    title: "Exam Routines",
    desc: "Access the latest exam routines and schedules for all diploma departments.",
    accent: "from-sky-500/20 to-cyan-500/5 text-sky-600 dark:text-sky-400",
  },
  {
    view: "hunt",
    icon: Radar,
    title: "Bulk Result Finder",
    desc: "Search an entire roll-number range at once and collect every result found.",
    accent: "from-fuchsia-500/20 to-pink-500/5 text-fuchsia-600 dark:text-fuchsia-400",
  },
];

const TRUST = [
  { icon: ShieldCheck, label: "100% Secure" },
  { icon: Zap, label: "Lightning Fast" },
  { icon: Gift, label: "Always Free" },
  { icon: TrendingUp, label: "Up to Date" },
];

const STATS = [
  { value: "37+", label: "Exam Types", sub: "All BTEB curricula" },
  { value: "20+", label: "Years", sub: "2005 – 2026" },
  { value: "50+", label: "Institutes", sub: "Across Bangladesh" },
  { value: "Free", label: "Forever", sub: "No charges, ever" },
];

export function HomeView() {
  const navigate = useRouter((s) => s.navigate);
  const [quickRoll, setQuickRoll] = React.useState("");

  const onQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRoll.trim()) return;
    navigate("individual");
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge
                variant="secondary"
                className="mb-5 gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-1.5 pl-2 pr-3 text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Bangladesh&apos;s #1 BTEB Results Platform
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Check Your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  BTEB Result
                </span>
                <svg
                  className="absolute -bottom-1 left-0 h-2 w-full text-primary/40"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                >
                  <path d="M0,4 Q50,0 100,4 T200,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>{" "}
              Instantly
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
            >
              Fast, accurate and free BTEB diploma, polytechnic &amp; technical
              education results. Search by roll number and see your complete
              academic history — every semester, GPA and CGPA in one place.
            </motion.p>

            {/* Quick search */}
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              onSubmit={onQuickSearch}
              className="mx-auto mt-7 flex max-w-xl flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={quickRoll}
                  onChange={(e) => setQuickRoll(e.target.value)}
                  placeholder="Enter your roll number..."
                  className="h-12 border-2 pl-11 text-base shadow-sm"
                  inputMode="numeric"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 gap-2 px-7 text-base shadow-lg shadow-primary/25"
              >
                <Search className="h-5 w-5" />
                Check Result
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            >
              {TRUST.map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
                >
                  <t.icon className="h-4 w-4 text-primary" />
                  {t.label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="px-4 py-7 text-center lg:py-9"
            >
              <p className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-semibold">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10">
          <AdSlot slot="home-inline" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            Everything You Need
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful features for BTEB results
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Everything you need to access, track and manage your BTEB results —
            all in one place, all free.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.button
              key={f.title}
              onClick={() => navigate(f.view)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left transition-colors hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              {f.popular ? (
                <span className="absolute right-3 top-3 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  Popular
                </span>
              ) : null}
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent}`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold leading-tight">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Card className="relative overflow-hidden border-primary/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10" />
            <CardContent className="relative flex flex-col items-center gap-6 p-8 text-center sm:p-12 lg:flex-row lg:justify-between lg:text-left">
              <div className="max-w-2xl">
                <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to check your BTEB results?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Join millions of students who trust BTEB Results Zone for
                  fast, accurate and reliable access to their exam results.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2" onClick={() => navigate("individual")}>
                  <Search className="h-5 w-5" />
                  Check Result
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("cgpa")}>
                  <Calculator className="h-5 w-5" />
                  CGPA Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
