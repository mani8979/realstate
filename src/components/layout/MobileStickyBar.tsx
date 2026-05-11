'use client';

import React from 'react';
import { Phone, MessageSquare, Calendar, Home } from 'lucide-react';
import { motion } from 'framer-motion';

import { usePathname } from 'next/navigation';
import { openContactDialog } from './ContactDialog';

const MobileStickyBar = () => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.includes('/media');

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: isAdmin ? 100 : 0 }}
      className={`fixed bottom-0 left-0 right-0 z-[100] md:hidden ${isAdmin ? 'hidden' : ''}`}
    >
      <div className="mx-4 mb-6">
        <div className="bg-white dark:bg-black/80 backdrop-blur-2xl border border-black/20 dark:border-white/20 rounded-[2rem] p-2 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          <button 
            onClick={() => openContactDialog('call')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-black dark:text-white hover:text-primary transition-colors"
          >
            <div className="bg-black/10 dark:bg-white/10 p-2 rounded-xl text-primary">
              <Phone size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Call Now</span>
          </button>
          
          <button 
            onClick={() => openContactDialog('whatsapp')}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-black dark:text-white hover:text-green-500 transition-colors"
          >
            <div className="bg-green-500/20 p-2 rounded-xl text-green-500">
              <MessageSquare size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">WhatsApp</span>
          </button>

          <div className="w-[1px] h-10 bg-black/10 dark:bg-white/10 mx-2" />

          <button 
            onClick={() => openContactDialog('book')}
            className="flex-1 bg-primary text-black dark:text-white py-3 px-4 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transform active:scale-95 transition-transform"
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
