'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  X, ArrowLeft, Play, Image as ImageIcon, 
  Map as MapIcon, Download, ChevronLeft, ChevronRight,
  Maximize2, MousePointer2, LayoutGrid, Box
} from 'lucide-react';

// Bypass TypeScript error for custom element
const ModelViewer = 'model-viewer' as any;

import { openContactDialog } from '@/components/layout/ContactDialog';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const isLightColor = (color: string) => {
  if (!color) return false;
  const hex = color.replace('#', '');
  if (hex.length < 6) return false;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

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
        const res = await axios.get(`/api/properties/${id}?t=${Date.now()}`);
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
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!property) return null;

  if (!property) return null;

  const tabs = [
    { id: 'photos', label: 'Land Gallery', icon: <ImageIcon size={20} />, show: property.landPhotos?.length > 0 },
    { id: 'three_d', label: '3D Model', icon: <Box size={20} />, show: !!property.threeDElement },
    { id: 'video', label: 'Video Tour', icon: <Play size={20} />, show: !!property.videoUrl },
    { id: 'plot_plan', label: 'Plot Plan', icon: <LayoutGrid size={20} />, show: !!property.layoutImage },
    { id: 'brochure', label: 'Brochure', icon: <Download size={20} />, show: property.landBrochure?.length > 0 },
    { id: 'map', label: 'Location Map', icon: <MapIcon size={20} />, show: !!property.mapUrl },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8 bg-gradient-to-b from-black/80 to-transparent z-50">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 bg-black/10 dark:bg-white/10 hover:bg-white/20 px-4 md:px-6 py-2 md:py-3 rounded-full border border-black/20 dark:border-white/20 transition-all group backdrop-blur-md"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Exit</span>
        </button>

        <div className="hidden md:flex items-center gap-2">
           <h1 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">{property.title}</h1>
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
      <div className="flex-grow relative flex items-center justify-center h-[70vh] md:h-[80vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'three_d' && (
            <motion.div 
              key="three_d"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-4 md:p-10"
            >
              <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 relative shadow-2xl">
                <ModelViewer
                  src={property.threeDElement}
                  auto-rotate
                  camera-controls
                  shadow-intensity="2"
                  exposure="1.2"
                  style={{ width: '100%', height: '100%' }}
                ></ModelViewer>
                
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-black dark:text-white/30 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                   <MousePointer2 size={12} />
                   <span>Click & Drag to Rotate</span>
                </div>
              </div>
            </motion.div>
          )}

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
                  className="w-14 h-14 rounded-full bg-primary text-black border border-primary shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
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
                  className="w-14 h-14 rounded-full bg-primary text-black border border-primary shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-black dark:text-white/30 text-[10px] font-bold uppercase tracking-widest">
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
              <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 relative shadow-2xl">
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
                          <a key={i} href={pdf} target="_blank" className="bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black p-3 rounded-xl transition-all border border-black/10 dark:border-white/10" title="Download PDF">
                             <Download size={18} />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="h-10 w-px bg-black/10 dark:bg-white/10 mx-2"></div>
                    <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10">
                      <span className="text-primary font-black text-xs">{brochurePageIndex + 1}</span>
                      <span className="text-black dark:text-white/30 text-xs">/</span>
                      <span className="text-black dark:text-white/30 text-xs font-bold">{getBrochurePages(property.landBrochure).length}</span>
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-black border border-black/10 dark:border-white/10 flex items-center justify-center transition-all disabled:opacity-0 z-20 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                   >
                      <ChevronLeft size={32} />
                   </button>
                   <button 
                      disabled={brochurePageIndex === getBrochurePages(property.landBrochure).length - 1}
                      onClick={() => setBrochurePageIndex(prev => prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary text-black border border-black/10 dark:border-white/10 flex items-center justify-center transition-all disabled:opacity-0 z-20 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
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

          {activeTab === 'plot_plan' && (
            <motion.div 
              key="plot_plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col gap-8 p-4 md:p-10 overflow-y-auto"
            >
              <div className="flex flex-col md:flex-row gap-8 min-h-0">
                {/* Layout Image with Markers */}
                {/* Layout Image with Markers */}
                <div className="flex-grow bg-black/5 dark:bg-white/5 rounded-[2.5rem] border border-black/10 dark:border-white/10 overflow-hidden relative shadow-2xl group flex items-center justify-center min-h-[500px]">
                  <div className="relative max-w-full max-h-full">
                    <Image 
                      src={property.layoutImage} 
                      alt="Plot Layout" 
                      width={4000} 
                      height={3000} 
                      className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-2xl"
                      priority
                    />
                  </div>

                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                    <button className="bg-white dark:bg-black/60 backdrop-blur-md text-black dark:text-white p-3 rounded-full hover:bg-primary hover:text-black transition-all">
                      <Maximize2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Status Board */}
                <div className="w-full md:w-[350px] flex flex-col gap-6">
                  <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-black/10 dark:border-white/10 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black uppercase tracking-tighter">Plot Status</h3>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">Real-time</span>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: property.soldColor || '#fac915' }}></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black dark:text-white/50">Sold</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: property.bookedColor || '#22c55e' }}></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black dark:text-white/50">Booked</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <div className="w-4 h-4 rounded-full shadow-lg border border-gray-200" style={{ backgroundColor: property.availableColor || '#ffffff' }}></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black dark:text-white/50">Available</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3">
                      {(() => {
                        const mappedPlots = property.plots?.filter((p: any) => p.x !== undefined && p.y !== undefined && (p.x !== 0 || p.y !== 0)) || [];
                        return (
                          <>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black/40 border border-white/5">
                              <span className="text-xs font-bold text-black dark:text-white/60">Total Plots</span>
                              <span className="text-xl font-black">{mappedPlots.length}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-3 rounded-2xl flex flex-col items-center" style={{ backgroundColor: `${property.soldColor || '#fac915'}15`, border: `1px solid ${property.soldColor || '#fac915'}30` }}>
                                <span className="block text-[7px] font-black uppercase tracking-widest mb-1" style={{ color: property.soldColor || '#fac915' }}>Sold</span>
                                <span className="text-base font-black" style={{ color: property.soldColor || '#fac915' }}>{mappedPlots.filter((p: any) => p.status === 'sold').length}</span>
                              </div>
                              <div className="p-3 rounded-2xl flex flex-col items-center" style={{ backgroundColor: `${property.bookedColor || '#22c55e'}15`, border: `1px solid ${property.bookedColor || '#22c55e'}30` }}>
                                <span className="block text-[7px] font-black uppercase tracking-widest mb-1" style={{ color: property.bookedColor || '#22c55e' }}>Booked</span>
                                <span className="text-base font-black" style={{ color: property.bookedColor || '#22c55e' }}>{mappedPlots.filter((p: any) => p.status === 'booked').length}</span>
                              </div>
                              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col items-center">
                                <span className="block text-[7px] font-black uppercase tracking-widest mb-1 text-black dark:text-white/50">Available</span>
                                <span className="text-base font-black text-black dark:text-white">{mappedPlots.filter((p: any) => p.status === 'available' || !p.status || p.status === 'unsold').length}</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Plot Status Table */}
                  <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-black/10 dark:border-white/10 p-6 flex flex-col gap-4 overflow-hidden flex-grow min-h-[400px]">
                    <div className="flex items-center justify-between px-2">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">Inventory Table</h3>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Real-time Plot Availability</p>
                      </div>
                      <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">{property.plots?.length || 0} Total Units</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-3">
                        {property.plots?.map((plot: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-1.5 h-8 rounded-full" style={{
                                backgroundColor: plot.status === 'sold' ? (property.soldColor || '#fac915') :
                                                plot.status === 'booked' ? (property.bookedColor || '#22c55e') :
                                                (property.availableColor || '#ffffff')
                              }}></div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-black dark:text-white">Plot {plot.number}</span>
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-50" style={{
                                  color: plot.status === 'sold' ? (property.soldColor || '#fac915') :
                                         plot.status === 'booked' ? (property.bookedColor || '#22c55e') :
                                         'inherit'
                                }}>
                                  {plot.status}
                                </span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => openContactDialog('whatsapp', `I'm interested in Plot ${plot.number} of ${property.title}`)}
                              className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-black dark:text-white transition-colors border border-primary/20 px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary"
                            >
                              Enquire
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
              <div className="w-full h-full bg-black/5 dark:bg-white/5 rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 relative shadow-2xl">
                 <iframe
                  src={property.mapUrl}
                  className="absolute inset-0 w-full h-full border-none"
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent z-50">
        <div className="max-w-fit mx-auto flex items-center gap-2 md:gap-4 bg-black/5 dark:bg-white/5 backdrop-blur-3xl px-4 md:px-8 py-4 rounded-[2rem] border border-black/10 dark:border-white/10">
          {tabs.filter(t => t.show).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs ${
                activeTab === tab.id 
                  ? 'bg-primary text-black scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:text-white hover:bg-black/5 dark:bg-white/5'
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
