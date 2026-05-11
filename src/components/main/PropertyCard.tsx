'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Home, BedDouble, Bath, ArrowRight, Star, Heart, MessageSquare, Phone, Sparkles, Zap, Flame } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ShareAction from '@/components/main/ShareAction';

interface PropertyCardProps {
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const propertyUrl = `${baseUrl}/properties/${property._id}`;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <Link href={`/properties/${property._id}`} className="block h-full">
        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="group bg-white dark:bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-primary/20 flex flex-col border border-gray-100 dark:border-white/5 h-full relative"
        >
        {/* Quick Actions Overlay - Stop propagation to avoid triggering the Link */}
        <div className="absolute top-6 right-6 z-30 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(!isLiked); }}
            className={`p-3 rounded-full backdrop-blur-md border border-black/20 dark:border-white/20 transition-all duration-300 ${isLiked ? 'bg-red-500 text-black dark:text-white' : 'bg-black/10 dark:bg-white/10 text-black dark:text-white hover:bg-white/20'}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <ShareAction 
            title={property.title}
            text={`Check out this property: ${property.title} in ${property.location}`}
            url={propertyUrl}
          />
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`https://wa.me/919666080645?text=Interested in ${property.title}`, '_blank');
            }}
            className="p-3 rounded-full bg-green-500/90 backdrop-blur-md text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-green-600 transition-all duration-300"
          >
            <MessageSquare size={20} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = "tel:+919666080645";
            }}
            className="p-3 rounded-full bg-primary/90 backdrop-blur-md text-black dark:text-white border border-black/20 dark:border-white/20 hover:bg-primary transition-all duration-300"
          >
            <Phone size={20} />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000'}
            alt={property.title || 'Property'}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
            <div className="flex gap-2">
              <div className="bg-primary backdrop-blur-md text-black dark:text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5 ring-1 ring-white/20">
                <Zap size={12} />
                <span>{property.type}</span>
              </div>
              {property.isNew && (
                <div className="bg-amber-500 backdrop-blur-md text-black dark:text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5 ring-1 ring-white/20">
                  <Flame size={12} />
                  <span>New Launch</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="bg-emerald-500 backdrop-blur-md text-black dark:text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5 ring-1 ring-white/20">
                <Sparkles size={12} />
                <span>DTCP Approved</span>
              </div>
              {property.isHot && (
                <div className="bg-red-500 backdrop-blur-md text-black dark:text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse ring-1 ring-white/20">
                  <span>Hot Deal</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="bg-white dark:bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-black/10 dark:border-white/10 group-hover:border-primary/30 transition-colors">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Starting From</p>
              <p className="text-3xl font-black text-primary tracking-tighter">
                ₹{property.price?.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-grow flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-black text-gray-900 dark:text-black dark:text-white line-clamp-1 group-hover:text-primary transition-colors tracking-tight uppercase">
                {property.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-600 dark:text-gray-400 text-sm font-medium">
              <div className="p-2 bg-gray-100 dark:bg-black/5 dark:bg-white/5 rounded-lg">
                <MapPin size={16} className="text-primary" />
              </div>
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-colors">
              <p className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">Property Type</p>
              <div className="flex items-center gap-2 text-gray-900 dark:text-black dark:text-white font-bold">
                <Home size={18} className="text-primary/60" />
                <span>{property.type}</span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-primary/10 transition-colors">
              <p className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">Area Size</p>
              <div className="flex items-center gap-2 text-gray-900 dark:text-black dark:text-white font-bold">
                <Zap size={18} className="text-primary/60" />
                <span>{property.area || '200 Sq Yds'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </Link>
    </div>
  );
};

export default PropertyCard;

