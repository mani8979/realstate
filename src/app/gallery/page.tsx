import React from 'react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';

async function getContent() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne().lean();
    return content || {};
  } catch (error) {
    return {};
  }
}

export default async function GalleryPage() {
  const content = await getContent();
  const serializedContent = JSON.parse(JSON.stringify(content));
  const images = serializedContent.aboutGallery || [];

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <Link 
              href="/about" 
              className="group flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 hover:translate-x-[-8px] transition-all"
            >
              <ArrowLeft size={14} />
              Back to About
            </Link>
            <h1 className="text-5xl md:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-6">
              Full <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-light leading-relaxed">
              Explore our cinematic collection of premium sites, architectural landmarks, and successful projects that define Star Lands Developers.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <div className="text-primary text-6xl font-black mb-2">{images.length.toString().padStart(2, '0')}</div>
            <div className="text-black dark:text-white font-black uppercase tracking-[0.4em] text-[10px]">Total Captures</div>
          </div>
        </div>

        {/* Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {images.map((img: any, index: number) => (
              <div 
                key={index} 
                className="group relative flex flex-col gap-6"
              >
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-black/5 dark:bg-white/5">
                  <img 
                    src={img.url} 
                    alt={img.caption || `Gallery ${index}`} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="absolute bottom-10 left-10 right-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                    <div className="bg-primary/20 backdrop-blur-md border border-primary/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                      <Camera size={20} className="text-primary" />
                    </div>
                    <p className="text-black dark:text-white font-black uppercase tracking-widest text-[10px] mb-2">Cinematic Capture {index + 1}</p>
                    <div className="h-px w-20 bg-primary mb-4" />
                  </div>
                </div>

                <div className="px-4">
                   <h3 className="text-black dark:text-white text-xl md:text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
                     {img.caption || 'Premium Development Site'}
                   </h3>
                   <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                     Star Lands Exclusive • 2026
                   </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-700 mb-8">
              <Camera size={40} />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-widest mb-4">Gallery is currently empty</h2>
            <p className="text-gray-500 max-w-md mx-auto">Check back soon as we add more cinematic captures of our latest premium developments.</p>
            <Link href="/about" className="mt-10 bg-primary text-black dark:text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
