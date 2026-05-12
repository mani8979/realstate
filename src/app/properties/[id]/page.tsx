'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Phone, MessageSquare, Send, ArrowLeft, Share2, X, Leaf, Download, Save } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import ShareAction from '@/components/main/ShareAction';

// Bypass TypeScript error for custom element
const ModelViewer = 'model-viewer' as any;
import { Play, Map as MapIcon, Image as ImageIcon, LayoutGrid, Box } from 'lucide-react';

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showFruitPopup, setShowFruitPopup] = useState(false);
  const [showThreeDPopup, setShowThreeDPopup] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);
  const modelViewerRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll();
  const fruitX = useTransform(scrollYProgress, [0, 1], ['-20%', '120%']);
  const fruitRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  
  // Synchronized horizontal move to stay in empty spaces (opposite to content)
  const modelX = useTransform(scrollYProgress, (pos) => {
    // Using Cosine to start on the opposite side of the first Left-aligned section
    const horizontalMove = Math.cos(pos * Math.PI * 3) * 30; 
    return `${horizontalMove}vw`;
  });

  // Sync camera orbit with scroll for exact rotation effect
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (modelViewerRef.current) {
      const rotation = latest * 360 * 3;
      modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
    }
  });
  
  const modelY = useTransform(scrollYProgress, [0, 1], ['0vh', '80vh']);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
        setFormData(prev => ({ ...prev, message: `Hi, I'm interested in ${res.data.title}. Please provide more details.` }));
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    // Phone validation (10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setFormStatus('error');
      return;
    }

    try {
      await axios.post('/api/enquiries', {
        ...formData,
        propertyTitle: property?.title,
        propertyId: property?._id
      });
      setFormStatus('success');

      // WhatsApp redirect to specified number
      const message = `Property: ${property?.title}\nFull Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/919666080645?text=${encodedMessage}`, '_blank');

      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      setFormStatus('error');
    }
  };

  // --- EARLY RETURNS (MUST BE AFTER ALL HOOKS) ---
  
  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!property || !mounted) return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Property Not Found</h2>
      <Link href="/properties" className="text-primary hover:text-black dark:text-white transition-colors font-bold uppercase tracking-widest text-sm underline">Return to Properties</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-sans selection:bg-primary selection:text-black">
      {/* Floating 3D Model - Standardized for all properties with 3D */}
      {property.threeDElement && mounted && (
        <motion.div 
          style={{ 
            x: modelX, 
            y: modelY,
            rotate: fruitRotate
          }}
          className="fixed top-20 right-0 w-[40vw] h-[40vw] pointer-events-none z-[50] hidden lg:block"
        >
          <ModelViewer
            ref={modelViewerRef}
            src={property.threeDElement}
            auto-rotate
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            interaction-prompt="none"
            style={{ width: '100%', height: '100%' }}
          ></ModelViewer>
        </motion.div>
      )}
      
      {/* Hero Section - Clean Image */}
      <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
        <Image
          src={property.images[activeImage] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000'}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20"></div>
        
        {/* Quick Media Icons - Floating Over Hero */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3.5 md:gap-6 z-30 bg-white dark:bg-black/60 backdrop-blur-2xl px-5 md:px-10 py-3.5 md:py-5 rounded-[2.5rem] border border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-fit max-w-[95vw]">
          {property.landPhotos?.length > 0 && (
            <Link 
              href={`/properties/${property._id}/media?type=photos`}
              className="flex flex-col items-center gap-1.5 group transition-all shrink-0"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                <ImageIcon size={20} className="md:size-24" />
              </div>
              <span className="text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] text-black dark:text-white/40 group-hover:text-primary transition-colors">Photos</span>
            </Link>
          )}
          {property.videoUrl && (
            <Link 
              href={`/properties/${property._id}/media?type=video`}
              className="flex flex-col items-center gap-1.5 group transition-all shrink-0"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                <Play size={20} className="md:size-24" />
              </div>
              <span className="text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] text-black dark:text-white/40 group-hover:text-primary transition-colors">Video</span>
            </Link>
          )}
          {property.landBrochure?.length > 0 && (
            <Link 
              href={`/properties/${property._id}/media?type=brochure`}
              className="flex flex-col items-center gap-1.5 group transition-all shrink-0"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                <Download size={20} className="md:size-24" />
              </div>
              <span className="text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] text-black dark:text-white/40 group-hover:text-primary transition-colors">Brochure</span>
            </Link>
          )}
          {property.layoutImage && (
            <Link 
              href={`/properties/${property._id}/media?type=plot_plan`}
              className="flex flex-col items-center gap-1.5 group transition-all shrink-0"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                <LayoutGrid size={20} className="md:size-24" />
              </div>
              <span className="text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] text-black dark:text-white/40 group-hover:text-primary transition-colors">Plots</span>
            </Link>
          )}
          {property.mapUrl && (
            <Link 
              href={`/properties/${property._id}/media?type=map`}
              className="flex flex-col items-center gap-1.5 group transition-all shrink-0"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                <MapIcon size={20} className="md:size-24" />
              </div>
              <span className="text-[7px] md:text-[9px] uppercase font-black tracking-[0.2em] text-black dark:text-white/40 group-hover:text-primary transition-colors">Map</span>
            </Link>
          )}
        </div>
      </div>

      {/* Property Information Section - Below Image */}
      <div className="bg-white dark:bg-black border-b border-white/5 relative z-10">
        <div className="container mx-auto px-6 md:px-16 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className={`max-w-4xl space-y-6 ${
              property.alignment === 'center' ? 'text-center mx-auto' : 
              property.alignment === 'right' ? 'text-right ml-auto' : 
              'text-left'
            }`}>
              <div className={`flex items-center gap-4 ${
                property.alignment === 'center' ? 'justify-center' : 
                property.alignment === 'right' ? 'justify-end' : 
                'justify-start'
              }`}>
                <span className="bg-primary text-black font-black uppercase tracking-[0.2em] px-4 py-2 text-[10px] rounded-none">
                  {property.type}
                </span>
                <span className="text-primary/70 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                  <MapPin size={14} /> {property.location}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black dark:text-white">
                {property.title}
              </h1>

              <div className={`flex flex-wrap gap-4 ${
                property.alignment === 'center' ? 'justify-center' : 
                property.alignment === 'right' ? 'justify-end' : 
                'justify-start'
              }`}>
                {(property.fruitImage || property.fruitInfo) && (
                  <button 
                    onClick={() => setShowFruitPopup(true)}
                    className="inline-flex items-center gap-3 bg-[#10b981] hover:bg-white text-black px-6 md:px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 group"
                  >
                    <Leaf size={18} className="group-hover:scale-110 transition-transform" />
                    <span>View Plantation & Cultivation Info</span>
                  </button>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mt-2">
                  <p className={`text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed ${!isReadMore ? 'line-clamp-4' : ''}`}>
                    {property.description}
                  </p>
                  {property.description.length > 300 && (
                    <button
                      onClick={() => setIsReadMore(!isReadMore)}
                      className="mt-3 text-primary font-bold uppercase tracking-widest text-xs hover:text-black dark:text-white transition-colors"
                    >
                      {isReadMore ? '↑ Show Less' : '↓ Read More'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 p-8 md:p-12 rounded-[2.5rem] flex flex-col items-center md:items-start min-w-[300px]">
                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Asking Price</p>
                <p className="text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white">₹{property.price?.toLocaleString('en-IN')}</p>
              </div>
              
              <div className="flex flex-wrap items-center md:justify-end gap-4">
                <ShareAction 
                    variant="button"
                    title={property.title}
                    text={`Check out this property: ${property.title} in ${property.location}`}
                    className="w-full md:w-auto"
                />
                {property.landBrochure?.length > 0 && (
                    <Link 
                    href={`/properties/${property._id}/media?type=brochure`}
                    className="flex items-center gap-2 bg-primary/20 hover:bg-primary text-primary hover:text-black font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-full border border-primary/30 transition-all group w-full md:w-auto text-center justify-center"
                    >
                    <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>View Brochure Gallery</span>
                    </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 py-16 md:py-24 relative z-20">
          <div className={`w-full max-w-7xl mx-auto pb-32 ${property.details?.length > 0 ? 'space-y-64' : ''}`} id="content-anchor">

            {/* Dynamic Structured Details — ONLY what admin adds */}
            {property.details?.map((detail: any, idx: number) => {
              const align = detail.alignment || property.alignment || 'left';
              const isCenter = align === 'center';
              const isRight = align === 'right';
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`md:w-1/2 w-full glass-card p-8 md:py-16 ${
                    isCenter ? 'text-center border-b-4 border-primary md:px-16' : 
                    isRight ? 'text-left border-r-4 border-primary md:px-8' : 
                    'text-left border-l-4 border-primary md:pl-0 md:pr-16'
                  }`}>
                    <div className={`flex items-start gap-5 ${isCenter ? 'justify-center' : 'justify-start'}`}>
                      {detail.showArrow && !isCenter && (
                        <span className="text-primary font-bold text-2xl w-8 shrink-0 flex justify-center mt-1">→</span>
                      )}
                      <div className="flex-grow">
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.9] mb-8">
                          {detail.heading}
                        </h2>

                        <div className={`${isCenter ? '' : 'pl-[20px]'} space-y-6`}>
                          {detail.sideHeading && (
                            <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-6">
                              {detail.sideHeading}
                            </h3>
                          )}
                          
                          {detail.isPointed ? (
                            <ul className={`space-y-6 ${isCenter ? 'inline-block text-left' : ''}`}>
                              {detail.content.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                                <li key={i} className="flex gap-4 text-gray-700 dark:text-gray-300 text-lg items-start">
                                  <span className="text-primary font-bold shrink-0 w-8 flex justify-center mt-1">•</span>
                                  <span className="text-left font-medium leading-relaxed">{line.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-line">
                              {detail.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

          </div>

          {/* Bottom Enquiry Form - Center Aligned */}
          <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 p-10 md:p-16 mt-20 bg-black/5 dark:bg-white/5 rounded-[4rem] border border-black/10 dark:border-white/10"
            >
                 <div className="max-w-2xl mx-auto text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white mb-4">Start Your Journey</h2>
                    <p className="text-gray-500 dark:text-gray-500 font-medium uppercase tracking-widest text-xs">Fill out the form below to get detailed information</p>
                 </div>
                 
                 <form onSubmit={handleEnquiry} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-black dark:text-white/50 font-black uppercase tracking-[0.2em] mb-2 block px-2">Full Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-8 py-5 bg-white dark:bg-black/50 text-black dark:text-white rounded-[2rem] focus:ring-2 focus:ring-primary/50 border border-black/10 dark:border-white/10 transition-all placeholder:text-black dark:text-white/10"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-black dark:text-white/50 font-black uppercase tracking-[0.2em] mb-2 block px-2">Phone Number</label>
                          <input
                            type="tel"
                            required
                            className="w-full px-8 py-5 bg-white dark:bg-black/50 text-black dark:text-white rounded-[2rem] focus:ring-2 focus:ring-primary/50 border border-black/10 dark:border-white/10 transition-all placeholder:text-black dark:text-white/10"
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                          <label className="text-[10px] text-black dark:text-white/50 font-black uppercase tracking-[0.2em] mb-2 block px-2">Message</label>
                          <textarea
                            required
                            rows={5}
                            className="w-full px-8 py-5 bg-white dark:bg-black/50 text-black dark:text-white rounded-[2rem] focus:ring-2 focus:ring-primary/50 border border-black/10 dark:border-white/10 transition-all resize-none placeholder:text-black dark:text-white/10"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          disabled={formStatus === 'loading'}
                          className="w-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-70 group shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        >
                          {formStatus === 'loading' ? (
                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                              <span>Send Enquiry</span>
                            </>
                          )}
                        </button>
                    </div>
                    {formStatus === 'success' && <div className="col-span-full bg-primary/20 p-4 rounded-2xl text-primary font-bold text-center animate-bounce uppercase tracking-widest text-xs">Enquiry sent successfully! We will contact you soon.</div>}
                    {formStatus === 'error' && (
                      <div className="col-span-full bg-red-500/20 p-4 rounded-2xl text-red-500 font-bold text-center uppercase tracking-widest text-xs">
                        {formData.phone.replace(/\D/g, '').length !== 10 
                          ? 'Please enter a valid 10-digit mobile number.' 
                          : 'Error sending enquiry. Please try again.'}
                      </div>
                    )}
                 </form>
              </motion.div>

          {/* Quick Actions & Contact Section */}
          <div className="max-w-4xl mx-auto w-full mt-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 md:col-span-1">
                <a
                  href={`tel:+919666080645`}
                  className="bg-black/5 dark:bg-white/5 hover:bg-primary border border-black/10 dark:border-white/10 hover:border-primary text-black dark:text-white hover:text-black font-bold p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group"
                >
                  <Phone size={28} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.2em]">Call Now</span>
                </a>
                <a
                  href={`https://wa.me/919666080645?text=Hi, I'm interested in ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] text-[#25D366] hover:text-black dark:text-white font-bold p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group"
                >
                  <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.2em]">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Cultivation Info Popup */}
      {showFruitPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-white dark:bg-black/95 backdrop-blur-3xl" onClick={() => setShowFruitPopup(false)}>
          <div 
            className="relative w-full max-w-6xl bg-white dark:bg-[#0a0a0a] border-2 border-primary/30 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowFruitPopup(false)}
              className="absolute top-8 right-8 z-[210] bg-black/10 dark:bg-white/10 hover:bg-red-500 text-black dark:text-white p-3 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Content Side */}
            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col text-left">
              <div className="bg-primary/20 p-5 rounded-2xl mb-10 border border-primary/20 flex-shrink-0 w-fit">
                <Leaf className="text-primary" size={40} />
              </div>
              
              <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
                {property.title.toLowerCase().includes('sandalwood') ? 'Plantation' : 'Cultivation'} <br/> <span className="text-black dark:text-white">Model</span>
              </h3>
              
              <div className="space-y-10 text-gray-700 dark:text-gray-300">
                {property.fruitDetails?.length > 0 ? (
                  <div className="space-y-12">
                    {property.fruitDetails.map((detail: any, i: number) => (
                      <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                          {detail.showArrow && <span className="text-primary font-bold text-2xl">→</span>}
                          <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">{detail.heading}</p>
                        </div>
                        {detail.isPointed ? (
                          <ul className="grid grid-cols-1 gap-4">
                            {detail.content.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                              <li key={j} className="flex gap-4 items-start bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{line.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xl leading-relaxed font-medium bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-white/5 italic whitespace-pre-line">
                            {detail.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : property.fruitInfo ? (
                  <div className="text-xl leading-relaxed font-medium whitespace-pre-line prose dark:prose-invert max-w-none">
                    {property.fruitInfo}
                  </div>
                ) : (
                  <>
                    <p className="text-xl leading-relaxed font-medium">
                      Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.
                    </p>

                    <div className="space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">Plantation Details (Per 100 Sq. Yards)</p>
                      <ul className="grid grid-cols-1 gap-3">
                        <li className="flex gap-3 items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/5">
                          <span className="text-primary font-bold">→</span> 40 dragon fruit plants
                        </li>
                        <li className="flex gap-3 items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/5">
                          <span className="text-primary font-bold">→</span> 4 plants per pole
                        </li>
                        <li className="flex gap-3 items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/5">
                          <span className="text-primary font-bold">→</span> 10 poles in each 100 sq. yards
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Plantation Period</p>
                        <p className="text-black dark:text-white font-bold italic text-lg">May to November</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Yield Duration</p>
                        <p className="text-black dark:text-white font-bold italic text-lg">Up to 30 Years</p>
                      </div>
                    </div>

                    <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs text-center">Profit Sharing</p>
                      <div className="flex items-center justify-center gap-10">
                        <div className="text-center">
                          <p className="text-4xl font-black text-black dark:text-white">50%</p>
                          <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">Company</p>
                        </div>
                        <div className="h-10 w-[1px] bg-primary/30"></div>
                        <div className="text-center">
                          <p className="text-4xl font-black text-primary">50%</p>
                          <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">Client</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={() => setShowFruitPopup(false)}
                className="mt-16 bg-primary text-black font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/30"
              >
                Close Details
              </button>
            </div>

            {/* Media Preview Side */}
            <div className="w-full md:w-1/2 h-64 md:h-full bg-white dark:bg-black/40 relative border-l border-white/5">
              {property.threeDElement ? (
                <ModelViewer
                  src={property.threeDElement}
                  auto-rotate
                  camera-controls
                  shadow-intensity="2"
                  exposure="1.2"
                  style={{ width: '100%', height: '100%' }}
                ></ModelViewer>
              ) : property.fruitImage ? (
                <Image 
                  src={property.fruitImage} 
                  alt="Fruit Preview" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">
                  <Leaf size={100} className="opacity-10" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
