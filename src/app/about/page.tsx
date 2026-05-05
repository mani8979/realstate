'use client';

import React from 'react';
import WhyChooseUs from '@/components/main/WhyChooseUs';
import CTA from '@/components/main/CTA';
import { Home, Users, Award, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">About Our Company</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            We are a team of dedicated professionals committed to providing the best real estate solutions. Our mission is to help you find your dream home with ease and transparency.
          </p>
        </div>

        {/* Brand Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { 
              label: 'Verified Properties', 
              value: 'Expert Verification', 
              description: 'Every listing is manually verified by our team for quality and legality.',
              icon: Award 
            },
            { 
              label: 'Clear Documentation', 
              value: '100% Legal Clarity', 
              description: 'Complete transparency in titles and documentation for every project.',
              icon: MapPin 
            },
            { 
              label: '100% Transparency', 
              value: 'Zero Hidden Costs', 
              description: 'No hidden charges. Direct registration. Honest pricing always.',
              icon: Sparkles 
            },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ 
                duration: 0.8, 
                delay: i * 0.1, 
                ease: [0.21, 1.11, 0.81, 0.99] 
              }}
              className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group hover:border-primary transition-all"
            >
              <div className="bg-primary/10 text-primary p-4 rounded-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon size={32} />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{stat.value}</h3>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-4">{stat.label}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <WhyChooseUs />
        
        {/* Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Our vision is to be the most trusted and preferred real estate partner globally, known for our integrity, expertise, and innovative solutions.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              We strive to empower our clients through expert guidance, cutting-edge technology, and a deep understanding of the local market.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000" 
              alt="Office" 
              className="rounded-[3rem] shadow-2xl h-[500px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 rounded-[3rem]"></div>
          </div>
        </div>

        <CTA />
      </div>
    </div>
  );
};

export default AboutPage;
