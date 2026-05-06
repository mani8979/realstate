'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Phone, MessageSquare, Send, ArrowLeft, Share2, X, Leaf } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';

// Bypass TypeScript error for custom element
const ModelViewer = 'model-viewer' as any;

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

  const { scrollYProgress } = useScroll();
  
  // Exact horizontal move logic from snippet: Math.sin(scrollPercent * Math.PI * 2) * 28
  const modelX = useTransform(scrollYProgress, (pos) => {
    const horizontalMove = Math.sin(pos * Math.PI * 2) * 28;
    return `${horizontalMove}vw`;
  });

  // Sync camera orbit with scroll for exact rotation effect
  useEffect(() => {
    return scrollYProgress.onChange((pos) => {
      if (modelViewerRef.current) {
        const rotation = pos * 360 * 3;
        modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
      }
    });
  }, [scrollYProgress]);
  
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
        propertyTitle: property.title,
        propertyId: property._id
      });
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      setFormStatus('error');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!property) return (
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

              {property.fruitImage && (
                <button 
                  onClick={() => setShowFruitPopup(true)}
                  className="inline-flex items-center gap-3 bg-[#10b981] hover:bg-white text-black px-6 md:px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 group"
                >
                  <Leaf size={18} className="group-hover:scale-110 transition-transform" />
                  <span>View Cultivation Info</span>
                </button>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] flex flex-col items-center md:items-start min-w-[300px]">
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Asking Price</p>
              <p className="text-5xl md:text-7xl font-black tracking-tighter text-white">₹{property.price?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 py-16 md:py-24 relative z-20">
        <div className="flex flex-col gap-32">
          
          {/* Main Content Area - Narrower to leave more room for 3D model */}
          <div className="space-y-48 w-full max-w-6xl mx-auto">
            
            {/* Visual Gallery - Left Aligned */}
            {(property.images.length > 1 || property.fruitImage) && (
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:w-3/5"
              >
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Visual Gallery</h3>
                <div className="flex flex-wrap gap-4">
                  {/* Property Images */}
                  {property.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-primary shadow-lg scale-105 opacity-100' : 'border-white/10 opacity-40 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                  
                  {/* Cultivation Image Thumbnail */}
                  {property.fruitImage && (
                    <button
                      onClick={() => setShowFruitPopup(true)}
                      className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-[#10b981]/30 bg-[#10b981]/10 flex flex-col items-center justify-center gap-2 group transition-all hover:border-[#10b981] hover:bg-[#10b981]/20"
                    >
                      <Image src={property.fruitImage} alt="Cultivation Thumbnail" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-transparent transition-all">
                        <Leaf className="text-[#10b981]" size={24} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white mt-1">Farming</span>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Property Details - Right Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-end"
            >
              <div className="md:w-3/5 w-full space-y-12 relative overflow-hidden rounded-[3rem] bg-white/5 border border-white/10 p-8 md:p-12">
                {/* Background Image for Details */}
              {property.images[0] && (
                <div className="absolute inset-0 z-0 opacity-[0.03] scale-110 blur-sm pointer-events-none">
                  <Image src={property.images[0]} alt="Background" fill className="object-cover" />
                </div>
              )}

              <div className="relative z-10 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-12">
                  <span className="w-12 h-[2px] bg-primary"></span>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest">Property Details</h2>
                </div>

                {property.details && property.details.length > 0 ? (
                  <div className="space-y-16">
                    {property.details.slice(0, isReadMore ? undefined : 2).map((detail: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-12 border-b border-white/10 pb-16 group">
                        <div className="md:w-1/3 relative">
                          {detail.sideHeading && (
                            <div className="mb-4">
                              <span className="text-primary/60 font-black uppercase tracking-[0.3em] text-[10px] block mb-2">{detail.sideHeading}</span>
                              {detail.showArrow && <span className="text-primary inline-block animate-pulse">→</span>}
                            </div>
                          )}
                          <h3 className="text-xl font-black text-white uppercase tracking-widest">{detail.heading}</h3>
                        </div>
                        <div className="md:w-2/3">
                            {detail.isPointed ? (
                            <ul className="space-y-4">
                              {detail.content.split('\n').filter((line: string) => line.trim()).map((line: string, lIdx: number) => {
                                const hasArrow = line.trim().startsWith('→') || line.trim().startsWith('->');
                                const cleanLine = line.trim().replace(/^[-\u2022\u2192]|^(->)\s*/, '');
                                return (
                                  <li key={lIdx} className="flex gap-4 text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
                                    {hasArrow ? (
                                      <span className="text-primary mt-1 flex-shrink-0 font-black text-2xl">→</span>
                                    ) : (
                                      <span className="text-primary mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></span>
                                    )}
                                    <span>{cleanLine}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                              {detail.content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {property.details.length > 2 && (
                      <div className="flex justify-center pt-8">
                        <button 
                          onClick={() => setIsReadMore(!isReadMore)}
                          className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:text-white hover:border-white transition-all"
                        >
                          {isReadMore ? 'Read Less' : 'Read More Details'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-b border-white/10 pb-16">
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Dragon Fruit Plantation Section - Left Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-start"
            >
              <div className="md:w-3/5 w-full relative z-10 p-8 md:p-12 bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4 mb-12">
                  <span className="w-12 h-[2px] bg-primary"></span>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">Dragon Fruit Plantation & Profit Model</h2>
                </div>
                
                <div className="space-y-8 relative z-10">
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
                    Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.
                  </p>
                  <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
                    Dragon fruit plants can yield fruits for up to 30 years, providing long-term income stability. The produce generated will be sold, and the profits will be shared as per the model mentioned above.
                  </p>
                  <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
                    Additionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes.
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              </div>
            </motion.div>

            {/* Passive Income Section - Right Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-end"
            >
              <div className="md:w-3/5 w-full relative z-10 p-8 md:p-12 bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] border border-primary/20">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[2px] bg-primary"></span>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">Passive Income</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-primary font-black text-2xl mb-2">Sustainable</p>
                    <p className="text-gray-500 text-sm">Long-term agricultural returns</p>
                  </div>
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-primary font-black text-2xl mb-2">Hassle-Free</p>
                    <p className="text-gray-500 text-sm">Full management provided</p>
                  </div>
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-primary font-black text-2xl mb-2">Secure</p>
                    <p className="text-gray-500 text-sm">Asset-backed investment</p>
                  </div>
                </div>
              </div>
            </motion.div>

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
                          className="w-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 disabled:opacity-70 group shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
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
            </div>
          </div>
        </div>

          {/* Sidebar - Integrated as a floating element or moved to top/bottom */}
          <div className="max-w-lg mx-auto w-full lg:max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4 lg:col-span-1">
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

      {/* 3D Model Swaying Effect - Exact Logic from Snippet */}
      {property.threeDElement && (
        <motion.div 
          style={{ 
            x: modelX, 
            y: modelY
          }}
          className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 flex items-center justify-center overflow-visible"
        >
          <div className="w-[300px] h-[400px] pointer-events-auto cursor-pointer" onClick={() => setShowFruitPopup(true)}>
            <ModelViewer
              ref={modelViewerRef}
              src={property.threeDElement}
              alt="3D Property Experience"
              camera-controls
              disable-zoom
              disable-pan
              shadow-intensity="2"
              exposure="1.2"
              bounds="tight"
              camera-orbit="0deg 75deg 10m"
              min-camera-orbit="auto auto 10m"
              max-camera-orbit="auto auto 10m"
              field-of-view="25deg"
              interaction-prompt="none"
              style={{ width: '100%', height: '100%' }}
            ></ModelViewer>
          </div>
        </motion.div>
      )}

      {/* Floating Scroll Effect Dragon Fruit */}
      {property.fruitImage && !property.threeDElement && (
        <motion.div 
          style={{ x: fruitX, rotate: fruitRotate }}
          className="fixed top-1/4 left-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none z-50 opacity-20 md:opacity-30 blur-[1px]"
        >
          <Image src={property.fruitImage} alt="Floating Fruit" fill className="object-contain" />
        </motion.div>
      )}

      {/* Fruit Info Popup */}
      {showFruitPopup && property.fruitImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl transition-all duration-500" onClick={() => setShowFruitPopup(false)}>
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)] relative flex flex-col md:flex-row h-auto max-h-[90vh] md:aspect-video" onClick={e => e.stopPropagation()}>
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <Image src={property.fruitImage} alt="Cultivation" fill className="object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-8 md:p-16 flex flex-col justify-start items-start text-left w-full md:w-3/4 h-full overflow-y-auto custom-scrollbar">
              <div className="bg-primary/20 backdrop-blur-md p-4 rounded-2xl mb-8 border border-primary/20 mt-10 md:mt-0 flex-shrink-0">
                <Leaf className="text-primary" size={40} />
              </div>
              
              <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-tight flex-shrink-0">
                Dragon Fruit<br/><span className="text-primary">Plantation & Profit Model</span>
              </h3>
              
              <div className="w-24 h-2 bg-primary mb-10 rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] flex-shrink-0"></div>
              
              <div className="space-y-8 pb-12">
                <p className="text-gray-100 text-lg md:text-2xl leading-relaxed font-medium whitespace-pre-wrap">
                  {property.fruitInfo || "No additional details provided for this crop."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-primary/50 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Yield Period</p>
                    <p className="text-3xl font-black text-white">Up to 30 Years</p>
                    <p className="text-gray-500 text-sm mt-2">Sustainable long-term agricultural asset</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 group hover:border-primary/50 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Profit Share</p>
                    <p className="text-3xl font-black text-white">50% to Client</p>
                    <p className="text-gray-500 text-sm mt-2">Transparent revenue sharing model</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowFruitPopup(false)}
                className="mt-6 mb-8 bg-primary text-black font-black uppercase tracking-widest px-12 py-5 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/40 group flex items-center gap-3 flex-shrink-0"
              >
                <span>Close Model</span>
                <X size={18} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Close Button Mobile */}
            <button 
              onClick={() => setShowFruitPopup(false)}
              className="absolute top-6 right-6 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-primary hover:text-black transition-colors backdrop-blur-md border border-white/10 md:hidden"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
