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

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

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
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Exit Viewer</span>
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
              className="w-full h-full overflow-y-auto p-4 md:p-20 custom-scrollbar"
            >
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Brochure Gallery</h2>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest ml-auto">Scroll to explore</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {property.landBrochure.map((item: string, i: number) => (
                     !item.endsWith('.pdf') ? (
                       <div key={i} className="relative aspect-[1/1.414] rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
                         <Image src={item} alt={`Brochure ${i+1}`} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <a href={item} download className="bg-primary text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px]">Download Page</a>
                         </div>
                       </div>
                     ) : (
                        <a 
                          key={i}
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-primary transition-all group"
                        >
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <ImageIcon size={32} />
                              </div>
                              <div>
                                <p className="text-xl font-bold">{item.split('/').pop()}</p>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">PDF Document</p>
                              </div>
                           </div>
                           <Download size={24} className="text-primary group-hover:translate-y-1 transition-transform" />
                        </a>
                     )
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
