'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BrandValues = ({ content: propContent }: { content?: any }) => {
  const [content, setContent] = useState<any>(propContent || {
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
    if (!propContent) {
      fetch('/api/content')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setContent((prev: any) => ({ ...prev, ...data.data }));
          }
        })
        .catch(err => console.error("Error fetching brand content:", err));
    } else {
      setContent(propContent);
    }
  }, [propContent]);

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
    <section id="values-section" className="py-40 !bg-[#064e3b] dark:!bg-[#064e3b] overflow-hidden relative border-y-8 border-[#10b981]/20">
      {/* Royal Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-full bg-[#10b981]/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Royal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#10b981] font-black uppercase tracking-[0.6em] text-[10px] mb-8 flex items-center gap-6"
            >
              <span className="w-16 h-[2px] bg-[#10b981]"></span>
              {content.brandBadge}
            </motion.p>
            
            <h3 className="text-7xl md:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.8]">
              {content.brandTitle1} <span className="text-primary block italic mt-4 lowercase">{content.brandTitle2}</span>
            </h3>
          </div>
          
          <div className="hidden lg:block text-right">
             <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                <Leaf className="text-primary mb-6" size={48} />
                <p className="text-white/60 font-medium max-w-[200px] text-sm">Dedicated to creating sustainable and premium living environments.</p>
             </div>
          </div>
        </div>

        {/* Emerald Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="h-full p-12 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-lg transition-all duration-700 hover:bg-white hover:border-white hover:-translate-y-8 overflow-hidden relative">
                {/* Massive background number */}
                <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-white/[0.03] group-hover:text-primary/10 transition-colors">
                  {i + 1}
                </div>

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-[#10b981] group-hover:bg-primary text-white rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl shadow-black/40 transition-all duration-500 group-hover:rotate-[360deg]">
                    <Sparkles size={32} />
                  </div>
                  
                  <h4 className="text-4xl font-black text-white group-hover:text-slate-900 mb-8 uppercase tracking-tighter leading-tight transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-white/60 group-hover:text-slate-600 leading-relaxed font-medium text-lg transition-colors">
                    {item.desc}
                  </p>
                  
                  <div className="mt-16 inline-flex items-center gap-4 text-[#10b981] font-black uppercase tracking-[0.4em] text-[10px] py-3 px-6 bg-white/5 rounded-full group-hover:bg-primary/10 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                    {item.sideHeading}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandValues;
