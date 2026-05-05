'use client';

import React from 'react';
import { Phone, MessageSquare, Calendar, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileStickyBar = () => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
    >
      <div className="mx-4 mb-6">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-2 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          <a 
            href="tel:+1234567890"
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-white hover:text-primary transition-colors"
          >
            <div className="bg-white/10 p-2 rounded-xl">
              <Phone size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Call Now</span>
          </a>
          
          <a 
            href="https://wa.me/1234567890"
            target="_blank"
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-white hover:text-green-500 transition-colors"
          >
            <div className="bg-green-500/20 p-2 rounded-xl text-green-500">
              <MessageSquare size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
          </a>

          <div className="w-[1px] h-10 bg-white/10 mx-2" />

          <button 
            onClick={() => window.scrollTo({ top: document.getElementById('contact')?.offsetTop || 0, behavior: 'smooth' })}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
          >
            <Calendar size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Book Visit</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileStickyBar;
