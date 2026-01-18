import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanam International - Fashion & Apparel",
  description: "Discover the latest trends in fashion at Sanam International. Shop men's, women's, and kids' clothing and shoes from top brands.",
  keywords: ["fashion", "clothing", "shoes", "men", "women", "kids", "style", "apparel", "nepal", "sanam international"],
  authors: [{ name: "Sanam International" }],
  openGraph: {
    title: "Sanam International - Fashion & Apparel",
    description: "Discover the latest trends in fashion at Sanam International",
    url: "https://sanaminternational.com",
    siteName: "Sanam International",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanam International",
    description: "Discover the latest trends in fashion at Sanam International",
  },
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
        suppressHydrationWarning
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
