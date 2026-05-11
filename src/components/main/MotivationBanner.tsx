'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

interface MotivationBannerProps {
  content: any;
}

const MotivationBanner: React.FC<MotivationBannerProps> = ({ content }) => {
  if (!content.motivationLine) return null;

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.motivationBgImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000"}
          alt="Motivation Background"
          fill
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white dark:bg-black/60 backdrop-blur-[2px] z-10" />
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Quote size={64} className="mx-auto text-primary mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter leading-tight mb-8 drop-shadow-2xl">
            "{content.motivationLine}"
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]" />
        </motion.div>
      </div>

      {/* Parallax Decor */}
      <div className="absolute -bottom-1 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-20" />
    </section>
  );
};

export default MotivationBanner;
