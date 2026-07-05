import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { AdScript } from "@/components/site/ad-slot";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diploma Result BD | BTEB Polytechnic Result Check Online",
  description:
    "Check your BTEB diploma result, polytechnic result online instantly. Search by roll number, view GPA, CGPA, all semester results. Fast, free and always updated for Bangladesh diploma students.",
  keywords: [
    "diploma result bd",
    "bteb result",
    "diploma result",
    "polytechnic result",
    "bteb result 2026",
    "diploma result check",
    "bteb diploma result",
    "polytechnic result bd",
    "diploma result 2026",
    "bteb cgpa calculator",
    "diploma result search",
    "bangladesh diploma result",
    "technical education result",
  ],
  authors: [{ name: "Kazi Rifat" }],
  manifest: "/manifest.webmanifest",
  other: ADSENSE_CLIENT
    ? { "google-adsense-account": ADSENSE_CLIENT }
    : undefined,
  openGraph: {
    title: "Diploma Result BD | BTEB Polytechnic Result Check Online",
    description:
      "Check your BTEB diploma result, polytechnic result online instantly. Search by roll number, view GPA, CGPA, all semester results.",
    siteName: "Diploma Result BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diploma Result BD",
    description: "Check BTEB diploma result online — fast, free, always updated.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f766e" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1f1c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AdScript />
            {children}
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
