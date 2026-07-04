"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useRouter, type ViewId } from "@/store/use-router";
import {
  Menu,
  Search,
  Users,
  Building2,
  BarChart3,
  Calculator,
  BookOpen,
  CalendarDays,
  Star,
  Info,
  Mail,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavLeaf = { view: ViewId; label: string; desc: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavLeaf[] };

const NAV: NavGroup[] = [
  {
    label: "Results",
    items: [
      { view: "individual", label: "Individual Results", desc: "Find your result by roll number", icon: Search },
      { view: "group", label: "Group Results", desc: "Check multiple results together", icon: Users },
      { view: "institute", label: "Institute Results", desc: "Institute-wise results", icon: Building2 },
      { view: "latest", label: "Latest Results", desc: "Newest results & analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Calculators",
    items: [
      { view: "cgpa", label: "CGPA Calculator", desc: "Cumulative GPA target planner", icon: Calculator },
      { view: "gpa", label: "GPA Calculator", desc: "Semester GPA calculator", icon: Calculator },
    ],
  },
  {
    label: "Resources",
    items: [
      { view: "booklists", label: "Department Booklists", desc: "Books for all departments", icon: BookOpen },
      { view: "routines", label: "Exam Routines", desc: "Schedules for all semesters", icon: CalendarDays },
      { view: "favorites", label: "Favorites", desc: "Your saved results", icon: Star },
    ],
  },
  {
    label: "More",
    items: [
      { view: "about", label: "About Us", desc: "Our story & mission", icon: Info },
      { view: "contact", label: "Contact Us", desc: "Get in touch", icon: Mail },
    ],
  },
];

export function SiteHeader() {
  const navigate = useRouter((s) => s.navigate);
  const [open, setOpen] = React.useState(false);

  const go = (view: ViewId) => {
    navigate(view);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo onClick={() => go("home")} />

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {NAV.map((group) => (
              <NavigationMenuItem key={group.label}>
                <NavigationMenuTrigger className="text-sm font-medium">
                  {group.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[min(92vw,30rem)] gap-1 p-2 md:w-[34rem] md:grid-cols-2">
                    {group.items.map((item) => (
                      <li key={item.view}>
                        <button
                          onClick={() => go(item.view)}
                          className="group flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent"
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <item.icon className="h-4 w-4" />
                          </span>
                          <span className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold leading-tight">
                              {item.label}
                            </span>
                            <span className="text-xs text-muted-foreground leading-snug">
                              {item.desc}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => go("individual")}
          >
            <Search className="mr-1.5 h-4 w-4" />
            Check Result
          </Button>
          <ThemeToggle />
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(92vw,24rem)] overflow-y-auto p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle className="text-left">
                  <Logo onClick={() => go("home")} />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {NAV.map((group) => (
                  <div key={group.label} className="mb-1">
                    <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <button
                        key={item.view}
                        onClick={() => go(item.view)}
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-sm font-medium">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export const headerNavItemStyle = navigationMenuTriggerStyle;
