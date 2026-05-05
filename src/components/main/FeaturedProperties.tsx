'use client';

import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { ArrowRight, ShieldCheck, FileText, CheckCircle2, Sparkles, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturedProperties = ({ properties = [] }: { properties?: any[] }) => {
  const [content, setContent] = useState<any>({
    featuredBadgeText: 'Investment Opportunities',
    featuredTitle: 'Featured',
    featuredSubtitle: 'Collections',
    featuredCtaText: 'Explore All Listings',
    featuredBannerTitle: 'High Demand Area',
    featuredBannerText: 'Limited Lands Available: Only 5 Left!'
  });

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContent((prev: any) => ({ ...prev, ...data.data }));
        }
      })
      .catch(err => console.error("Error fetching featured content:", err));
  }, []);

  const displayProperties = properties.map((p, index) => ({
    ...p,
    isHot: p.isHot ?? (index % 2 === 0),
    isNew: p.isNew ?? (index % 3 === 0)
  }));

  if (displayProperties.length === 0) return null;

  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-x-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">
              <Sparkles size={14} />
              <span>{content.featuredBadgeText}</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase">
              {content.featuredTitle} <br /> <span className="text-primary italic">{content.featuredSubtitle}</span>
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/properties"
              className="group flex items-center gap-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-xl"
            >
              <span>{content.featuredCtaText}</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Urgency Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="text-amber-500" />
            <p className="text-amber-500 font-black uppercase tracking-widest text-[10px]">{content.featuredBannerTitle}</p>
          </div>
          <div className="h-4 w-[1px] bg-amber-500/20 hidden md:block" />
          <div className="flex items-center gap-3">
            <Clock className="text-amber-500 animate-pulse" />
            <p className="text-slate-900 dark:text-white font-bold">{content.featuredBannerText}</p>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {displayProperties.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProperties;
