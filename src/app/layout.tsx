import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";
import PWARegistration from "@/components/PWARegistration";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.iconicgh.com"),
  title: "ICONIC GH | Premium Software Development & Digital Marketing Agency",
  description: "ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud platforms, and data-driven digital marketing campaigns.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
  openGraph: {
    title: "ICONIC GH | Premium Software Development & Digital Marketing Agency",
    description: "ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud platforms, and data-driven digital marketing campaigns.",
    siteName: "ICONIC GH",
    type: "website",
    url: "https://www.iconicgh.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ICONIC GH — Software Development & Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICONIC GH | Premium Software Development & Digital Marketing Agency",
    description: "ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud platforms, and data-driven digital marketing campaigns.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <PWARegistration />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - var(--nav-height) - 300px)' }}>
          {children}
        </main>
        <AIAssistant />
        <Footer />
      </body>
    </html>
  );
}
