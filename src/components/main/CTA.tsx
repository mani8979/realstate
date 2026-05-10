'use client';

import React from 'react';
import { Phone, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { openContactDialog } from '../layout/ContactDialog';

const CTA = ({ content }: { content?: any }) => {
  const phoneNumber = (content?.ctaSectionBtn2 || '919123456789').replace(/\s+/g, '');
  
  return (
    <section className="py-32 relative overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[4rem] overflow-hidden bg-slate-900 p-12 md:p-32 text-center border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
             <Image 
               src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000" 
               alt="Luxury Interior" 
               fill
               className="object-cover opacity-30"
             />
             <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-primary/20" />
          </div>
          
          {/* Abstract Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px]" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary mb-8 backdrop-blur-md">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Exclusive Consultation</span>
            </div>
            
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
               {content?.ctaSectionTitle || 'Ready to claim\nyour Signature land?'}
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-16 leading-relaxed max-w-2xl mx-auto font-light">
               {content?.ctaSectionDesc || "Join 1,000+ happy homeowners in Vizag's most prestigious communities. Limited units available for immediate registration."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => openContactDialog('book')}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black px-12 py-6 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-primary/40 uppercase tracking-widest text-xs"
              >
                <span>{content?.ctaSectionBtn1 || 'Schedule a Site Visit'}</span>
                <Calendar size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <a
                href={`tel:${phoneNumber}`}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-black px-12 py-6 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-md uppercase tracking-widest text-xs"
              >
                <Phone size={20} className="text-primary" />
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
