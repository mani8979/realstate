import { Metadata, ResolvingMetadata } from 'next';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import SiteContent from '@/lib/models/SiteContent';
import React from 'react';
import Script from 'next/script';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    await dbConnect();
    const property = await Property.findById(id);
    const content = await SiteContent.findOne().lean();

    let brandName = "Star Land Developers";
    const dbLogoTitle = (content?.logoTitle || "").trim();
    const dbLogoSubtitle = (content?.logoSubtitle || "").trim();

    if (dbLogoTitle && dbLogoSubtitle) {
      if (dbLogoTitle.toUpperCase() === "STAR" && dbLogoSubtitle.toUpperCase() === "LAND DEVELOPERS") {
        brandName = "Star Land Developers";
      } else {
        brandName = `${dbLogoTitle} ${dbLogoSubtitle}`;
      }
    } else if (dbLogoTitle) {
      brandName = dbLogoTitle;
    }

    // Resolve favicon to a square representation
    const dbFaviconImage = (content?.faviconImage || "").trim();
    const dbHeaderLogo = (content?.headerLogoImage || "").trim();
    const dbFooterLogo = (content?.footerLogoImage || "").trim();

    const isRectangularLogo = !dbFaviconImage ||
                              dbFaviconImage.includes("p5xexc0k8mwdyh0rorrm") || 
                              dbFaviconImage.includes("tb4vvhnvjdkaneuwzl1v") || 
                              dbFaviconImage.includes("r1oekta6ap3rplofqb5j") ||
                              dbFaviconImage === dbHeaderLogo || 
                              dbFaviconImage === dbFooterLogo;

    const faviconUrl = isRectangularLogo ? "/icon.png" : dbFaviconImage;

    if (!property) {
      return {
        title: `Property Not Found | ${brandName}`,
        icons: {
          icon: faviconUrl,
        },
      };
    }

    const title = `${property.title} | ${brandName}`;
    const description = property.description?.substring(0, 160) || `Check out this amazing property in ${property.location}.`;
    
    const image = (property.images && property.images.length > 0) 
      ? property.images[0] 
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200';

    return {
      title: title,
      description: description,
      icons: {
        icon: faviconUrl,
      },
      openGraph: {
        title: title,
        description: description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [image],
      },
      alternates: {
        canonical: `/properties/${id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Property Details',
    };
  }
}

export default async function PropertyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  await dbConnect();
  const property = await Property.findById(id).lean();

  if (!property) return <>{children}</>;

  const baseUrl = 'https://www.starlanddevelopers.online';
  const propertyUrl = `${baseUrl}/properties/${id}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties",
        "item": `${baseUrl}/properties`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.title,
        "item": propertyUrl
      }
    ]
  };

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description || "Premium Real Estate Property",
    "url": propertyUrl,
    "image": property.images?.[0] || `${baseUrl}/cover.jpg`,
    "datePosted": property.createdAt || new Date().toISOString(),
    "offers": {
      "@type": "Offer",
      "price": property.price || 0,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    }
  };

  const faqs = property.details
    ?.filter((d: any) => d.heading?.toLowerCase().includes("faq") || d.heading?.toLowerCase().includes("question"))
    .map((d: any) => ({
      "@type": "Question",
      "name": d.sideHeading || "Question",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": d.content
      }
    })) || [];

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs
  } : null;

  return (
    <>
      <Script
        id={`breadcrumb-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`listing-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      {faqSchema && (
        <Script
          id={`faq-schema-${id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {children}
    </>
  );
}
