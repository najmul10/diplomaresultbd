"use client";

import Image from "next/image";
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
  GraduationCap,
  Search,
  CheckCircle2,
  MapPin,
  Briefcase,
  Youtube,
  Star,
  Code,
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
    desc: "Your searches are never stored. We don't keep any personal data — results are fetched and shown to you only.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    desc: "Built on modern technology to deliver results quickly, even during peak result-publishing traffic.",
  },
  {
    icon: Gift,
    title: "Always Free",
    desc: "Every feature is 100% free for students, forever. No paywalls, no premium tiers, no hidden charges.",
  },
  {
    icon: Target,
    title: "Student-Focused",
    desc: "Designed specifically for BTEB diploma students — we show your complete academic history in one clean view.",
  },
];

const FEATURES_OVERVIEW = [
  { icon: Search, title: "Individual Results", desc: "Search by roll number to see all your semester results" },
  { icon: Users, title: "Group Results", desc: "Compare multiple students side by side" },
  { icon: Building2, title: "Institute Directory", desc: "Browse polytechnic institutes across Bangladesh" },
  { icon: BookOpen, title: "Booklists & Routines", desc: "Department booklists and exam schedules" },
  { icon: GraduationCap, title: "CGPA Calculator", desc: "Plan your academic targets" },
  { icon: CheckCircle2, title: "Performance Insights", desc: "Auto-computed trends from your result history" },
];

const EXPERIENCE = [
  { role: "Freelancing Trainer", org: "Advance Training Center", period: "2019 — 2023" },
  { role: "YouTuber", org: "YouTube Channel", period: "2016 — 2022" },
  { role: "Level 2 Seller", org: "Fiverr", period: "2018 — 2024" },
  { role: "Marketing Manager", org: "Landmark Inter Gulf, Saudi Arabia", period: "Current" },
];

const EDUCATION = [
  { name: "National Polytechnic Institute, Manikganj", degree: "Diploma in Computer Technology", period: "2019 — 2020 Session" },
  { name: "Bonparil High School", degree: "Secondary School Certificate (SSC)", period: "School Education" },
];

export function AboutView() {
  const navigate = useRouter((s) => s.navigate);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <SectionHeading
        title="About Diploma Result BD"
        description="A fast, clean and free platform for checking BTEB diploma, polytechnic and technical education results."
        icon={Info}
      />

      {/* Mission */}
      <Card className="mt-6 overflow-hidden border-primary/20">
        <div className="relative bg-gradient-to-br from-primary/10 via-transparent to-[#2ECC71]/10 p-6 sm:p-8">
          <Badge className="mb-3 gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Our Mission
          </Badge>
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Make every diploma result accessible, instant, and free.
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            For diploma students across Bangladesh, checking exam results can be
            frustrating — slow portals, confusing interfaces, and scattered data.
            Diploma Result BD brings everything together in one clean, fast
            platform. Search your roll number and instantly see your complete
            academic history — every semester result, GPA and CGPA in one place.
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: BookOpen, label: "Exam Types", value: "37+" },
          { icon: Building2, label: "Institutes", value: "100+" },
          { icon: Zap, label: "Years", value: "20+" },
          { icon: Gift, label: "Price", value: "Free" },
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

      {/* Features overview */}
      <h2 className="mt-8 text-xl font-bold tracking-tight">What you can do here</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES_OVERVIEW.map((f) => (
          <Card key={f.title} className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-start gap-3 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values */}
      <h2 className="mt-8 text-xl font-bold tracking-tight">What we stand for</h2>
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

      {/* Developer Profile — at bottom, polished */}
      <Card className="mt-8 overflow-hidden border-primary/30 shadow-lg shadow-primary/5">
        {/* Header banner */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-[#2ECC71] px-6 py-5">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
          <div className="relative flex items-center gap-2">
            <Code className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold text-white">Meet the Developer</h2>
          </div>
        </div>
        <CardContent className="p-6">
          {/* Top section: avatar + info */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {/* Avatar — bigger */}
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl ring-4 ring-primary/20 shadow-xl">
              <Image
                src="/avatar.png"
                alt="Kazi Rifat"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-extrabold">Kazi Rifat</h3>
              <p className="mt-0.5 text-sm font-medium text-primary">Developer & Creator</p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <MapPin className="h-3.5 w-3.5" />
                Manikganj Sadar, Bangladesh
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/10">
                  <Briefcase className="h-3.5 w-3.5" />
                  Marketing Manager, Saudi Arabia
                </Badge>
                <Badge className="gap-1.5 bg-[#2ECC71]/10 text-[#2ECC71] hover:bg-[#2ECC71]/10">
                  <Star className="h-3.5 w-3.5" />
                  Fiverr Level 2 Seller
                </Badge>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-border/60" />

          {/* Experience + Education */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Experience */}
            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                Experience
              </h4>
              <div className="space-y-2.5">
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 rounded-lg bg-muted/30 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{exp.role}</p>
                      <p className="truncate text-xs text-muted-foreground">{exp.org}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{exp.period}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Education */}
            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5" />
                Education
              </h4>
              <div className="space-y-2.5">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="rounded-lg bg-muted/30 px-3 py-2">
                    <p className="text-sm font-semibold">{edu.name}</p>
                    <p className="text-xs text-muted-foreground">{edu.degree}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-primary">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="mt-6 overflow-hidden border-primary/20">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
          <Heart className="h-8 w-8 fill-red-500 text-red-500" />
          <h2 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
            Built for Bangladesh&apos;s diploma community
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Developed by <span className="font-semibold text-foreground">Kazi Rifat</span>.
            Have feedback, found a bug, or have an idea to make the platform
            better? We&apos;d love to hear from you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate("contact")}>Get in touch</Button>
            <Button variant="outline" onClick={() => navigate("individual")}>
              <Search className="mr-1.5 h-4 w-4" />
              Check your result
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
