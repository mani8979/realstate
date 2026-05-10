'use client';

import React from 'react';
import { MapPin, Navigation, Building2 } from 'lucide-react';

interface LocationSectionProps {
  content?: {
    officeAddress?: string;
    officeDescription?: string;
    officeMapUrl?: string;
  };
}

const LocationSection = ({ content }: LocationSectionProps) => {
  const address = content?.officeAddress || "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026.";
  const description = content?.officeDescription || "Look bro, this is the building. Shop No. 202 is located on the second floor, above Tumble Dry on the first floor.";
  const mapUrl = content?.officeMapUrl || "https://maps.app.goo.gl/dvqvbugWe8XHJAnt7?g_st=aw";
  
  // Use the address to generate a reliable embed URL with iwloc=0 to hide the info card if possible
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=0&output=embed`;

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
                  <span className="text-transparent bg-clip-text bg-gradient-r from-primary to-emerald-400">LOCALLY</span>
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
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Direct Map Embedding */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-gold/20 blur-2xl opacity-50"></div>
              
              <div className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
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
    </section>
  );
};

export default LocationSection;
