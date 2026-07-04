import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BTEB Results Zone | Results at your fingertips",
  description:
    "Bangladesh's #1 BTEB results platform. Get instant access to diploma, polytechnic, and technical education results with advanced search, analytics, and sharing features.",
  keywords: [
    "BTEB",
    "BTEB Results",
    "Diploma Results",
    "Polytechnic Results",
    "Bangladesh Technical Education Board",
    "CGPA Calculator",
    "Exam Routine",
  ],
  authors: [{ name: "BTEB Results Zone" }],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "BTEB Results Zone | Results at your fingertips",
    description:
      "Bangladesh's most trusted platform for BTEB exam results. Instant access to diploma, polytechnic, and technical education results.",
    siteName: "BTEB Results Zone",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BTEB Results Zone",
    description: "Bangladesh's #1 BTEB results platform.",
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
            {children}
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
