import type { Metadata } from "next";
import { Inter, Patrick_Hand, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../lib/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-patrick-hand",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lemon-blog.vercel.app'),
  title: {
    default: "Lemon Blog",
    template: "%s | Lemon Blog",
  },
  description: "A blog about web development, programming, and technology.",
  keywords: ["blog", "web development", "programming", "technology", "tutorials"],
  authors: [{ name: "Lemon" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    title: "Lemon Blog",
    description: "A blog about web development, programming, and technology.",
    siteName: "Lemon Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemon Blog",
    description: "A blog about web development, programming, and technology.",
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
      <body className={`${inter.variable} ${patrickHand.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
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
