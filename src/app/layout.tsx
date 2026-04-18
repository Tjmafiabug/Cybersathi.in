import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberSathi — Cyber crime awareness and alerts",
  description:
    "Blogs, world news and curated videos on cyber crime — so you can stay one step ahead of scammers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
