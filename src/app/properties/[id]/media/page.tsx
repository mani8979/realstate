'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  X, ArrowLeft, Play, Image as ImageIcon, 
  Map as MapIcon, Download, ChevronLeft, ChevronRight,
  Maximize2, MousePointer2
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MediaPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'photos';

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialType);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [brochurePageIndex, setBrochurePageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  // Auto-scroll logic for photos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoScroll && activeTab === 'photos' && property?.landPhotos?.length > 1) {
      interval = setInterval(() => {
        setPhotoIndex((prev) => (prev + 1) % property.landPhotos.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoScroll, activeTab, property]);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
  };

  const getBrochurePages = (images: string[]) => {
    const brochureImages = images.filter(img => !img.endsWith('.pdf'));
    if (brochureImages.length === 0) return [];
    if (brochureImages.length === 1) return [[brochureImages[0]]];
    
    const pages = [];
    pages.push([brochureImages[0]]); // Cover
    
    for (let i = 1; i < brochureImages.length - 1; i += 2) {
      if (i + 1 < brochureImages.length - 1) {
        pages.push([brochureImages[i], brochureImages[i + 1]]);
      } else {
        pages.push([brochureImages[i]]);
      }
    }
    
    pages.push([brochureImages[brochureImages.length - 1]]); // Back Cover
    return pages;
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!property) return null;

  if (!property) return null;

  const tabs = [
    { id: 'photos', label: 'Land Gallery', icon: <ImageIcon size={20} />, show: property.landPhotos?.length > 0 },
    { id: 'video', label: 'Video Tour', icon: <Play size={20} />, show: !!property.videoUrl },
    { id: 'brochure', label: 'Brochure', icon: <Download size={20} />, show: property.landBrochure?.length > 0 },
    { id: 'map', label: 'Location Map', icon: <MapIcon size={20} />, show: !!property.mapUrl },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8 bg-gradient-to-b from-black/80 to-transparent z-50">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/20 transition-all group backdrop-blur-md"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Exit</span>
        </button>

        <div className="hidden md:flex items-center gap-2">
           <h1 className="text-xl font-black uppercase tracking-tighter text-white">{property.title}</h1>
           <span className="text-primary/50 text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-primary/20 rounded-full">Media Suite</span>
        </div>

        <button 
          onClick={() => router.push(`/properties/${id}`)}
          className="bg-primary text-black p-3 rounded-full hover:scale-110 transition-transform"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Viewer Area */}
      <div className="flex-grow relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeTab === 'photos' && (
            <motion.div 
              key="photos"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full relative"
              onMouseEnter={() => setIsAutoScroll(false)}
              onMouseLeave={() => setIsAutoScroll(true)}
            >
              <Image 
                src={property.landPhotos[photoIndex]} 
                alt="Land" 
                fill 
                className="object-contain p-4 md:p-20"
                priority
              />
              
              {/* Photo Controls */}
              <div className="absolute inset-x-0 bottom-32 flex items-center justify-center gap-8">
                <button 
                  onClick={() => setPhotoIndex((prev) => (prev - 1 + property.landPhotos.length) % property.landPhotos.length)}
                  className="w-14 h-14 rounded-full bg-white/5 hover:bg-primary hover:text-black border border-white/10 flex items-center justify-center transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex gap-2">
                  {property.landPhotos.map((_: any, i: number) => (
                    <div 
                      key={i} 
                      className={`h-1.5 transition-all rounded-full ${i === photoIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
                    ></div>
                  ))}
                </div>
                <button 
                  onClick={() => setPhotoIndex((prev) => (prev + 1) % property.landPhotos.length)}
                  className="w-14 h-14 rounded-full bg-white/5 hover:bg-primary hover:text-black border border-white/10 flex items-center justify-center transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                 <MousePointer2 size={12} />
                 <span>Hover to Pause Auto-Scroll</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'video' && (
            <motion.div 
              key="video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-4 md:p-20"
            >
              <div className="w-full h-full bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 relative shadow-2xl">
                {property.videoUrl.includes('youtube') || property.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={getYouTubeEmbedUrl(property.videoUrl)}
                    title="Video Tour"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={property.videoUrl}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-contain"
                  ></video>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'brochure' && (
            <motion.div 
              key="brochure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10"
            >
              <div className="w-full max-w-6xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Brochure Book</h2>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Interactive Flip-Book Experience</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {property.landBrochure.some((item: string) => item.endsWith('.pdf')) && (
                      <div className="flex gap-2">
                        {property.landBrochure.filter((item: string) => item.endsWith('.pdf')).map((pdf: string, i: number) => (
                          <a key={i} href={pdf} target="_blank" className="bg-white/5 hover:bg-primary hover:text-black p-3 rounded-xl transition-all border border-white/10" title="Download PDF">
                             <Download size={18} />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="h-10 w-px bg-white/10 mx-2"></div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                      <span className="text-primary font-black text-xs">{brochurePageIndex + 1}</span>
                      <span className="text-white/30 text-xs">/</span>
                      <span className="text-white/30 text-xs font-bold">{getBrochurePages(property.landBrochure).length}</span>
                    </div>
                  </div>
                </div>

                {/* Book View */}
                <div className="flex-grow relative flex items-center justify-center min-h-[500px]">
                   <AnimatePresence mode="wait">
                     <motion.div 
                        key={brochurePageIndex}
                        initial={{ opacity: 0, x: 20, rotateY: -10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -20, rotateY: 10 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full flex items-center justify-center perspective-1000"
                     >
                        <div className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center gap-4 px-2 md:px-10">
                           {getBrochurePages(property.landBrochure)[brochurePageIndex]?.map((img: string, i: number) => (
                              <div 
                                key={i} 
                                className={`relative h-full transition-all duration-700 ${
                                  getBrochurePages(property.landBrochure)[brochurePageIndex].length === 1 
                                    ? 'w-full max-w-[95%] md:max-w-[85%]' 
                                    : 'flex-1'
                                }`}
                              >
                                 <Image 
                                   src={img} 
                                   alt="Brochure Page" 
                                   fill 
                                   className="object-contain"
                                   priority
                                 />
                              </div>
                           ))}
                        </div>
                     </motion.div>
                   </AnimatePresence>

                   {/* Book Navigation */}
                   <button 
                      disabled={brochurePageIndex === 0}
                      onClick={() => setBrochurePageIndex(prev => prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-black border border-white/10 flex items-center justify-center transition-all disabled:opacity-0 z-20 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                   >
                      <ChevronLeft size={32} />
                   </button>
                   <button 
                      disabled={brochurePageIndex === getBrochurePages(property.landBrochure).length - 1}
                      onClick={() => setBrochurePageIndex(prev => prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-black border border-white/10 flex items-center justify-center transition-all disabled:opacity-0 z-20 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                   >
                      <ChevronRight size={32} />
                   </button>
                </div>
                
                {/* Page Thumbnails */}
                <div className="flex items-center justify-center gap-2 mt-8 py-4 overflow-x-auto max-w-full">
                   {getBrochurePages(property.landBrochure).map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setBrochurePageIndex(i)}
                        className={`h-1.5 transition-all rounded-full ${i === brochurePageIndex ? 'w-10 bg-primary' : 'w-2 bg-white/20'}`}
                      ></button>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full p-4 md:p-20"
            >
              <div className="w-full h-full bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 relative shadow-2xl">
                 <iframe
                  src={property.mapUrl}
                  className="absolute inset-0 w-full h-full grayscale invert opacity-80 contrast-125"
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent z-50">
        <div className="max-w-fit mx-auto flex items-center gap-2 md:gap-4 bg-white/5 backdrop-blur-3xl px-4 md:px-8 py-4 rounded-[2rem] border border-white/10">
          {tabs.filter(t => t.show).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs ${
                activeTab === tab.id 
                  ? 'bg-primary text-black scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="hidden md:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
