'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Zap, Heart, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs = ({ content }: { content?: any }) => {
  const [data, setData] = React.useState<any>(content || {
    brandBadge: 'Our Core Pillars',
    brandTitle1: 'Why',
    brandTitle2: 'Choose Us',
    brandDesc: 'Dedicated to creating sustainable and premium living environments.',
    brandP1Side: 'Quality First',
    brandP1Title: 'Verified Properties',
    brandP1Desc: 'Every listing is manually verified by our team.',
    brandP1Image: '',
    brandP2Side: 'Legally Secure',
    brandP2Title: 'Clear Documentation',
    brandP2Desc: '100% legal transparency and title clarity.',
    brandP2Image: '',
    brandP3Side: 'Honest Deals',
    brandP3Title: '100% Transparency',
    brandP3Desc: 'No hidden costs. Direct registration.',
    brandP3Image: '',
    brandP4Side: 'Vizag Expert',
    brandP4Title: 'Personalized Care',
    brandP4Desc: 'We help you find the property that matches your lifestyle.',
    brandP4Image: '',
    aboutTeamTitle: 'Real Estate Team Excellence',
    aboutTeamDesc: 'Collaborative professionals working for your success.',
    aboutTeamImage: '/uploads/for.webp',
    aboutYearTitle: '15+ Years of Service',
    aboutYearDesc: 'A legacy built on results and trust since 2007.',
    aboutYearImage: '',
  });

  React.useEffect(() => {
    if (!content) {
      fetch('/api/content')
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data) setData((prev: any) => ({ ...prev, ...res.data }));
        });
    } else {
      setData(content);
    }
  }, [content]);

  const features = [
    {
      sideHeading: data.brandP1Side,
      title: data.brandP1Title,
      desc: data.brandP1Desc,
      icon: UserCheck,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      sideHeading: data.brandP2Side,
      title: data.brandP2Title,
      desc: data.brandP2Desc,
      icon: ShieldCheck,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      sideHeading: data.brandP3Side,
      title: data.brandP3Title,
      desc: data.brandP3Desc,
      icon: Zap,
      color: 'text-amber-500 bg-amber-500/10'
    },
    {
      sideHeading: data.brandP4Side || 'Vizag Expert',
      title: data.brandP4Title || 'Personalized Care',
      desc: data.brandP4Desc || 'We help you find the property that matches your lifestyle.',
      icon: Heart,
      color: 'text-primary bg-primary/10'
    }
  ];

  return (
    <section id="why-choose-us-section" className="py-32 bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] group">
              <img 
                src={data.aboutTeamImage || "/uploads/for.webp"} 
                alt="Real Estate Team" 
                className="w-full h-[700px] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
              
              {/* Experience Badge */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-12 right-12 bg-primary p-12 rounded-[3rem] text-black dark:text-white shadow-2xl z-20 border border-black/20 dark:border-white/20 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-2">
                   <Award size={24} className="text-amber-300" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">{data.aboutTeamTitle?.split(' ')[0] || 'Excellence'}</span>
                </div>
                <div className="text-7xl font-black mb-2 tracking-tighter">{data.aboutYearTitle?.split(' ')[0] || '15+'}</div>
                <div className="text-xs font-black uppercase tracking-widest opacity-80">{data.aboutYearTitle?.split(' ').slice(1).join(' ') || 'Years of Service'}</div>
              </motion.div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
          </motion.div>

          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                 <Sparkles size={14} />
                 <span>{data.brandBadge || 'Our Core Pillars'}</span>
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-black dark:text-white mb-8 leading-[0.9] tracking-tighter uppercase">
                {data.brandTitle1 || 'Why'} <br /> <span className="text-primary italic">{data.brandTitle2 || 'Choose Us'}</span>
              </h3>
              <p className="text-gray-500 dark:text-gray-600 dark:text-gray-400 text-xl leading-relaxed font-light">
                {data.brandDesc || 'Dedicated to creating sustainable and premium living environments.'}
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-12"
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.9 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        ease: [0.21, 1.11, 0.81, 0.99]
                      }
                    }
                  }}
                   className={`group flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-gray-50 dark:hover:bg-black/5 dark:bg-white/5 transition-all duration-500 border border-transparent hover:border-gray-100 dark:hover:border-black/10 dark:border-white/10 min-w-0 w-full ${index < 2 ? 'col-span-1' : 'col-span-2 sm:col-span-1'}`}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] transform ${feature.color}`}>
                    <feature.icon size={24} className="sm:size-32" />
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 sm:mb-2">{feature.sideHeading}</div>
                    <h4 className="text-[11px] sm:text-2xl font-black text-slate-900 dark:text-black dark:text-white mb-2 sm:mb-3 uppercase tracking-tight leading-tight break-all w-full">{feature.title}</h4>
                    <p className="text-[10px] sm:text-base text-gray-500 dark:text-gray-600 dark:text-gray-400 leading-relaxed font-medium break-words">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
