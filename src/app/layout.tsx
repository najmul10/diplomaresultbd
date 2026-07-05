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
  metadataBase: new URL("https://diplomaresultbd.com"),
  title: {
    default: "Diploma Result BD | BTEB Polytechnic Result Check Online",
    template: "%s | Diploma Result BD",
  },
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
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://diplomaresultbd.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: ADSENSE_CLIENT
    ? { "google-adsense-account": ADSENSE_CLIENT }
    : undefined,
  openGraph: {
    title: "Diploma Result BD | BTEB Polytechnic Result Check Online",
    description:
      "Check your BTEB diploma result, polytechnic result online instantly. Search by roll number, view GPA, CGPA, all semester results.",
    siteName: "Diploma Result BD",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Diploma Result BD — Check BTEB diploma result online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diploma Result BD | BTEB Polytechnic Result Check Online",
    description: "Check BTEB diploma result online — fast, free, always updated.",
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2A3990" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2350" },
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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TXHV22J2');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Diploma Result BD",
              url: "https://diplomaresultbd.com",
              description: "Check your BTEB diploma result, polytechnic result online instantly. Search by roll number, view GPA, CGPA, all semester results.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://diplomaresultbd.com/#individual",
                "query-input": "required name=roll",
              },
              publisher: {
                "@type": "Organization",
                name: "Diploma Result BD",
                developer: {
                  "@type": "Person",
                  name: "Kazi Rifat",
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TXHV22J2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
