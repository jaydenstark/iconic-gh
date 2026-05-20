import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PWARegistration from "@/components/PWARegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICONIC GH | Premium News Platform",
  description: "Breaking news, deep analysis, and trending stories from around the globe.",
  manifest: "/manifest.json",
  openGraph: {
    title: "ICONIC GH | Premium News Platform",
    description: "Breaking news, deep analysis, and trending stories from around the globe.",
    siteName: "ICONIC GH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PWARegistration />
        <Navbar />
        <main className="container" style={{ minHeight: 'calc(100vh - var(--nav-height) - 300px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

