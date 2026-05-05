'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Phone, MessageSquare, Send, ArrowLeft, Share2, X, Leaf } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

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

      <div className="container mx-auto px-6 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Visual Gallery */}
            {(property.images.length > 1 || property.fruitImage) && (
              <div>
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
              </div>
            )}

            <div className="space-y-12 relative overflow-hidden rounded-[3rem]">
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
                    {property.details.map((detail: any, idx: number) => (
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

              {/* 3D Element Section */}
              {property.threeDElement && (
                <div className="mt-16 bg-white/5 rounded-[3rem] p-8 md:p-12 border border-white/10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-4">3D Visual Experience</h3>
                      <p className="text-gray-400 font-medium max-w-md">Explore the property in a fully immersive 3D environment to get a better sense of the layout and landscape.</p>
                    </div>
                    <a 
                      href={property.threeDElement} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-primary text-black font-black uppercase tracking-widest px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-3 whitespace-nowrap"
                    >
                      <div className="w-2 h-2 rounded-full bg-black animate-ping"></div>
                      <span>Open 3D Model</span>
                    </a>
                  </div>
                </div>
              )}


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
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

              {/* Inquiry Form */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem]">
                <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-8">Inquire Now</h3>
                <form onSubmit={handleEnquiry} className="space-y-6">
                  <div>
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-2 block">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-black/50 text-white rounded-2xl focus:ring-2 focus:ring-primary/50 border border-white/10 transition-all placeholder:text-white/20"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-6 py-4 bg-black/50 text-white rounded-2xl focus:ring-2 focus:ring-primary/50 border border-white/10 transition-all placeholder:text-white/20"
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-2 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-6 py-4 bg-black/50 text-white rounded-2xl focus:ring-2 focus:ring-primary/50 border border-white/10 transition-all resize-none placeholder:text-white/20"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-primary hover:bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {formStatus === 'loading' ? (
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                  {formStatus === 'success' && <p className="text-primary font-bold text-center mt-4 text-sm uppercase tracking-widest">Enquiry sent successfully!</p>}
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Fruit Info Popup */}
      {showFruitPopup && property.fruitImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md transition-all duration-500" onClick={() => setShowFruitPopup(false)}>
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-auto md:aspect-video" onClick={e => e.stopPropagation()}>
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
              <Image src={property.fruitImage} alt="Cultivation" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-8 md:p-16 flex flex-col justify-center items-start text-left w-full md:w-2/3 h-full overflow-y-auto">
              <div className="bg-primary/20 backdrop-blur-md p-4 rounded-2xl mb-8 border border-primary/20">
                <Leaf className="text-primary" size={40} />
              </div>
              
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
                Dragon Fruit<br/><span className="text-primary">Plantation & Profit Model</span>
              </h3>
              
              <div className="w-24 h-2 bg-primary mb-10 rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"></div>
              
              <div className="space-y-6">
                <p className="text-gray-100 text-lg md:text-2xl leading-relaxed font-medium">
                  {property.fruitInfo || "No additional details provided for this crop."}
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="border-l-2 border-primary/50 pl-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Yield Period</p>
                    <p className="text-2xl font-black text-white">Up to 30 Years</p>
                  </div>
                  <div className="border-l-2 border-primary/50 pl-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Profit Share</p>
                    <p className="text-2xl font-black text-white">50% to Client</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowFruitPopup(false)}
                className="mt-12 bg-primary text-black font-black uppercase tracking-widest px-12 py-5 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/40 group flex items-center gap-3"
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
