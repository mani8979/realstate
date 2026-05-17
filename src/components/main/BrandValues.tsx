'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles } from 'lucide-react';

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
      desc: content.brandP1Desc,
      image: content.brandP1Image
    },
    {
      sideHeading: content.brandP2Side,
      title: content.brandP2Title,
      desc: content.brandP2Desc,
      image: content.brandP2Image
    },
    {
      sideHeading: content.brandP3Side,
      title: content.brandP3Title,
      desc: content.brandP3Desc,
      image: content.brandP3Image
    },
    {
      sideHeading: content.brandP4Side || 'Vizag Expert',
      title: content.brandP4Title || 'Personalized Care',
      desc: content.brandP4Desc || 'We help you find the property that matches your lifestyle.',
      image: content.brandP4Image
    }
  ];

  return (
    <section id="why-choose-us-section" className="py-20 md:py-40 !bg-[#064e3b] dark:!bg-[#064e3b] overflow-hidden relative border-y-8 border-[#10b981]/20">
      {/* Royal Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-full bg-[#10b981]/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Royal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-32 gap-8 md:gap-12">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#10b981] font-black uppercase tracking-[0.6em] text-[10px] mb-6 md:mb-8 flex items-center gap-4 md:gap-6"
            >
              <span className="w-12 md:w-16 h-[2px] bg-[#10b981]"></span>
              {content.brandBadge}
            </motion.p>
            
            <h3 className="text-4xl md:text-7xl lg:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.8]">
              {content.brandTitle1} <span className="text-primary block italic mt-2 md:mt-4 lowercase">{content.brandTitle2}</span>
            </h3>
          </div>
          
          <div className="hidden lg:block text-right">
             <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                <Leaf className="text-primary mb-6" size={48} />
                <p className="text-white/60 font-medium max-w-[200px] text-sm">{content.brandDesc || 'Dedicated to creating sustainable and premium living environments.'}</p>
             </div>
          </div>
        </div>

        {/* Emerald Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {values.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="h-full p-4 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-lg transition-all duration-700 hover:bg-white hover:border-white hover:-translate-y-4 overflow-hidden relative flex flex-col justify-between min-h-[290px] md:min-h-[500px] min-w-0 w-full">
                {/* Image Background */}
                {item.image && !item.title?.toLowerCase().includes('verified') && (
                  <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b] via-transparent to-[#064e3b]" />
                  </div>
                )}

                {/* Massive background number */}
                <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 text-5xl md:text-[10rem] font-black text-white/[0.03] group-hover:text-primary/10 transition-colors pointer-events-none">
                  {i + 1}
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 md:w-16 md:h-16 bg-[#10b981] group-hover:bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 shadow-2xl transition-all duration-500 group-hover:rotate-[360deg]">
                      <Sparkles className="size-[18px] md:size-[28px]" />
                    </div>
                    
                    <div>
                      <h4 className="text-[11px] sm:text-sm md:text-3xl font-black text-white group-hover:text-slate-900 mb-3 md:mb-6 uppercase tracking-normal md:tracking-tighter leading-tight md:leading-tight transition-colors w-full">
                        {item.title ? item.title.split(' ').map((word: string, idx: number) => (
                          <span key={idx} className="block md:inline md:mr-1.5 last:mr-0">
                            {word}
                          </span>
                        )) : ''}
                      </h4>
                      
                      <p className="text-[10px] md:text-base text-white/60 group-hover:text-slate-600 leading-snug md:leading-relaxed font-medium transition-colors break-words">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-10 inline-flex items-center gap-1.5 md:gap-3 text-[#10b981] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[7px] md:text-[10px] py-1.5 px-3 md:py-3 md:px-5 bg-white/5 rounded-full group-hover:bg-primary/10 transition-colors w-fit shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
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
