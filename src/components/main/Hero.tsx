'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Home, DollarSign, ArrowRight, Sparkles, Star, Phone, MessageSquare, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { openContactDialog } from '../layout/ContactDialog';



const Hero = ({ content: propContent }: { content?: any }) => {
  const router = useRouter();
  
  const [content, setContent] = useState<any>(propContent || {
    heroBgImage: '' // Initialize empty to prevent flicker
  });

  useEffect(() => {
    if (!propContent) {
      fetch('/api/content')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setContent((prev: any) => ({ ...prev, ...data.data }));
          }
        })
        .catch(err => console.error("Error fetching hero content:", err));
    } else {
      setContent(propContent);
    }
  }, [propContent]);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          {content.heroBgImage && (
            <Image
              src={content.heroBgImage}
              alt="Luxury Real Estate"
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Enhanced Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10 pointer-events-none" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-20 pt-20">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md text-primary border border-primary/30 mb-6"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">{content.heroBadgeText}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter"
          >
            {(content.heroTitle || 'Find Your Perfect Property').split(' ').map((word: string, i: number) => (
              <span key={i} className={word.toLowerCase() === 'perfect' ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-500 to-primary animate-gradient-x" : ""}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed font-light"
          >
            {content.heroSubtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <button
              onClick={() => router.push(content.heroCta1Link || '/properties')}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 group shadow-2xl shadow-primary/40"
            >
              <span>{content.heroCtaText || 'Explore Properties'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openContactDialog('book')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 group"
            >
              <span>{content.heroCta2Text || 'Book Site Visit'}</span>
              <Calendar size={20} className="group-hover:scale-110 transition-transform text-primary" />
            </button>
          </motion.div>
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};

export default Hero;

