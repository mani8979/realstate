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

  const description = content?.heroSubtitle || "Star Land Developers offers the best premium lands and luxury properties for sale. Discover your dream asset with us.";

  return {
    metadataBase: new URL('https://www.starlanddevelopers.online'),
    title: {
      default: fullTitle,
      template: `%s | ${brandName}`
    },
    description: description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: fullTitle,
      description: description,
      url: "https://www.starlanddevelopers.online",
      siteName: brandName,
      images: [
        {
          url: content?.heroImage || "/cover.jpg",
          width: 1200,
          height: 630,
        }
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description,
      images: [content?.heroImage || "/cover.jpg"],
    },
    icons: {
      icon: content?.faviconImage || "/favicon.ico",
      apple: content?.faviconImage || "/favicon.ico",
    },
    manifest: '/manifest.json',
    verification: {
      google: "Albkr2wppfA5kwkizBcCKw7sxYyJTphBo776pDl6Leg",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Star Land Developers",
              "url": "https://starlanddevelopers.online",
              "logo": "https://starlanddevelopers.online/favicon.ico",
              "description": "Star Land Developers offers the best premium lands and luxury properties for sale."
            })
          }}
        />
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
