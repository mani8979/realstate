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
    <section className={`relative py-32 overflow-hidden ${isMain ? 'bg-zinc-950' : 'bg-black'}`}>
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-1/2 h-full ${isMain ? 'bg-primary/20' : 'bg-primary/10'} blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-60`} />
      <div className={`absolute bottom-0 left-0 w-1/3 h-1/2 ${isMain ? 'bg-amber-500/10' : 'bg-blue-500/10'} blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-60`} />

      <div className="container mx-auto px-6 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-start ${!isMain ? 'lg:direction-rtl' : ''}`}>
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`lg:col-span-5 relative ${!isMain ? 'lg:order-last' : ''}`}
          >
            <div className={`relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group ${isMain ? 'ring-2 ring-primary/40' : ''}`}>
              <img 
                src={image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000"} 
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              {/* Name at very bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 py-8 text-center">
                <p className="text-3xl font-black text-white uppercase tracking-[0.25em] drop-shadow-md">{name}</p>
              </div>
            </div>
            
            {/* Experience Card */}
            <motion.div 
              initial={{ x: isMain ? 50 : -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className={`absolute ${isMain ? '-right-10' : '-left-10'} top-1/4 bg-primary p-8 rounded-3xl shadow-[0_20px_50px_rgba(255,107,0,0.3)] hidden md:block border border-white/20`}
            >
              <div className="flex items-center gap-5">
                <Trophy size={40} className="text-white drop-shadow-lg" />
                <div>
                  <p className="text-4xl font-black text-white leading-none drop-shadow-md">{experienceYears}</p>
                  <p className="text-[10px] font-black uppercase text-white tracking-[0.2em] mt-1">Years Experience</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: isMain ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-primary" />
                  <h2 className="text-primary font-black uppercase tracking-[0.5em] text-xs drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]">
                    {isMain ? 'Founder / Leadership' : 'Co-Founder / Director'}
                  </h2>
                </div>
                <h4 className="text-white/80 font-bold uppercase tracking-[0.25em] text-lg pl-10">{role}</h4>
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95] drop-shadow-2xl">
                {isMain ? 'Leading the' : 'Driving our'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-amber-400 drop-shadow-sm">{isMain ? 'Vision' : 'Growth'}</span>
              </h3>
            </div>

            <div className="relative">
              <Quote size={64} className="absolute -top-8 -left-8 text-primary/10" />
              <p className="text-2xl md:text-3xl text-gray-100 font-light leading-relaxed italic relative z-10 pl-10 border-l-4 border-primary/50 py-2">
                {bio}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <Target size={24} className="text-primary" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white underline decoration-primary/50 underline-offset-8">
                  {isMain ? 'The Founder\'s Vision' : 'The Mission Forward'}
                </h4>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed font-medium">
                {vision}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expertise.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group/item hover:bg-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-lg">
                    <Shield size={18} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wider group-hover/item:text-primary transition-colors">{item}</span>
                </div>
              ))}
            </div>

            {isMain && (
              <div className="flex flex-wrap gap-12 pt-8 border-t border-white/10">
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white drop-shadow-lg">18+</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] drop-shadow-sm">Years of Trust</p>
                </div>
                <div className="w-px h-16 bg-white/20 hidden md:block" />
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white drop-shadow-lg">100%</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] drop-shadow-sm">Transparency</p>
                </div>
                <div className="w-px h-16 bg-white/20 hidden md:block" />
                <div className="space-y-2">
                  <p className="text-4xl font-black text-white drop-shadow-lg">Infinite</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] drop-shadow-sm">Commitment</p>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Founder;
