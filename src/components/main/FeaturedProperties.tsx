'use client';

import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, Sparkles, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturedProperties = ({ properties = [], content: propContent }: { properties?: any[], content?: any }) => {
  const [content, setContent] = useState<any>(propContent || {
    featuredBadgeText: 'Investment Opportunities',
    featuredTitle: 'Featured',
    featuredSubtitle: 'Collections',
    featuredCtaText: 'Explore All Listings',
    featuredBannerTitle: 'High Demand Area',
    featuredBannerText: 'Limited Lands Available: Only 5 Left!'
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
        .catch(err => console.error("Error fetching featured content:", err));
    } else {
      setContent(propContent);
    }
  }, [propContent]);

  const displayProperties = properties.map((p, index) => ({
    ...p,
    isHot: p.isHot ?? (index % 2 === 0),
    isNew: p.isNew ?? (index % 3 === 0)
  }));

  if (displayProperties.length === 0) return null;

  return (
    <section id="featured-properties-section" className="py-40 !bg-black dark:!bg-black overflow-x-hidden relative border-b-8 border-white/5">
      {/* Cinematic Tech Elements */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* Side Label */}
      <div className="absolute left-0 top-1/2 -rotate-90 origin-left translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-[1em] select-none">
        INVESTMENT PORTFOLIO
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Cinematic Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.5em] text-[10px] mb-8">
              <div className="w-16 h-[2px] bg-primary" />
              <span>{content.featuredBadgeText}</span>
            </div>
            <h3 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter uppercase mb-0">
              {content.featuredTitle} <br /> 
              <span className="text-primary italic font-light lowercase">
                {content.featuredSubtitle}
              </span>
            </h3>
            
            {/* Explicit Separation Line */}
            <div className="w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent mt-12 mb-2" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-10 lg:text-right lg:items-end"
          >
            <p className="text-gray-400 max-w-sm text-xl font-medium leading-relaxed">
              Exquisite properties defined by architectural brilliance and prime positioning.
            </p>
            <Link
              href="/properties"
              className="group w-fit flex items-center gap-6 bg-primary text-white px-12 py-7 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all shadow-[0_30px_60px_rgba(212,175,55,0.3)]"
            >
              <span>{content.featuredCtaText}</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* High Performance Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 p-12 rounded-[4rem] backdrop-blur-2xl flex flex-col md:flex-row md:items-center gap-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <Sparkles className="text-primary/20" size={120} />
          </div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-primary flex items-center justify-center rounded-[2rem] shadow-2xl shadow-primary/40">
              <TrendingUp className="text-white" size={32} />
            </div>
            <div>
              <p className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-3">{content.featuredBannerTitle}</p>
              <p className="text-white font-black text-3xl md:text-4xl tracking-tighter">{content.featuredBannerText}</p>
            </div>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-24">
          {displayProperties.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProperties;
