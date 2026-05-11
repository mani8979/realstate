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

      <div className="container mx-auto px-6 relative z-20 pt-20 md:pt-32">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md text-primary border border-primary/30 mb-8"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">{content.heroBadgeText || 'Premium Living'}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-8xl font-black text-black dark:text-white mb-8 leading-[1.1] md:leading-tight tracking-tighter uppercase"
          >
            {(content.heroTitle || 'Find Your Perfect Property').split(' ').map((word: string, i: number) => (
              <span key={i} className={word.toLowerCase() === 'perfect' || word.toLowerCase() === 'signature' ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-500 to-primary animate-gradient-x" : ""}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium"
          >
            {content.heroSubtitle || 'Discover exclusive lands and luxury developments tailored for your vision.'}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6"
          >
            <button
              onClick={() => router.push(content.heroCta1Link || '/properties')}
              className="w-full sm:w-auto bg-primary hover:bg-white text-black dark:text-white hover:text-black font-black px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-primary/30 uppercase tracking-widest text-xs"
            >
              <span>{content.heroCtaText || 'Explore Portfolio'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openContactDialog('book')}
              className="w-full sm:w-auto bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 backdrop-blur-md text-black dark:text-white border border-black/10 dark:border-white/10 font-black px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
            >
              <span>{content.heroCta2Text || 'Site Visit'}</span>
              <Calendar size={20} className="group-hover:scale-110 transition-transform text-primary" />
            </button>
            <a
              href={content.heroCta3Link || '#'}
              target="_blank"
              className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 backdrop-blur-md text-black dark:text-white border border-primary/20 font-black px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
            >
              <span>{content.heroCta3Text || 'Updates'}</span>
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-primary animate-pulse" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};

export default Hero;

