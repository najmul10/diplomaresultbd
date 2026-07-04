"use client";

import * as React from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { useRouter, initFromHash, type ViewId } from "@/store/use-router";
import { HomeView } from "@/components/views/home-view";
import { IndividualView } from "@/components/views/individual-view";
import { GroupView } from "@/components/views/group-view";
import { InstituteView } from "@/components/views/institute-view";
import { LatestView } from "@/components/views/latest-view";
import { CgpaView } from "@/components/views/cgpa-view";
import { BooklistsView } from "@/components/views/booklists-view";
import { RoutinesView } from "@/components/views/routines-view";
import { FavoritesView } from "@/components/views/favorites-view";
import { HuntView } from "@/components/views/hunt-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";
import { motion, AnimatePresence } from "framer-motion";

function ViewSwitch({ view }: { view: ViewId }) {
  switch (view) {
    case "home":
      return <HomeView />;
    case "individual":
      return <IndividualView />;
    case "group":
      return <GroupView />;
    case "institute":
      return <InstituteView />;
    case "latest":
      return <LatestView />;
    case "cgpa":
      return <CgpaView />;
    case "gpa":
      return <CgpaView gpaOnly />;
    case "booklists":
      return <BooklistsView />;
    case "routines":
      return <RoutinesView />;
    case "favorites":
      return <FavoritesView />;
    case "hunt":
      return <HuntView />;
    case "about":
      return <AboutView />;
    case "contact":
      return <ContactView />;
    default:
      return <HomeView />;
  }
}

export default function Page() {
  const view = useRouter((s) => s.view);
  const navigate = useRouter((s) => s.navigate);

  // Initialize from hash + listen for hash changes (back/forward)
  React.useEffect(() => {
    navigate(initFromHash());
    const onHashChange = () => navigate(initFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ViewSwitch view={view} />
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}
