'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AboutGalleryProps {
  images: {
    url: string;
    caption: string;
  }[];
}

const AboutGallery = ({ images }: AboutGalleryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4"
          >
            Cinematic Experience
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            Company <span className="text-primary">Gallery</span>
          </motion.h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/gallery" 
            className="group flex items-center gap-4 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary px-8 py-4 rounded-2xl transition-all duration-500"
          >
            <span className="text-white font-black uppercase tracking-widest text-[10px]">View All Photos</span>
            <ArrowRight size={16} className="text-primary group-hover:text-white group-hover:translate-x-2 transition-all" />
          </Link>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-12 px-[5%] scrollbar-hide snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="flex-shrink-0 w-[85vw] md:w-[450px] aspect-[4/5] md:aspect-square relative rounded-[2.5rem] overflow-hidden snap-center group"
          >
            <img 
              src={img.url} 
              alt={img.caption || `Gallery Image ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                <div className="w-10 h-[1px] bg-primary" />
                <span className="text-primary font-black uppercase tracking-[0.3em] text-[8px]">Cinematic Shot {index + 1}</span>
              </div>
              <h3 className="text-white font-black text-lg md:text-xl uppercase tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                {img.caption || 'Star Lands Premium Site'}
              </h3>
            </div>

            {/* Premium Border Overlay */}
            <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] pointer-events-none group-hover:border-primary/50 transition-colors duration-500" />
          </motion.div>
        ))}

        {/* See More Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 w-[85vw] md:w-[450px] aspect-[4/5] md:aspect-square snap-center"
        >
          <Link 
            href="/gallery"
            className="w-full h-full flex flex-col items-center justify-center bg-primary/5 border-2 border-dashed border-primary/20 rounded-[2.5rem] hover:bg-primary/10 hover:border-primary/40 transition-all group"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all text-primary">
              <PlusIcon size={32} />
            </div>
            <span className="text-white font-black uppercase tracking-[0.4em] text-sm">See More</span>
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] mt-2">View Full Collection</span>
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

const PlusIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default AboutGallery;
