'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import Image from 'next/image';

const ModelViewer = 'model-viewer' as any;

const FloatingDragon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const modelViewerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();

  // Swaying logic
  const modelX = useTransform(scrollYProgress, (pos) => {
    const horizontalMove = Math.cos(pos * Math.PI * 3) * 30;
    return `${horizontalMove}vw`;
  });

  const modelY = useTransform(scrollYProgress, [0, 1], ['0vh', '80vh']);

  useEffect(() => {
    return scrollYProgress.onChange((pos) => {
      if (modelViewerRef.current) {
        const rotation = pos * 360 * 3;
        modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
      }
    });
  }, [scrollYProgress]);

  // Default dragon fruit model - using a placeholder if not provided
  const defaultModel = "https://modelviewer.dev/shared-assets/models/Astronaut.glb"; 

  return (
    <>
      <motion.div 
        style={{ x: modelX, y: modelY }}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[100] flex items-center justify-center overflow-visible"
      >
        <div className="w-[150px] h-[200px] md:w-[250px] md:h-[300px] pointer-events-auto cursor-pointer" onClick={() => setShowPopup(true)}>
          <ModelViewer
            ref={modelViewerRef}
            src={defaultModel}
            alt="Dragon Fruit Experience"
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
            className="relative w-full max-w-4xl bg-[#111] border-2 border-primary rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] h-auto md:h-[80vh] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Content Side */}
            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="bg-primary/20 p-4 rounded-2xl mb-8 border border-primary/20 flex-shrink-0 w-fit">
                <Leaf className="text-primary" size={32} />
              </div>
              
              <h3 className="text-4xl font-black text-primary uppercase tracking-widest mb-6">Pitaya Secrets</h3>
              
              <div className="space-y-8 flex-grow">
                <div className="space-y-4">
                  <p className="text-primary/60 font-black uppercase tracking-[0.2em] text-xs">Origin & Profit</p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Dragon fruit is a high-demand tropical crop. Our plantations offer long-term stability with yields lasting up to 30 years. Profits are shared 50/50 with clients.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-primary/60 font-black uppercase tracking-[0.2em] text-xs">Nutritional Power</p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Rich in Vitamin C, fiber, and iron. It's a perfect sustainable agricultural investment that combines health and wealth.
                  </p>
                </div>
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
                src={defaultModel}
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
