'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Trophy, Shield, Target } from 'lucide-react';

interface FounderProps {
  name: string;
  role: string;
  bio: string;
  vision: string;
  exp: string;
  image: string;
  experienceYears?: string;
  isMain?: boolean;
}

const Founder: React.FC<FounderProps> = ({ 
  name, role, bio, vision, exp, image, experienceYears = "18+", isMain = false 
}) => {
  if (!name) return null;

  const expertise = exp ? exp.split('\n') : [];

  return (
    <section className={`relative py-20 md:py-32 overflow-hidden ${isMain ? 'bg-zinc-950' : 'bg-white dark:bg-black'}`}>
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full ${isMain ? 'bg-primary/20' : 'bg-primary/10'} blur-[80px] md:blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-60`} />
      <div className={`absolute bottom-0 left-0 w-full md:w-1/3 h-1/2 ${isMain ? 'bg-amber-500/10' : 'bg-blue-500/10'} blur-[80px] md:blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-60`} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* Left Side: Photo & Professional Summary */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-8 md:space-y-10"
          >
            <div className={`relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-black/20 dark:border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group ${isMain ? 'ring-2 ring-primary/40' : ''}`}>
              <img 
                src={image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000"} 
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 md:opacity-80" />
              
              {/* Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black/80 md:bg-white dark:bg-black/60 backdrop-blur-md border-t border-black/10 dark:border-white/10 py-5 md:py-6 text-center">
                <p className="text-xl md:text-2xl font-black text-black dark:text-white uppercase tracking-[0.2em]">{name}</p>
                <p className="text-[9px] md:text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{role}</p>
              </div>
            </div>

            {/* Experience Highlights below Photo */}
            {expertise.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-sm space-y-6"
              >
                <h4 className="text-primary font-black uppercase tracking-[0.2em] text-[10px] md:text-xs border-b border-primary/20 pb-4">Professional Highlights</h4>
                <ul className="space-y-4">
                   {expertise.map((item, idx) => (
                     <li key={idx} className="flex gap-4 items-start text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <span className="leading-relaxed font-medium">{item}</span>
                     </li>
                   ))}
                </ul>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side: Vision & Bio */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-10 md:space-y-12"
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit">
                   <Target size={14} className="animate-pulse" />
                   <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Leadership Profile</span>
                </span>
              </div>
              <h3 className="text-4xl md:text-7xl font-black text-black dark:text-white uppercase tracking-tighter leading-[1.1] md:leading-[0.95]">
                The {isMain ? "Founder's" : "Co-Founder's"} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-amber-400">Vision</span>
              </h3>
            </div>

            <div className="relative">
              <Quote size={48} className="md:size-16 absolute -top-6 -left-6 md:-top-8 md:-left-8 text-primary/10" />
              <p className="text-xl md:text-3xl text-gray-100 font-medium leading-relaxed italic relative z-10 pl-8 md:pl-10 border-l-4 border-primary/50 py-2">
                "{vision || "Our vision is to provide trusted, legally verified, and value-driven real estate opportunities while building long-term relationships through transparency and commitment."}"
              </p>
            </div>

            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] space-y-6 backdrop-blur-sm">
              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-primary">Executive Summary</h4>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed font-medium italic">
                {bio}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-16 pt-8 border-t border-black/10 dark:border-white/10 text-center md:text-left">
              <div className="space-y-2">
                <p className="text-3xl md:text-5xl font-black text-black dark:text-white">{experienceYears}</p>
                <p className="text-[8px] md:text-[10px] font-black uppercase text-primary tracking-[0.2em] md:tracking-[0.3em]">Trust</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-5xl font-black text-black dark:text-white">100%</p>
                <p className="text-[8px] md:text-[10px] font-black uppercase text-primary tracking-[0.2em] md:tracking-[0.3em]">Honesty</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-5xl font-black text-black dark:text-white">Full</p>
                <p className="text-[8px] md:text-[10px] font-black uppercase text-primary tracking-[0.2em] md:tracking-[0.3em]">Value</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Founder;
