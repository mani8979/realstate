'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

const FloatingDragon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const modelViewerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();

  // Swaying logic - Must be above early returns
  const modelX = useTransform(scrollYProgress, (pos) => {
    const horizontalMove = Math.cos(pos * Math.PI * 3) * 30;
    return `${horizontalMove}vw`;
  });

  const modelY = useTransform(scrollYProgress, [0, 1], ['0vh', '80vh']);

  useEffect(() => {
    setMounted(true);
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      });
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (modelViewerRef.current) {
      const rotation = latest * 360 * 3;
      modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
    }
  });

  // Don't show on admin pages or during SSR - Moved below hooks
  if (!mounted || pathname?.startsWith('/admin')) return null;

  // Don't show if no model is set
  if (!settings?.globalThreeDModel) return null;

  return (
    <>
      <motion.div 
        style={{ x: modelX, y: modelY }}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[100] flex items-center justify-center overflow-visible"
      >
        <div className="w-[150px] h-[200px] md:w-[250px] md:h-[300px] pointer-events-auto cursor-pointer" onClick={() => setShowPopup(true)}>
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl" onClick={() => setShowPopup(false)}>
          <div 
            className="relative w-full max-w-4xl bg-[#111] border-2 border-primary rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(16,185,129,0.3)] h-auto md:h-[80vh] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Content Side */}
            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col text-left">
              <div className="bg-primary/20 p-4 rounded-2xl mb-8 border border-primary/20 flex-shrink-0 w-fit">
                <Leaf className="text-primary" size={32} />
              </div>
              
              <h3 className="text-4xl font-black text-primary uppercase tracking-widest mb-6">
                {settings.globalPopupTitle || '3D Experience'}
              </h3>
              
              <div className="space-y-8 flex-grow">
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {settings.globalPopupContent || 'Information about this 3D model will appear here.'}
                </p>
              </div>

              <button 
                onClick={() => setShowPopup(false)}
                className="mt-12 bg-primary text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/20"
              >
                Close Details
              </button>
            </div>

            {/* Model Preview Side */}
            <div className="hidden md:block w-1/2 h-full bg-black/50 relative border-l border-white/10">
              <ModelViewer
                src={settings.globalThreeDModel}
                auto-rotate
                camera-controls
                shadow-intensity="2"
                environment-image="neutral"
                exposure="1.2"
                style={{ width: '100%', height: '100%' }}
              ></ModelViewer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingDragon;
