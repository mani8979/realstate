'use client';

import React from 'react';
import { motion } from 'framer-motion';

const GetInTouch = ({ content }: { content?: any }) => {
  return (
    <section className="bg-black text-white pt-28 pb-12 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Large Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[40px] md:text-[120px] font-black text-center uppercase tracking-tighter leading-none mb-10 md:mb-32"
        >
          {content?.getInTouchTitle || 'GET IN TOUCH'}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-32 items-start max-w-6xl mx-auto border-t border-white/10 pt-10 md:pt-20">
          {/* Inquiries */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
              {content?.getInTouchInquiryLabel || 'INQUIRIES'}
            </p>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-6xl font-black tracking-tighter">
                {content?.getInTouchPhone || '+91 96660 80645'}
              </h3>
              <p className="text-gray-400 font-bold text-sm md:text-base">
                {content?.getInTouchAvailability || 'Available Daily, 10AM-7PM'}
              </p>
            </div>
          </motion.div>

          {/* Office */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
              {content?.getInTouchOfficeLabel || 'MAIN OFFICE'}
            </p>
            <div className="space-y-4 md:space-y-8">
              <h3 className="text-xl md:text-4xl font-black leading-tight tracking-tight max-w-md">
                {content?.getInTouchAddress || 'Flat No.202,Backside Complex,Opposite of DMART,Srinagar,Gajuwaka Visakhapatnam, AP,530026'}
              </h3>
              <p className="text-gray-400 font-bold text-sm md:text-base">
                {content?.getInTouchFooter || 'Visit us for a coffee and a chat.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
