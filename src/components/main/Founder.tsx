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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Photo & Professional Summary */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-10"
          >
            <div className={`relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group ${isMain ? 'ring-2 ring-primary/40' : ''}`}>
              <img 
                src={image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000"} 
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              {/* Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 py-6 text-center">
                <p className="text-2xl font-black text-white uppercase tracking-[0.2em]">{name}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{role}</p>
              </div>
            </div>

            {/* Experience Highlights below Photo */}
            {isMain && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-sm space-y-6"
              >
                <h4 className="text-primary font-black uppercase tracking-[0.2em] text-xs border-b border-primary/20 pb-4">Professional Highlights</h4>
                <ul className="space-y-4">
                   {[
                     "18+ Years of Experience in Real Estate",
                     "Worked as General Manager at Sri Sai Infra for 11 Years",
                     "Expertise in Plots, Flats, Farm Lands & Apartments",
                     "Specialized Knowledge in Panchayat Layouts, VUDA & VMRDA Projects",
                     "Strong Leadership in Real Estate Marketing",
                     "Excellent Customer Relationship & Property Consultation Skills"
                   ].map((item, idx) => (
                     <li key={idx} className="flex gap-4 items-start text-sm text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <span className="leading-relaxed">{item}</span>
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
            className="lg:col-span-7 space-y-12"
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-8 bg-primary" />
                  <h2 className="text-primary font-black uppercase tracking-[0.5em] text-xs drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]">
                    Leadership Profile
                  </h2>
                </div>
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.95] drop-shadow-2xl">
                The Founder's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-amber-400">Vision</span>
              </h3>
            </div>

            <div className="relative">
              <Quote size={64} className="absolute -top-8 -left-8 text-primary/10" />
              <p className="text-2xl md:text-3xl text-gray-100 font-light leading-relaxed italic relative z-10 pl-10 border-l-4 border-primary/50 py-2">
                "Our vision is to provide trusted, legally verified, and value-driven real estate opportunities while building long-term relationships through transparency and commitment."
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6 backdrop-blur-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Executive Summary</h4>
              <p className="text-gray-300 text-lg leading-relaxed font-medium italic">
                {bio}
              </p>
            </div>

            {isMain && (
              <div className="flex flex-wrap gap-10 lg:gap-16 pt-8 border-t border-white/10">
                <div className="space-y-2">
                  <p className="text-4xl lg:text-5xl font-black text-white">18+</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Years of Trust</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl lg:text-5xl font-black text-white">100%</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Transparency</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl lg:text-5xl font-black text-white">Infinite</p>
                  <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Commitment</p>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>

        </div>
      </div>
    </section>
  );
};

export default Founder;
