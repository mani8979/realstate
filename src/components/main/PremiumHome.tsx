'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Leaf } from 'lucide-react';
import Link from 'next/link';
import StarBorder from './StarBorder';
import './ScrollStack.css';
import { openContactDialog } from '../layout/ContactDialog';

// --- Types ---
interface Property {
  _id: string;
  title: string;
  price: number;
  images: string[];
  location: string;
  type: string;
}

interface PremiumHomeProps {
  properties: Property[];
  content?: any;
}

// --- Components ---

const PremiumAbout = ({ content }: { content?: any }) => {
  return (
    <section className="py-16 md:py-32 w-full bg-[#0a0a0a] text-black dark:text-white font-sans px-6 md:px-12 lg:px-16 overflow-hidden relative border-t border-white/5">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 w-full max-w-[1400px] mx-auto relative z-10">
        
        {/* Left Column - Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-4 lg:col-span-4 pt-4 border-t border-black/10 dark:border-white/10"
        >
          <div className="flex items-center gap-4">
            <span className="w-8 h-[1px] bg-primary"></span>
            <h2 className="font-sans text-xs font-black uppercase tracking-[0.4em] text-primary">
              {content?.legacyBadge || 'Our Legacy & Values'}
            </h2>
          </div>
        </motion.div>

        {/* Right Column - Content */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-24">
          
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-6 relative"
          >
            <div className="absolute -left-4 md:-left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/50 to-transparent" />
            <h3 className="font-sans text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-black dark:text-white/40 mb-2">
              {content?.legacyTitle1 || '01. The Mission'}
            </h3>
            <div className="flex flex-col gap-8">
              <p className="font-sans text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter">
                {content?.legacyHeading1 || "Transforming Vizag's Landscape"}
              </p>
              <p className="font-sans text-lg md:text-2xl font-normal text-black dark:text-white/60 leading-relaxed tracking-tight max-w-2xl">
                {content?.legacyDesc1 || "We believe in creating sustainable, premium living environments that harmonize with nature while providing modern connectivity."}
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-6 relative"
          >
            <div className="absolute -left-4 md:-left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
            <h3 className="font-sans text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-black dark:text-white/40 mb-2">
              {content?.legacyTitle2 || '02. The Vision'}
            </h3>
            <ul className="flex flex-col gap-6 mt-4">
              <li className="font-sans text-2xl md:text-4xl font-black leading-tight tracking-tight flex items-center gap-6 group cursor-default">
                <span className="w-12 h-[1px] bg-white/20 group-hover:bg-primary group-hover:w-20 transition-all duration-500"></span>
                <span className="group-hover:text-primary transition-colors duration-500">{content?.legacyList1 || "Architectural Innovation"}</span>
              </li>
              <li className="font-sans text-2xl md:text-4xl font-black leading-tight tracking-tight flex items-center gap-6 group cursor-default">
                <span className="w-12 h-[1px] bg-white/20 group-hover:bg-primary group-hover:w-20 transition-all duration-500"></span>
                <span className="group-hover:text-primary transition-colors duration-500">{content?.legacyList2 || "Smart Community Living"}</span>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


const ScrollStackCard = ({ property, index, content }: { property: Property; index: number; content?: any }) => {
  return (
    <StarBorder
      as="div"
      className="scroll-stack-card"
      color="#10b981, #064e3b, #10b981"
      speed="10s"
    >
      <div className="card-top-row">
        <Link href={`/properties/${property._id}`} className="id-brand-group group/title">
          <span className="huge-number text-black dark:text-white group-hover/title:text-primary transition-colors">{(index + 1).toString().padStart(3, '0')}</span>
          <div className="client-info">
            <span className="label text-black dark:text-white uppercase tracking-widest text-[10px] md:text-xs group-hover/title:text-primary transition-colors">{property.title}</span>
            <span className="client-name text-black dark:text-white/40 uppercase tracking-widest text-[8px] md:text-[10px]">{property.location}</span>
          </div>
        </Link>
      </div>

      <div className="content-grid">
        <Link 
          href={`/properties/${property._id}`}
          className="main-image-container overflow-hidden rounded-[40px] bg-zinc-900 group/img block"
        >
          <img
            src={property.images[0]}
            className="main-image w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
            alt={property.title}
          />
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 flex items-center justify-center">
            <span className="bg-white dark:bg-black/60 backdrop-blur-md text-black dark:text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] border border-black/20 dark:border-white/20">
              View Experience
            </span>
          </div>
        </Link>
        <div className="project-description">
          <div className="space-y-6">
             <div>
                <p className="text-[#10b981] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Price Starting From</p>
                <p className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white">₹{property.price.toLocaleString('en-IN')}</p>
             </div>
             <p className="text-black dark:text-white/60 text-sm md:text-lg leading-relaxed font-medium">
                {content?.scrollStackDesc || "Premium residential lands situated in the most sought-after locations, offering the perfect blend of tranquility and urban connectivity."}
             </p>
             <div className="flex gap-4 pt-4">
                <span className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-full text-[9px] font-black text-black dark:text-white/60 uppercase tracking-[0.2em]">{property.type}</span>
                <span className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-full text-[9px] font-black text-black dark:text-white/60 uppercase tracking-[0.2em]">Immediate Registration</span>
             </div>
          </div>
        </div>
      </div>
    </StarBorder>
  );
};

const BASE_CONFIG = {
  itemDistance: 120,
  itemScale: 0.015,
  itemStackDistance: 24,
  stackPosition: 0.1,
  scaleEndPosition: 0.06,
  baseScale: 0.9,
};

const PremiumHome = ({ properties, content }: PremiumHomeProps) => {
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const stackInnerRef = useRef<HTMLDivElement>(null);
  const voidContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardOffsetsRef = useRef<number[]>([]);
  const endOffsetRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: footerContainerRef,
    offset: ["start end", "end end"]
  });

  const footerY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cachePositions = useCallback(() => {
    setReady(false);
    const cards = Array.from(document.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;
    cards.forEach(card => {
      card.style.transform = '';
      card.style.position = 'relative';
    });
    
    const scrollY = window.scrollY;
    cardOffsetsRef.current = cards.map(card => card.getBoundingClientRect().top + scrollY);
    const endElement = document.querySelector('.scroll-stack-end') as HTMLElement;
    if (endElement) endOffsetRef.current = endElement.getBoundingClientRect().top + scrollY;
    setReady(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(cachePositions, 500);
    window.addEventListener('resize', cachePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', cachePositions);
    };
  }, [cachePositions]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ready || isMobile) return;
      const scroll = window.scrollY;
      const cards = cardsRef.current;
      const cardOffsets = cardOffsetsRef.current;
      const containerHeight = window.innerHeight;
      
      if (!cards.length) return;

      const firstCardHeight = cards[0].offsetHeight;
      const stackPositionPx = (containerHeight - firstCardHeight) / 2;
      const scaleEndPositionPx = stackPositionPx - (BASE_CONFIG.stackPosition - BASE_CONFIG.scaleEndPosition) * containerHeight;

      cards.forEach((card, i) => {
        const cardTop = cardOffsets[i];
        const triggerStart = cardTop - stackPositionPx - BASE_CONFIG.itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPositionPx;
        const pinStart = triggerStart;
        const pinEnd = endOffsetRef.current - containerHeight * 0.5;

        let scaleProgress = 0;
        if (scroll >= triggerEnd) {
          scaleProgress = 1;
        } else if (scroll > triggerStart) {
          scaleProgress = (scroll - triggerStart) / (triggerEnd - triggerStart);
        }

        const targetScale = BASE_CONFIG.baseScale + i * BASE_CONFIG.itemScale;
        const scale = Number((1 - scaleProgress * (1 - targetScale)).toFixed(4));

        let translateY = 0;
        if (scroll >= pinStart && scroll <= pinEnd) {
          translateY = scroll - cardTop + stackPositionPx + BASE_CONFIG.itemStackDistance * i;
        } else if (scroll > pinEnd) {
          translateY = pinEnd - cardTop + stackPositionPx + BASE_CONFIG.itemStackDistance * i;
        }

        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ready, isMobile]);

  return (
    <div className="min-h-screen relative bg-white dark:bg-black selection:bg-[#10b981] selection:text-black dark:text-white font-sans">
      
      {/* About Section (New Zip Style) */}
      <PremiumAbout content={content} />

      {/* Featured Section with Marquee */}


      <div id="properties" className="relative z-20 bg-white dark:bg-black pt-10 md:pt-20">
         <div className="w-full h-[15vh] md:h-[25vh] lg:h-[35vh] overflow-hidden flex items-center relative z-10 bg-white dark:bg-black border-y border-white/5 shadow-2xl">
          <div className="marquee-selected-works">
            <div className="marquee-selected-works__track text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary opacity-80">
              {[0, 1, 2, 3].map((blockIndex) => (
                <div key={blockIndex} className="marquee-selected-works__segment flex items-center gap-12 px-6">
                  <span className="uppercase font-black tracking-tighter text-[8vw] md:text-[6vw]">
                    {content?.marqueeText || 'Featured Lands'}
                  </span>
                  <span className="text-primary text-[4vw] md:text-[3vw] opacity-50">❖</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={stackInnerRef} className="scroll-stack-inner px-6 md:px-12 lg:px-16 mt-8 md:mt-24">
          <div ref={voidContainerRef} className="relative w-full flex flex-col items-center justify-center gap-8 md:gap-0">
            {properties.slice(0, 5).map((property, index) => (
              <ScrollStackCard key={property._id} property={property} index={index} content={content} />
            ))}
          </div>
          <div className="scroll-stack-end h-[10vh] md:h-[50vh]" />
        </div>
      </div>


      {/* Footer Reveal Section */}
      <div ref={footerContainerRef} className="relative z-0 min-h-screen py-24 md:py-0 md:h-screen w-full overflow-hidden bg-[#050505] text-black dark:text-white flex flex-col items-center justify-center">
        <motion.div style={{ y: isMobile ? 0 : footerY }} className="text-center px-6 w-full max-w-6xl">
           <p className="text-[#10b981] uppercase text-[10px] font-black tracking-[0.5em] mb-8">Ready to Invest?</p>
           <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter mb-16 md:mb-24">{content?.footerTitle || 'GET IN TOUCH'}</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 text-center md:text-left border-t border-black/10 dark:border-white/10 pt-16">
              <div>
                 <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest mb-6">{content?.footerInquiriesLabel || 'Inquiries'}</p>
                 <p className="text-3xl md:text-5xl font-black tracking-tighter hover:text-[#10b981] transition-colors cursor-pointer">{content?.footerPhone || '+91 91234 56789'}</p>
                 <p className="text-lg md:text-xl text-black dark:text-white/40 mt-2">{content?.footerPhoneSub || 'Available Mon-Sat, 9AM-7PM'}</p>
              </div>
              <div>
                 <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest mb-6">{content?.footerOfficeLabel || 'Main Office'}</p>
                 <p className="text-2xl md:text-4xl font-bold leading-tight whitespace-pre-line">{content?.footerAddress || 'Beach Road, MVP Colony,\nVisakhapatnam, AP'}</p>
                 <p className="text-lg md:text-xl text-black dark:text-white/40 mt-4 font-medium">{content?.footerAddressSub || 'Visit us for a coffee and a chat.'}</p>
              </div>
           </div>
           
           <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
              <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] text-center md:text-left">{content?.footerCopyright || '© 2026 STAR LANDS DEVELOPERS GROUP'}</p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                 <a href="/interior" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black dark:text-white transition-colors">{content?.footerService1 || 'Luxury Interior'}</a>
                 <a href="/consultation" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black dark:text-white transition-colors">{content?.footerService2 || 'Exclusive Consultation'}</a>
                 <a href="/privacy" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black dark:text-white transition-colors">Privacy Policy</a>
                 <a href="/terms" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black dark:text-white transition-colors">Terms of Service</a>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumHome;
