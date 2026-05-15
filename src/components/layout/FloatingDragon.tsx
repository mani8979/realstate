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
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [shouldLoad, setShouldLoad] = useState(false);
  const [visible, setVisible] = useState(true); // controls opacity for disappear zones
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const modelViewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart Collision Avoidance State
  const obstaclesRef = useRef<DOMRect[]>([]);
  const lastScan = useRef(0);

  useEffect(() => {
    // Wait for page to be ready and a short delay or scroll
    const timer = setTimeout(() => setShouldLoad(true), 3000);
    const onScroll = () => {
      setShouldLoad(true);
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    let frameId: number;
    // Start at top-right of viewport
    let curX = window.innerWidth * 0.88;
    let curY = window.innerHeight * 0.12;
    
    const update = () => {
      if (!mounted) return;

      const now = Date.now();
      // Declare viewport dimensions FIRST (avoids TDZ in minified builds)
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      // Rescan obstacles every 1.5s - only repel from admin-marked zones
      if (now - lastScan.current > 1500) {
        const elements = document.querySelectorAll('.dragon-repel');
        obstaclesRef.current = Array.from(elements)
          .map(el => {
            const rect = el.getBoundingClientRect();
            // Skip off-screen elements
            if (rect.bottom < -100 || rect.top > viewportH + 100) return null;
            return rect;
          })
          .filter((r): r is DOMRect => r !== null && r.width > 10 && r.height > 10);
        lastScan.current = now;
      }

      // 1. Gentle orbital path: starts top-right, drifts slowly down and around
      const time = now / 6000;
      const idealX = (Math.cos(time) * 0.30 + 0.72) * viewportW;
      const idealY = (Math.sin(time * 0.5) * 0.28 + 0.45) * viewportH;

      // 2. Physics: drift towards ideal
      let forceX = (idealX - curX) * 0.012;
      let forceY = (idealY - curY) * 0.012;

      const modelSize = viewportW < 768 ? 55 : 100;
      
      // 3. Repel from .dragon-repel zones (admin content areas)
      obstaclesRef.current.forEach(rect => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = curX - cx;
        const dy = curY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const minDist = (Math.max(rect.width, rect.height) / 2) + modelSize + 40;

        if (dist < minDist) {
          const power = Math.pow((minDist - dist) / minDist, 2);
          const push = power * 25;
          forceX += (dx / dist) * push;
          forceY += (dy / dist) * push;
        }
      });

      // 4. Clamp inside viewport
      curX += forceX;
      curY += forceY;
      const padding = modelSize;
      curX = Math.max(padding, Math.min(viewportW - padding, curX));
      curY = Math.max(padding, Math.min(viewportH - padding, curY));

      setPos({ x: curX, y: curY });

      // 5. Disappear when overlapping any .dragon-disappear zone
      const disappearZones = document.querySelectorAll('.dragon-disappear');
      let shouldHide = false;
      disappearZones.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (
          curX + modelSize > rect.left &&
          curX - modelSize < rect.right &&
          curY + modelSize > rect.top &&
          curY - modelSize < rect.bottom
        ) {
          shouldHide = true;
        }
      });
      setVisible(!shouldHide);

      frameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frameId);
  }, [mounted]);

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
      const rotation = latest * 360 * 3;
      modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
    }
  });

  // --- RESTRICTION LOGIC ---
  
  // Don't show if not mounted, on admin pages, or not yet shouldLoad
  if (!mounted || !shouldLoad || pathname?.startsWith('/admin')) return null;

  // Only show if we have a property-specific model. Global fallback removed as per user request.
  const modelSrc = currentProperty?.threeDElement;

  // Don't show if no model is found for this specific property
  if (!modelSrc) return null;

  return (
    <>
      <motion.div 
        style={{ 
          x: pos.x, 
          y: pos.y,
          translateX: '-50%',
          translateY: '-50%'
        }}
        className="dragon-container fixed top-0 left-0 w-fit h-fit pointer-events-none z-[100] overflow-visible"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
          transition={{ duration: visible ? 1.5 : 0.4, ease: "easeOut" }}
          className="w-[120px] h-[160px] md:w-[180px] md:h-[240px] pointer-events-auto cursor-pointer" 
          onClick={() => setShowPopup(true)}
        >
          <ModelViewer
            ref={modelViewerRef}
            src={modelSrc}
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
        </motion.div>
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
                {currentProperty?.title?.toLowerCase().includes('sandalwood') ? 'Plantation' : 'Cultivation'} <br/> <span className="text-black dark:text-white">Model</span>
              </h3>
              
              <div className="space-y-10 text-gray-700 dark:text-gray-300">
                {currentProperty?.fruitDetails?.length > 0 ? (
                  <div className="space-y-12">
                    {currentProperty.fruitDetails.map((detail: any, i: number) => (
                      <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                          {detail.showArrow && <span className="text-primary font-bold text-2xl">→</span>}
                          <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">{detail.heading}</p>
                        </div>
                        {detail.isPointed ? (
                          <ul className="grid grid-cols-1 gap-4">
                            {detail.content.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                              <li key={j} className="flex gap-4 items-start bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{line.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xl leading-relaxed font-medium bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-white/5 italic whitespace-pre-line">
                            {detail.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : currentProperty?.fruitInfo ? (
                  <div className="text-xl leading-relaxed font-medium whitespace-pre-line prose dark:prose-invert max-w-none">
                    {currentProperty.fruitInfo}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
