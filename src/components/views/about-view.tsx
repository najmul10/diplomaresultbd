"use client";

import {
  Info,
  ShieldCheck,
  Zap,
  Gift,
  Target,
  Heart,
  Users,
  Building2,
  BookOpen,
  Award,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/store/use-router";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Privacy First",
    desc: "Your searches and favorites never leave your device. We don't store personal data.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized infrastructure delivers results in milliseconds, not minutes.",
  },
  {
    icon: Gift,
    title: "Always Free",
    desc: "Every feature is 100% free for students, forever. No paywalls, no premium tiers.",
  },
  {
    icon: Target,
    title: "Student-Centric",
    desc: "Built by diploma students, for diploma students. We understand your needs.",
  },
];

const MILESTONES = [
  { year: "2021", text: "Launched with a single result search feature" },
  { year: "2022", text: "Added institute-wise results & CGPA calculator" },
  { year: "2023", text: "Crossed 1 million students served" },
  { year: "2024", text: "Introduced analytics, booklists & exam routines" },
  { year: "2025", text: "Now serving 2.3M+ students nationwide" },
];

export function AboutView() {
  const navigate = useRouter((s) => s.navigate);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="About BTEB Results Zone"
        description="Bangladesh's most trusted platform for BTEB exam results — built for diploma students, by people who care."
        icon={Info}
      />

      {/* Mission */}
      <Card className="mt-6 overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary/10 via-transparent to-amber-400/10 p-6 sm:p-8">
          <Badge className="mb-3 gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Our Mission
          </Badge>
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Make every BTEB result accessible, instant, and free.
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            For millions of diploma students across Bangladesh, checking exam
            results used to mean slow portals, confusing interfaces, and
            unreliable access. BTEB Results Zone changes that — a fast, clean,
            and dependable platform that puts results right at your fingertips.
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Users, label: "Students Served", value: "2.3M+" },
          { icon: Building2, label: "Institutes", value: "50+" },
          { icon: BookOpen, label: "Departments", value: "12" },
          { icon: Award, label: "Years", value: "5+" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <s.icon className="h-6 w-6 text-primary" />
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values */}
      <h2 className="mt-10 text-xl font-bold tracking-tight">What we stand for</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {VALUES.map((v) => (
          <Card key={v.title}>
            <CardContent className="flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <h2 className="mt-10 text-xl font-bold tracking-tight">Our journey</h2>
      <Card className="mt-4">
        <CardContent className="p-5 sm:p-6">
          <ol className="relative space-y-5 border-l border-border pl-6">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[1.65rem] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                <p className="text-sm font-bold text-primary">{m.year}</p>
                <p className="text-sm text-muted-foreground">{m.text}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="mt-8 overflow-hidden border-primary/20">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
          <Heart className="h-8 w-8 fill-red-500 text-red-500" />
          <h2 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
            Built with love for Bangladesh&apos;s diploma community
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Have feedback or an idea to make the platform better? We&apos;d love
            to hear from you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate("contact")}>Get in touch</Button>
            <Button variant="outline" onClick={() => navigate("individual")}>
              Check your result
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
