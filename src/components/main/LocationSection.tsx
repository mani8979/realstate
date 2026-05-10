'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Building2, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationSection = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const address = "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026.";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side: Text Content */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-12 bg-primary"></div>
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Our Presence</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                  FIND US <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">LOCALLY</span>
                </h2>
              </div>

              <div className="glass-card p-8 md:p-10 relative group hover:border-primary/30 transition-all duration-700">
                <div className="absolute -top-6 -right-6 bg-primary p-4 rounded-2xl shadow-xl shadow-primary/20 rotate-12 group-hover:rotate-0 transition-all duration-500">
                  <MapPin className="text-white" size={32} />
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-gold font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                      <Building2 size={18} className="text-gold" />
                      Address
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {address}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl mt-1">
                        <Navigation className="text-primary" size={20} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
                          “Look bro, this is the building. Shop No. 202 is located on the second floor, above Tumble Dry on the first floor.”
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsMapOpen(true)}
                    className="btn-primary w-full group"
                  >
                    View Interactive Map
                    <Maximize2 size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Visual Representation */}
            <div className="relative group cursor-pointer" onClick={() => setIsMapOpen(true)}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-gold/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mb-8 inline-block p-6 bg-black/50 backdrop-blur-xl rounded-full border border-white/10">
                      <MapPin className="text-primary animate-bounce" size={64} />
                    </div>
                    <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Strategic Location</h4>
                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">Located in the heart of Gajuwaka, our office is easily accessible and positioned for your convenience.</p>
                    <div className="inline-flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs group-hover:text-white transition-colors">
                      Click to Expand Map <Maximize2 size={14} />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-8 -left-8 glass-card p-6 border-primary/20 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Building2 className="text-primary" size={24} />
                  </div>
                  <div>
                    <div className="text-white font-black text-sm uppercase tracking-tighter">Shop No. 202</div>
                    <div className="text-gray-400 text-xs uppercase tracking-widest">Second Floor</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMapOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setIsMapOpen(false)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>

              <iframe 
                src={embedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Office Location Map"
                className="grayscale-[0.5] invert-[0.9] hue-rotate-[180deg]"
              />

              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <div className="glass-card p-4 flex items-center justify-between border-primary/20">
                   <div className="flex items-center gap-3">
                      <div className="bg-primary p-2 rounded-lg">
                        <MapPin size={16} className="text-white" />
                      </div>
                      <p className="text-white font-bold text-xs md:text-sm uppercase tracking-tighter truncate max-w-[200px] md:max-w-md">
                        {address}
                      </p>
                   </div>
                   <a 
                    href="https://maps.app.goo.gl/dvqvbugWe8XHJAnt7?g_st=aw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="pointer-events-auto flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
                   >
                     Google Maps <ExternalLink size={12} />
                   </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LocationSection;
