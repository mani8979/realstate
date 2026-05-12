import { Metadata, ResolvingMetadata } from 'next';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import React from 'react';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  try {
    await dbConnect();
    const property = await Property.findById(id);

    if (!property) {
      return {
        title: 'Property Not Found',
      };
    }

    const title = property.title;
    const description = property.description?.substring(0, 160) || `Check out this amazing property in ${property.location}.`;
    
    const image = (property.images && property.images.length > 0) 
      ? property.images[0] 
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200';

    return {
      title: title,
      description: description,
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
    };
  } catch (error) {
    return {
      title: 'Property Details',
    };
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
