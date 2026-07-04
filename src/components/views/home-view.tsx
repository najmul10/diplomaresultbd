"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter, type ViewId } from "@/store/use-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
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

  return (
    <div className="flex flex-col">
      {/* Hero — split layout with visual result card */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          {/* Left: copy + quick search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-1.5 pl-2 pr-3 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Bangladesh&apos;s #1 BTEB Results Platform
            </Badge>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              BTEB Results at{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  Your Fingertips
                </span>
                <svg
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary/40"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                >
                  <path d="M0,4 Q50,0 100,4 T200,4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base text-muted-foreground sm:text-lg">
              Search your BTEB result instantly — every semester result, GPA and
              CGPA in one place. Fast, accurate and always free for diploma
              students across Bangladesh.
            </p>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 gap-2 px-7 text-base shadow-lg shadow-primary/25"
                onClick={() => navigate("individual")}
              >
                <Search className="h-5 w-5" />
                Check Your Result
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 px-7 text-base"
                onClick={() => navigate("latest")}
              >
                <BarChart3 className="h-5 w-5" />
                View Statistics
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {TRUST.map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
                >
                  <t.icon className="h-4 w-4 text-primary" />
                  {t.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: visual result preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <Card className="overflow-hidden border-primary/20 shadow-2xl shadow-primary/10">
              {/* Card header */}
              <div className="flex items-center justify-between bg-gradient-to-br from-primary to-teal-600 px-5 py-4 text-primary-foreground">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">BTEB Results Zone</p>
                    <p className="mt-0.5 text-[10px] opacity-80">Verified Result</p>
                  </div>
                </div>
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-white/60" />
                  <span className="relative h-2 w-2 rounded-full bg-white" />
                </span>
              </div>

              {/* Card body — mock result preview */}
              <CardContent className="space-y-4 p-5">
                {/* Student identity */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                    <span className="text-lg font-bold leading-none">3.44</span>
                    <span className="text-[8px] font-semibold uppercase">CGPA</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold">MD. Rifat Hossain</p>
                    <p className="truncate text-xs text-muted-foreground">Computer Technology • 8th Semester</p>
                  </div>
                  <Badge className="ml-auto gap-1 bg-emerald-600 hover:bg-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Passed
                  </Badge>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Roll</p>
                    <p className="mt-0.5 font-mono text-sm font-bold">449381</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">GPA</p>
                    <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">3.44</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5 text-center">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Grade</p>
                    <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">A-</p>
                  </div>
                </div>

                {/* Subject list */}
                <div className="space-y-1.5">
                  {[
                    { n: "Programming in Java", g: "A+", c: "66651" },
                    { n: "Microprocessor & Interfacing", g: "A", c: "66662" },
                    { n: "Principles of Digital Electronics", g: "A-", c: "66842" },
                  ].map((s) => (
                    <div
                      key={s.c}
                      className="flex items-center justify-between rounded-lg bg-background px-3 py-2 ring-1 ring-border/60"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{s.c}</span>
                        <span className="truncate text-sm font-medium">{s.n}</span>
                      </div>
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-emerald-500/15 px-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {s.g}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer chip */}
                <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 text-xs">
                  <span className="font-medium text-primary">National Polytechnic Institute</span>
                  <span className="text-muted-foreground">Session 2019-2020</span>
                </div>
              </CardContent>
            </Card>

            {/* Floating accent badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -right-3 -top-3 hidden rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-950 shadow-lg sm:block"
            >
              ⚡ Lightning Fast
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-3 -left-3 hidden rounded-xl bg-background px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-lg ring-1 ring-emerald-500/20 sm:block"
            >
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
              Verified Result
            </motion.div>
          </motion.div>
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
