import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Google AdSense ad unit.
 *
 * Config (read once at module load):
 *   NEXT_PUBLIC_ADSENSE_CLIENT  — publisher ID, e.g. ca-pub-1119994195656037
 *   NEXT_PUBLIC_ADSENSE_SLOTS   — JSON: { "home-inline": "1234567890", ... }
 *
 * Until configured, a labelled placeholder renders so layout is preserved.
 * Place <AdSlot slot="home-inline" /> anywhere you want an ad.
 */

type AdConfig = { client: string; slots: Record<string, string> };

function readConfig(): AdConfig {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  let slots: Record<string, string> = {};
  const raw = process.env.NEXT_PUBLIC_ADSENSE_SLOTS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        slots = parsed as Record<string, string>;
      }
    } catch {
      /* malformed — fall back to empty */
    }
  }
  return { client, slots };
}

const CONFIG = readConfig();

export function AdScript() {
  if (!CONFIG.client) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.client}`}
      crossOrigin="anonymous"
    />
  );
}

export function AdSlot({
  slot,
  format = "auto",
  className,
  label = "Advertisement",
  responsive = true,
}: {
  slot: string;
  format?: string;
  className?: string;
  label?: string;
  responsive?: boolean;
}) {
  const slotId = CONFIG.slots[slot];
  const insRef = React.useRef<HTMLModElement>(null);
  const [pushed, setPushed] = React.useState(false);

  React.useEffect(() => {
    if (!CONFIG.client || !slotId || pushed) return;
    // Wait until the AdSense script has loaded the adsbygoogle global, then push.
    const tryPush = () => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
          setPushed(true);
          return true;
        }
      } catch {
        /* ad blocker or not loaded — keep placeholder */
      }
      return false;
    };
    if (tryPush()) return;
    const interval = setInterval(() => {
      if (tryPush()) clearInterval(interval);
    }, 500);
    const timeout = setTimeout(() => clearInterval(interval), 8000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [slotId, pushed]);

  if (!CONFIG.client || !slotId) {
    // AdSense not configured — return nothing (no placeholder)
    return null;
  }

  return (
    <div className={cn("flex justify-center", className)} aria-label="Advertisement">
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={CONFIG.client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
