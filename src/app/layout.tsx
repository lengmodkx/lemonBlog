import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lemon-blog.vercel.app'),
  title: {
    default: "Lemon Blog",
    template: "%s | Lemon Blog",
  },
  description: "Personal blog about web development, programming, and technology.",
  keywords: ["blog", "web development", "programming", "technology", "tutorials"],
  authors: [{ name: "Lemon" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Lemon Blog",
    description: "Personal blog about web development, programming, and technology.",
    siteName: "Lemon Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemon Blog",
    description: "Personal blog about web development, programming, and technology.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="7f534e60-7416-458a-9725-b7c49cf7c750"
            strategy="lazyOnload"
          />
        )}
        <ErrorBoundary>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
