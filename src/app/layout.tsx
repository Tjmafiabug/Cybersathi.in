import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cybersathi.in"

export const metadata: Metadata = {
  title: "CyberSathi — Cyber crime awareness and alerts",
  description:
    "Blogs, world news and curated videos on cyber crime — so you can stay one step ahead of scammers.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "CyberSathi — Cyber crime awareness and alerts",
    description:
      "Blogs, world news and curated videos on cyber crime — so you can stay one step ahead of scammers.",
    url: SITE_URL,
    type: "website",
    siteName: "CyberSathi",
    images: [
      {
        url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "CyberSathi — Cyber crime awareness and alerts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberSathi — Cyber crime awareness and alerts",
    description:
      "Blogs, world news and curated videos on cyber crime — so you can stay one step ahead of scammers.",
    images: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&auto=format&fit=crop&q=80",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
