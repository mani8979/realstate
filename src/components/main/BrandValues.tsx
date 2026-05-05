'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BrandValues = () => {
  const [content, setContent] = useState<any>({
    brandBadge: 'Our Core Pillars',
    brandTitle1: 'Why',
    brandTitle2: 'Choose Us',
    brandP1Side: 'Quality First',
    brandP1Title: 'Verified Properties',
    brandP1Desc: 'Every listing is manually verified by our team.',
    brandP2Side: 'Legally Secure',
    brandP2Title: 'Clear Documentation',
    brandP2Desc: '100% legal transparency and title clarity.',
    brandP3Side: 'Honest Deals',
    brandP3Title: '100% Transparency',
    brandP3Desc: 'No hidden costs. Direct registration.'
  });

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContent((prev: any) => ({ ...prev, ...data.data }));
        }
      })
      .catch(err => console.error("Error fetching brand content:", err));
  }, []);

  const values = [
    {
      sideHeading: content.brandP1Side,
      title: content.brandP1Title,
      desc: content.brandP1Desc
    },
    {
      sideHeading: content.brandP2Side,
      title: content.brandP2Title,
      desc: content.brandP2Desc
    },
    {
      sideHeading: content.brandP3Side,
      title: content.brandP3Title,
      desc: content.brandP3Desc
    }
  ];

  return (
    <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Side Heading - Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-4 lg:col-span-3 flex flex-col"
          >
            <div className="sticky top-32">
              <h2 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">{content.brandBadge}</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9]">
                {content.brandTitle1}<br/><span className="text-primary italic">{content.brandTitle2}</span>
              </h3>
              <div className="w-16 h-1 bg-primary mt-8 rounded-full" />
            </div>
          </motion.div>

          {/* Data - Right Column */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-16">
            {values.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.15, 
                  ease: [0.21, 1.11, 0.81, 0.99] 
                }}
                className="group border-b border-gray-100 dark:border-white/5 pb-16 last:border-0 relative"
              >
                {/* Decorative background number */}
                <div className="absolute -left-8 -top-8 text-[120px] font-black text-gray-200 dark:text-white/10 z-0 select-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4">
                  0{i + 1}
                </div>
                
                <div className="relative z-10 pl-4 md:pl-12 border-l-2 border-transparent group-hover:border-primary transition-colors duration-500">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-primary"></span>
                    {item.sideHeading}
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default BrandValues;
