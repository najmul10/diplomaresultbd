"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/store/use-router";

export default function NotFound() {
  const navigate = useRouter((s) => s.navigate);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Search className="h-10 w-10" />
      </div>
      <div>
        <h1 className="text-6xl font-extrabold text-primary">404</h1>
        <p className="mt-2 text-xl font-bold">Page Not Found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button size="lg" className="gap-2" onClick={() => navigate("home")}>
        <Search className="h-5 w-5" />
        Back to Home
      </Button>
    </div>
  );
}
