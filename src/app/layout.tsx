import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyBar from "@/components/layout/MobileStickyBar";
import FloatingDragon from "@/components/layout/FloatingDragon";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollProvider } from "@/components/providers/ScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import dbConnect from "@/lib/db";
import SiteContent from "@/lib/models/SiteContent";

export async function generateMetadata(): Promise<Metadata> {
  await dbConnect();
  const content = await SiteContent.findOne().lean();
  
  return {
    title: content?.heroTitle || "STAR LANDS | Find Your Dream Property",
    description: content?.heroSubtitle || "Browse the best properties for sale, rent, or lease.",
    icons: {
      icon: content?.faviconImage || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <head>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
      </head>
      <body className="flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider>
          <ScrollProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <FloatingDragon />
            <Footer />
            <MobileStickyBar />
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
