import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PWARegistration from "@/components/PWARegistration";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICONIC GH | Premium News Platform",
  description: "Breaking news, deep analysis, and trending stories from around the globe.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ICONIC GH | Premium News Platform",
    description: "Breaking news, deep analysis, and trending stories from around the globe.",
    siteName: "ICONIC GH",
    type: "website",
    images: [
      {
        url: "https://www.iconicgh.com/logo.png",
        width: 1200,
        height: 630,
        alt: "ICONIC GH Logo",
      },
    ],
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
        <main style={{ minHeight: 'calc(100vh - var(--nav-height) - 300px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

