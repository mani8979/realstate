import React from 'react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 0;

async function getContent() {
  await dbConnect();
  return await SiteContent.findOne().lean();
}

export default async function TopLevelDynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const content: any = await getContent();
  
  if (!content) return notFound();

  // Find the matching link in footerQuickLinks
  const pageData = content.footerQuickLinks?.find((l: any) => l.href === `/${slug}` || l.href === slug);

  if (!pageData) {
    return notFound();
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <Header />
      <main className="pt-40 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white uppercase tracking-tighter mb-12">
              {pageData.label}
            </h1>
            <div 
              className="prose prose-xl dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
