'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Trophy, Shield, Target } from 'lucide-react';
import Image from 'next/image';

interface FounderProps {
  content: any;
}

const Founder: React.FC<FounderProps> = ({ content }) => {
  if (!content.founderName) return null;

  const expertise = content.founderExp ? content.founderExp.split('\n') : [];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
              <Image 
                src={content.founderImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000"} 
                alt={content.founderName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Name at very bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 py-6 text-center">
                <p className="text-2xl font-black text-white uppercase tracking-[0.2em]">{content.founderName}</p>
              </div>
            </div>
            
            {/* Experience Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -right-8 top-1/4 bg-primary p-6 rounded-3xl shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-4">
                <Trophy size={32} className="text-white" />
                <div>
                  <p className="text-2xl font-black text-white leading-none">1.5+</p>
                  <p className="text-[8px] font-black uppercase text-white/80 tracking-widest">Years Experience</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-10"
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Leadership & Vision</h2>
                <h4 className="text-white/60 font-bold uppercase tracking-[0.2em] text-sm">{content.founderRole}</h4>
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white">Visionary</span>
              </h3>
            </div>

            <div className="relative">
              <Quote size={48} className="absolute -top-6 -left-6 text-primary/20" />
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed italic relative z-10 pl-6 border-l-2 border-primary/30">
                {content.founderBio}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-primary" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Our Shared Vision</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {content.founderVision}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expertise.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-transparent hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={14} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-10 pt-6">
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">500+</p>
                <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest text-center">Consultations</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest text-center">Legality</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="space-y-1">
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest text-center">Support</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Founder;

