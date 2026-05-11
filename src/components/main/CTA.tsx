'use client';

import React from 'react';
import { Phone, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { openContactDialog } from '../layout/ContactDialog';

const CTA = ({ content }: { content?: any }) => {
  const phoneNumber = (content?.ctaSectionBtn2 || '919123456789').replace(/\s+/g, '');
  
  return (
    <section className="py-24 md:py-32 relative overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-slate-50 dark:bg-slate-900 p-8 md:p-32 text-center border border-black/10 dark:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
             <Image 
               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000" 
               alt="Luxury Interior" 
               fill
               className="object-cover opacity-20 md:opacity-30"
             />
             <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-primary/20" />
          </div>
          
          {/* Abstract Elements */}
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] md:blur-[120px]" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary mb-6 md:mb-8 backdrop-blur-md">
               <Sparkles size={12} className="animate-pulse" />
               <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Exclusive Consultation</span>
            </div>
            
            <h2 className="text-4xl md:text-8xl font-black text-black dark:text-white mb-6 md:mb-10 leading-[1.1] md:leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
               {content?.ctaSectionTitle || 'Ready to claim\nyour Signature land?'}
            </h2>
            
            <p className="text-base md:text-2xl text-gray-600 dark:text-gray-400 mb-10 md:mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
               {content?.ctaSectionDesc || "Join 1,000+ happy homeowners in Vizag's most prestigious communities. Limited units available for immediate registration."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <button
                onClick={() => openContactDialog('book')}
                className="w-full sm:w-auto bg-primary hover:bg-white text-black dark:text-white hover:text-black font-black px-8 md:px-12 py-5 md:py-6 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-primary/20 uppercase tracking-widest text-[10px] md:text-xs"
              >
                <span>{content?.ctaSectionBtn1 || 'Schedule a Site Visit'}</span>
                <Calendar size={18} className="group-hover:scale-110 transition-transform" />
              </button>
              <a
                href={`tel:${phoneNumber}`}
                className="w-full sm:w-auto bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 text-black dark:text-white font-black px-8 md:px-12 py-5 md:py-6 rounded-2xl border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md uppercase tracking-widest text-[10px] md:text-xs group"
              >
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary group-hover:text-black transition-all">
                  <Phone size={16} />
                </div>
                <span>{content?.ctaSectionBtn2 || '+91 91234 56789'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
