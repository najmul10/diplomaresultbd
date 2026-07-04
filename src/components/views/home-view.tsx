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
    title: "Live Result Search",
    desc: "Search your BTEB result by roll, registration, exam type and year — all semester results in one place.",
    popular: true,
    accent: "from-emerald-500/20 to-teal-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    view: "latest",
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Browse aggregate statistics — pass rates, grade distribution and average GPA across a roll range.",
    accent: "from-amber-500/20 to-orange-500/5 text-amber-600 dark:text-amber-400",
  },
  {
    view: "institute",
    icon: Building2,
    title: "Institute Directory",
    desc: "Browse all polytechnic institutes across Bangladesh, then search any student's live result.",
    accent: "from-teal-500/20 to-cyan-500/5 text-teal-600 dark:text-teal-400",
  },
  {
    view: "group",
    icon: Users,
    title: "Live Group Results",
    desc: "Compare multiple students' results side by side in seconds.",
    accent: "from-violet-500/20 to-purple-500/5 text-violet-600 dark:text-violet-400",
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
    desc: "Access comprehensive booklists for all polytechnic departments and curricula.",
    accent: "from-lime-500/20 to-green-500/5 text-lime-600 dark:text-lime-400",
  },
  {
    view: "routines",
    icon: CalendarDays,
    title: "Exam Routines",
    desc: "Access the latest exam routines and schedules for all diploma departments.",
    accent: "from-sky-500/20 to-blue-500/5 text-sky-600 dark:text-sky-400",
  },
  {
    view: "routines",
    icon: Layers,
    title: "Customize Exam Routines",
    desc: "Create a personalized exam schedule by selecting only the subjects you need.",
    accent: "from-fuchsia-500/20 to-pink-500/5 text-fuchsia-600 dark:text-fuchsia-400",
  },
];

const TRUST = [
  { icon: ShieldCheck, label: "100% Secure" },
  { icon: Zap, label: "Lightning Fast" },
  { icon: Gift, label: "Always Free" },
  { icon: TrendingUp, label: "Live & Updated" },
];

export function HomeView() {
  const navigate = useRouter((s) => s.navigate);

  const statCards = [
    { label: "Data Source", value: "BTEB", sub: "Verified results" },
    { label: "Exam Types", value: "37+", sub: "All BTEB curricula" },
    { label: "Years", value: "2005-25", sub: "Full coverage" },
    { label: "Price", value: "Free", sub: "Always & forever" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 py-1.5 pl-2 pr-3 text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Fast &amp; reliable results
            </Badge>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              BTEB Results at{" "}
              <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                Your Fingertips
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Search your BTEB result instantly — every semester result,
              GPA and CGPA in one place. Fast, accurate, and always free.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 gap-2 text-base shadow-lg shadow-primary/20"
                onClick={() => navigate("individual")}
              >
                <Search className="h-5 w-5" />
                Check Your Results
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 text-base"
                onClick={() => navigate("latest")}
              >
                <BarChart3 className="h-5 w-5" />
                View Latest Results
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
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

          {/* Hero visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <Card className="overflow-hidden border-primary/20 shadow-2xl shadow-primary/10">
              <div className="flex items-center justify-between bg-gradient-to-br from-primary to-teal-600 px-5 py-4 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6" />
                  <span className="font-semibold">BTEB Results Zone</span>
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/20">
                  Live
                </Badge>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="GPA" value="3.92" tone="emerald" />
                  <MiniStat label="Grade" value="A+" tone="emerald" />
                  <MiniStat label="CGPA" value="3.78" tone="teal" />
                  <MiniStat label="Result" value="PASSED" tone="emerald" />
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Student
                  </p>
                  <p className="mt-0.5 font-semibold">Md. Sakibul Islam</p>
                  <p className="text-xs text-muted-foreground">
                    Computer Technology • 7th Semester
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    { n: "Database Management System", g: "A+", p: "4.00" },
                    { n: "Computer Networks", g: "A", p: "3.50" },
                    { n: "Operating System", g: "A+", p: "4.00" },
                  ].map((s) => (
                    <div
                      key={s.n}
                      className="flex items-center justify-between rounded-lg bg-background px-3 py-2 ring-1 ring-border/60"
                    >
                      <span className="truncate text-sm font-medium">{s.n}</span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-emerald-500/15 px-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {s.g}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {s.p}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="absolute -right-3 -top-3 -z-10 h-24 w-24 rounded-2xl bg-amber-400/20 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="px-4 py-6 text-center sm:py-8"
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
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Ad slot */}
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
            Designed to make accessing and managing your BTEB results easier
            than ever before.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.button
              key={f.title}
              onClick={() => navigate(f.view)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent}`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                {f.popular ? (
                  <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300">
                    Popular
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Card className="relative overflow-hidden border-primary/20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10" />
            <CardContent className="relative flex flex-col items-center gap-6 p-8 text-center sm:p-12 lg:flex-row lg:justify-between lg:text-left">
              <div className="max-w-2xl">
                <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready to check your BTEB results?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Join 1.5+ million students who trust BTEB Results Zone for
                  fast, accurate, and reliable access to their exam results.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2" onClick={() => navigate("individual")}>
                  <Search className="h-5 w-5" />
                  Start Checking
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("about")}>
                  Learn Our Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "teal";
}) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : "bg-teal-500/10 text-teal-700 dark:text-teal-300";
  return (
    <div className={`rounded-xl p-3 text-center ${cls}`}>
      <p className="text-[11px] font-medium uppercase tracking-wider opacity-80">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold">{value}</p>
    </div>
  );
}
