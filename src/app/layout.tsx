import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyBar from "@/components/layout/MobileStickyBar";
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
  
  const brandName = content?.logoTitle || "Star Land Developers";
  const brandSubtitle = content?.logoSubtitle ? ` | ${content.logoSubtitle}` : " | Premium Real Estate & Lands";
  const fullTitle = `${brandName}${brandSubtitle}`;

  return {
    title: fullTitle,
    description: content?.heroSubtitle || "Star Land Developers offers the best premium lands and luxury properties for sale. Discover your dream asset with us.",
    icons: {
      icon: content?.faviconImage || "/favicon.ico",
    },
  };
}

import { ContactDialog } from "@/components/layout/ContactDialog";
import FloatingDragon from "@/components/layout/FloatingDragon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <head>
        <Script 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" 
          strategy="lazyOnload"
          type="module"
        />
      </head>
      <body className="flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider>
          <ScrollProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <MobileStickyBar />
            <ContactDialog />
            <FloatingDragon />
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
