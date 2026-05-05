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
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src={property.images[activeImage] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000'}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-24 left-6 md:left-16 z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8 z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary text-black font-black uppercase tracking-[0.2em] px-4 py-2 text-xs rounded-none">
                {property.type}
              </span>
              <span className="text-primary font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <MapPin size={16} /> {property.location}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
              {property.title}
            </h1>

            {/* Cultivation Info Quick Access */}
            {property.fruitImage && (
              <button 
                onClick={() => setShowFruitPopup(true)}
                className="mt-8 flex items-center gap-3 bg-[#10b981] hover:bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black uppercase tracking-widest text-xs md:text-sm transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] group"
              >
                <Leaf size={18} className="group-hover:scale-110 transition-transform" />
                <span>View Cultivation Info</span>
              </button>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-[2rem]">
            <p className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-2">Asking Price</p>
            <p className="text-4xl md:text-6xl font-black tracking-tighter">₹{property.price?.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Gallery Thumbnails */}
            {property.images.length > 1 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-6">Property Gallery</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {property.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative min-w-[120px] h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-primary shadow-lg scale-105 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Details */}
            <div className="space-y-12">
              <div className="flex items-center gap-4 mb-12">
                <span className="w-12 h-[2px] bg-primary"></span>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest">Property Details</h2>
              </div>

              {property.details && property.details.length > 0 ? (
                <div className="space-y-16">
                  {property.details.map((detail: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-12 border-b border-white/10 pb-16">
                      <div className="md:w-1/3">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">{detail.heading}</h3>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                          {detail.content}
                        </p>
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
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Image on top */}
            <div className="relative w-full h-[250px] md:h-[350px]">
              <Image src={property.fruitImage} alt="Cultivation" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
              <button 
                onClick={() => setShowFruitPopup(false)}
                className="absolute top-6 right-6 bg-black/50 text-white p-3 rounded-full hover:bg-primary hover:text-black transition-colors backdrop-blur-md border border-white/10"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Content below */}
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <div className="bg-[#10b981]/10 p-4 rounded-2xl mb-6">
                <Leaf className="text-primary" size={32} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-4">Cultivation Info</h3>
              <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium max-h-[40vh] overflow-y-auto scrollbar-hide px-2">
                {property.fruitInfo || "No additional details provided for this crop."}
              </p>
              
              <button 
                onClick={() => setShowFruitPopup(false)}
                className="mt-10 bg-primary text-black font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20"
              >
                Close Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
