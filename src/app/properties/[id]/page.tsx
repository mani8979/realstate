'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Phone, MessageSquare, Send, ArrowLeft, Share2, X, Leaf, Download } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// Bypass TypeScript error for custom element
const ModelViewer = 'model-viewer' as any;
import { Play, Map as MapIcon, Image as ImageIcon } from 'lucide-react';

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
    try {
      await axios.post('/api/enquiries', {
        ...formData,
        propertyTitle: property?.title,
        propertyId: property?._id
      });
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      setFormStatus('error');
    }
  };

  // --- EARLY RETURNS (MUST BE AFTER ALL HOOKS) ---
  
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!property || !mounted) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Property Not Found</h2>
      <Link href="/properties" className="text-primary hover:text-white transition-colors font-bold uppercase tracking-widest text-sm underline">Return to Properties</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-black">
      
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
        
        {/* Navigation - Top Left */}
        <div className="absolute top-24 left-6 md:left-16 z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      {/* Property Information Section - Below Image */}
      <div className="bg-black border-b border-white/5 relative z-10">
        <div className="container mx-auto px-6 md:px-16 py-12 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-primary text-black font-black uppercase tracking-[0.2em] px-4 py-2 text-[10px] rounded-none">
                  {property.type}
                </span>
                <span className="text-primary/70 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                  <MapPin size={14} /> {property.location}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                {property.title}
              </h1>

              {property.fruitImage && property.title.toLowerCase().includes('lendy pink valley') && (
                <button 
                  onClick={() => setShowFruitPopup(true)}
                  className="inline-flex items-center gap-3 bg-[#10b981] hover:bg-white text-black px-6 md:px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 group"
                >
                  <Leaf size={18} className="group-hover:scale-110 transition-transform" />
                  <span>View Cultivation Info</span>
                </button>
              )}
            </div>

            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] flex flex-col items-center md:items-start min-w-[300px]">
                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Asking Price</p>
                <p className="text-5xl md:text-7xl font-black tracking-tighter text-white">₹{property.price?.toLocaleString('en-IN')}</p>
              </div>
              
              {property.landBrochure && (
                <a 
                  href={property.landBrochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary/20 hover:bg-primary text-primary hover:text-black font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-full border border-primary/30 transition-all group"
                >
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  <span>Download Brochure</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 py-16 md:py-24 relative z-20">
          <div className="space-y-64 w-full max-w-7xl mx-auto pb-32" id="content-anchor">
            {/* Section 1: Productive Asset (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-start"
            >
              <div className="md:w-1/2 w-full glass-card p-8 md:p-16 relative group hover:border-primary/50 transition-all duration-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Leaf size={24} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Productive Asset</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="text-primary font-bold text-2xl mt-1">→</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Land Type</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Farm land where fruit cultivation (dragon fruit) is actively done.
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed bg-white/5 p-6 rounded-2xl border-l-4 border-primary">
                    However, the plantation can be removed anytime and the land can be made ready immediately for residential or any other use as per the client’s requirement.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Scale & Growth (Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-end"
            >
              <div className="md:w-1/2 w-full glass-card p-8 md:p-16 border-r-4 border-primary">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Scale & Growth</h2>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold text-2xl">→</span>
                    <p className="text-2xl font-black text-white">Total Land Area: <span className="text-primary">10 Acres</span></p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-primary/10 transition-colors">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Phase 1 (6.5 Acres)</span>
                      <span className="px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-black uppercase">Sold</span>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-between group hover:bg-primary/20 transition-colors border border-primary/30">
                      <span className="text-white font-bold uppercase tracking-widest text-sm">Phase 2 (3.5 Acres)</span>
                      <span className="px-4 py-1 bg-primary/20 text-primary rounded-full text-xs font-black uppercase animate-pulse">Selling Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Prime Spot (Center - Big Highlight) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full max-w-4xl glass-card p-8 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-12">Prime Spot</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                  <div className="space-y-6">
                    <h3 className="text-primary font-black uppercase tracking-widest text-xs">Location Advantages</h3>
                    <ul className="space-y-4 text-gray-300 text-lg">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">→</span>
                        Located at Vepada Mandal Headquarters
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">→</span>
                        Just 500 meters from MRO Office
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">→</span>
                        Close to Police Station & Vet Hospital
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-primary font-black uppercase tracking-widest text-xs">Connectivity</h3>
                    <div className="bg-white/5 p-6 rounded-2xl">
                      <p className="text-white font-bold mb-2">Distance Info</p>
                      <p className="text-gray-400">Gajuwaka – 52 KM</p>
                      <p className="text-gray-400">Highway (Araku-Vizag) – 8.5 KM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 4: Amenities (Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-end"
            >
              <div className="md:w-1/2 w-full glass-card p-8 md:p-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <MapPin size={24} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Amenities</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "20 ft & 24 ft Roads", "Guest House Facility", "Compound Fencing",
                    "Solar Lighting", "Drip Irrigation", "18 Years Maintenance",
                    "50/50 Profit Sharing", "Vastu Compliant", "Clear Title"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300 group">
                      <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">→</span>
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Section 5: Growing Hub (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-start"
            >
              <div className="md:w-1/2 w-full glass-card p-8 md:p-16 bg-gradient-to-br from-primary/5 to-transparent">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-8">Growing Hub</h2>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-6">About Vepada</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  Vepada is rapidly developing as a mandal headquarters and serves as an administrative hub for around 18 nearby villages.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed bg-primary/10 p-6 rounded-2xl border border-primary/20">
                  Land prices are expected to appreciate significantly, making it a smart investment choice for both residential and agricultural purposes.
                </p>
              </div>
            </motion.div>

            {/* Section 6: Passive Income (Center - Wide & Dynamic) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-full glass-card p-8 md:p-20 bg-gradient-to-t from-primary/10 to-transparent relative group">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="md:w-2/3 space-y-8">
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">Passive Income</h2>
                    <h3 className="text-primary font-black uppercase tracking-widest text-xl">Dragon Fruit Plantation & Profit Model</h3>
                    <p className="text-gray-300 text-xl leading-relaxed">
                      Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits. 
                      Plants can yield fruits for <strong>up to 30 years</strong>, providing long-term income stability.
                    </p>
                    <div className="p-6 bg-white/5 rounded-2xl border-l-4 border-primary italic text-gray-400">
                      "Additionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes."
                    </div>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    <div className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center animate-pulse border-2 border-primary/30">
                      <div className="text-center">
                        <p className="text-primary font-black text-4xl">50%</p>
                        <p className="text-white text-xs font-bold uppercase tracking-widest">Client Profit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Structured Details */}
            {property.details?.map((detail: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`md:w-1/2 w-full glass-card p-8 md:p-16 ${idx % 2 !== 0 ? 'border-r-4 border-primary' : ''}`}>
                  <div className="flex items-center gap-4 mb-8">
                    {detail.showArrow && <span className="text-primary font-bold text-2xl">→</span>}
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">{detail.heading}</h2>
                  </div>
                  {detail.sideHeading && (
                    <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-6">{detail.sideHeading}</h3>
                  )}
                  {detail.isPointed ? (
                    <ul className="space-y-4">
                      {detail.content.split('\n').filter((line: string) => line.trim()).map((line: string, i: number) => (
                        <li key={i} className="flex gap-3 text-gray-300 text-lg">
                          <span className="text-primary font-bold">•</span>
                          {line.trim()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-lg leading-relaxed">{detail.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Video Tour Section */}
            {property.videoUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="w-full max-w-5xl glass-card p-4 md:p-10 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8 px-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Play size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Video Tour</h2>
                  </div>
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <iframe
                      src={getYouTubeEmbedUrl(property.videoUrl)}
                      title="Property Video Tour"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Land Gallery Section */}
            {property.landPhotos && property.landPhotos.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="w-full glass-card p-8 md:p-16 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <ImageIcon size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Land Gallery</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {property.landPhotos.map((photo: string, i: number) => (
                      <div key={i} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => {
                        // Optional: Open in lightbox or set as main image
                        // For now just show it
                      }}>
                        <Image src={photo} alt={`Land Photo ${i+1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Location Map Section */}
            {property.mapUrl && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="w-full max-w-5xl glass-card p-4 md:p-10 relative overflow-hidden border-b-4 border-primary">
                  <div className="flex items-center gap-4 mb-8 px-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <MapIcon size={24} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Location Map</h2>
                  </div>
                  <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <iframe
                      src={property.mapUrl}
                      className="absolute inset-0 w-full h-full grayscale invert opacity-80 contrast-125"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

            {/* Bottom Enquiry Form - Center Aligned */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 p-10 md:p-16 mt-20 bg-white/5 rounded-[4rem] border border-white/10"
            >
                 <div className="max-w-2xl mx-auto text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">Start Your Journey</h2>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Fill out the form below to get detailed information</p>
                 </div>
                 
                 <form onSubmit={handleEnquiry} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-2 block px-2">Full Name</label>
                          <input
                            type="text"
                            required
                            className="w-full px-8 py-5 bg-black/50 text-white rounded-[2rem] focus:ring-2 focus:ring-primary/50 border border-white/10 transition-all placeholder:text-white/10"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-2 block px-2">Phone Number</label>
                          <input
                            type="tel"
                            required
                            className="w-full px-8 py-5 bg-black/50 text-white rounded-[2rem] focus:ring-2 focus:ring-primary/50 border border-white/10 transition-all placeholder:text-white/10"
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                          <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-2 block px-2">Message</label>
                          <textarea
                            required
                            rows={5}
                            className="w-full px-8 py-5 bg-black/50 text-white rounded-[2rem] focus:ring-2 focus:ring-primary/50 border border-white/10 transition-all resize-none placeholder:text-white/10"
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
                 </form>
              </motion.div>

          {/* Quick Actions & Contact Section */}
          <div className="max-w-4xl mx-auto w-full mt-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 md:col-span-1">
                <a
                  href={`tel:+919876543210`}
                  className="bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black font-bold p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group"
                >
                  <Phone size={28} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.2em]">Call Now</span>
                </a>
                <a
                  href={`https://wa.me/919876543210?text=Hi, I'm interested in ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] text-[#25D366] hover:text-white font-bold p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group"
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl" onClick={() => setShowFruitPopup(false)}>
          <div 
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-primary/30 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowFruitPopup(false)}
              className="absolute top-8 right-8 z-[210] bg-white/10 hover:bg-red-500 text-white p-3 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Content Side */}
            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col text-left">
              <div className="bg-primary/20 p-5 rounded-2xl mb-10 border border-primary/20 flex-shrink-0 w-fit">
                <Leaf className="text-primary" size={40} />
              </div>
              
              <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
                Cultivation <br/> <span className="text-white">Model</span>
              </h3>
              
              <div className="space-y-10 text-gray-300">
                <p className="text-xl leading-relaxed font-medium">
                  Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.
                </p>

                <div className="space-y-4">
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">Plantation Details (Per 100 Sq. Yards)</p>
                  <ul className="grid grid-cols-1 gap-3">
                    <li className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-primary font-bold">→</span> 40 dragon fruit plants
                    </li>
                    <li className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-primary font-bold">→</span> 4 plants per pole
                    </li>
                    <li className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-primary font-bold">→</span> 10 poles in each 100 sq. yards
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Plantation Period</p>
                    <p className="text-white font-bold italic text-lg">May to November</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Yield Duration</p>
                    <p className="text-white font-bold italic text-lg">Up to 30 Years</p>
                  </div>
                </div>

                <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 space-y-4">
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-xs text-center">Profit Sharing</p>
                  <div className="flex items-center justify-center gap-10">
                    <div className="text-center">
                      <p className="text-4xl font-black text-white">50%</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Company</p>
                    </div>
                    <div className="h-10 w-[1px] bg-primary/30"></div>
                    <div className="text-center">
                      <p className="text-4xl font-black text-primary">50%</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Client</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">This model ensures</p>
                  <div className="grid grid-cols-1 gap-3">
                    {["Land ownership", "Continuous agricultural income", "Long-term asset appreciation"].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-lg">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-400 italic text-sm border-l-2 border-primary/30 pl-4 py-2">
                  Additionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes.
                </p>
              </div>

              <button 
                onClick={() => setShowFruitPopup(false)}
                className="mt-16 bg-primary text-black font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/30"
              >
                Close Details
              </button>
            </div>

            {/* Media Preview Side */}
            <div className="w-full md:w-1/2 h-64 md:h-full bg-black/40 relative border-l border-white/5">
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
