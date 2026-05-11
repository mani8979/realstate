'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

const FloatingDragon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const modelViewerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Path-aware movement to stay in "Empty Spaces"
  // On mobile, we start much lower (after title/buttons) to avoid overlap
  // Gutter-focused movement: Stays in margins/gutters to avoid text overlap
  const modelX = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    isMobile 
      ? ["35vw", "-35vw", "0vw", "35vw", "-35vw", "0vw"] 
      : ["45vw", "-45vw", "0vw", "45vw", "0vw", "-45vw"] // Wide margins + transition crossing
  );

  const modelY = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    isMobile 
      ? ["40vh", "20vh", "50vh", "80vh", "60vh", "90vh"] 
      : ["15vh", "40vh", "50vh", "30vh", "70vh", "85vh"]
  );

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [isMobile ? 0.7 : 1, 1.4, 1.4, 0.9]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1440]);

  useEffect(() => {
    setMounted(true);
    // Fetch global settings
    fetch(`/api/content?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      });
  }, []);

  // Fetch current property if on property page
  useEffect(() => {
    const propertyId = pathname?.split('/properties/')?.[1];
    if (propertyId && propertyId.length > 10) { // Simple ID check
      fetch(`/api/properties/${propertyId}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          setCurrentProperty(data);
        })
        .catch(() => setCurrentProperty(null));
    } else {
      setCurrentProperty(null);
    }
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (modelViewerRef.current) {
      const rotation = latest * 360 * 4;
      modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
    }
  });

  // --- RESTRICTION LOGIC ---
  
  // Don't show if not mounted or on admin pages
  if (!mounted || pathname?.startsWith('/admin')) return null;

  // ONLY show on property pages
  if (!pathname?.includes('/properties/')) return null;

  // ONLY show if property is 'Lendy Pink Valley'
  const isLendyPinkValley = currentProperty?.title?.toLowerCase().includes('lendy pink valley');
  if (!isLendyPinkValley) return null;

  // Don't show if no model is set
  if (!settings?.globalThreeDModel) return null;

  return (
    <>
      <motion.div 
        style={{ x: modelX, y: modelY, scale, rotate }}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[100] flex items-center justify-center overflow-visible"
      >
        <div className="w-[200px] h-[260px] md:w-[300px] md:h-[380px] pointer-events-auto cursor-pointer" onClick={() => setShowPopup(true)}>
          <ModelViewer
            ref={modelViewerRef}
            src={settings.globalThreeDModel}
            alt="Global 3D Experience"
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

      {/* Global Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-white dark:bg-black/95 backdrop-blur-3xl" onClick={() => setShowPopup(false)}>
          <div 
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-primary/30 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowPopup(false)}
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
                Cultivation <br/> <span className="text-black dark:text-white">Model</span>
              </h3>
              
              <div className="space-y-10 text-gray-700 dark:text-gray-300">
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

              </div>

              <button 
                onClick={() => setShowPopup(false)}
                className="mt-16 bg-primary text-black font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/30"
              >
                Close Details
              </button>
            </div>

            {/* Media Preview Side */}
            <div className="w-full md:w-1/2 h-64 md:h-full bg-white dark:bg-black/40 relative border-l border-white/5">
              {currentProperty?.threeDElement ? (
                <ModelViewer
                  src={currentProperty.threeDElement}
                  auto-rotate
                  camera-controls
                  shadow-intensity="2"
                  exposure="1.2"
                  style={{ width: '100%', height: '100%' }}
                ></ModelViewer>
              ) : currentProperty?.fruitImage ? (
                <img 
                  src={currentProperty.fruitImage} 
                  alt="Fruit Preview" 
                  className="w-full h-full object-cover"
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
    </>
  );
};

export default FloatingDragon;
