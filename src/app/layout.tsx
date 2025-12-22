import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../lib/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Lemon Blog",
    template: "%s | Lemon Blog",
  },
  description: "A modern blog platform for sharing knowledge and insights on web development and technology.",
  keywords: ["blog", "web development", "programming", "technology", "tutorials"],
  authors: [{ name: "Lemon Blog Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lemon-blog.vercel.app",
    title: "Lemon Blog",
    description: "A modern blog platform for sharing knowledge and insights on web development and technology.",
    siteName: "Lemon Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemon Blog",
    description: "A modern blog platform for sharing knowledge and insights on web development and technology.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
