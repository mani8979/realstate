'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

interface FruitInstance {
  id: number;
  x: number;
  y: number;
  vX: number;
  vY: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRot: { x: number; y: number; z: number };
  scale: number;
  driftPhase: number;
  bounces: number;
}

const FloatingDragon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fruits, setFruits] = useState<FruitInstance[]>([]);
  const pathname = usePathname();
  const nextId = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // ── Lazy load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ── Fetch property data ────────────────────────────────────────────────────
  useEffect(() => {
    const pid = pathname?.split('/properties/')?.[1]?.split('/')?.[0];
    if (pid && pid.length > 10) {
      fetch(`/api/properties/${pid}?t=${Date.now()}`)
        .then(r => r.json())
        .then(d => setCurrentProperty(d))
        .catch(() => setCurrentProperty(null));
    } else {
      setCurrentProperty(null);
    }
  }, [pathname]);

  // ── Spawn Logic ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldLoad) return;

    const spawn = () => {
      setFruits(prev => {
        if (prev.length > 8) return prev; 
        
        const newFruit: FruitInstance = {
          id: nextId.current++,
          x: Math.random() * 100,
          y: -20,
          vX: (Math.random() - 0.5) * 5,
          vY: Math.random() * 5 + 2,
          rotX: Math.random() * 360,
          rotY: Math.random() * 360,
          rotZ: Math.random() * 360,
          vRot: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
          },
          scale: Math.random() * 0.4 + 0.8,
          driftPhase: Math.random() * Math.PI * 2,
          bounces: 0
        };
        return [...prev, newFruit];
      });
    };

    const interval = setInterval(spawn, 2500);
    return () => clearInterval(interval);
  }, [shouldLoad]);

  // ── Physics Engine ─────────────────────────────────────────────────────────
  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const dt = (time - lastTimeRef.current) / 16;
        
        setFruits(prev => {
          return prev.map(f => {
            let { x, y, vX, vY, rotX, rotY, rotZ, vRot, driftPhase, bounces } = f;
            
            vY += 0.15 * dt;
            const drift = Math.sin(time / 1000 + driftPhase) * 0.05 * dt;
            vX += drift;
            
            y += vY * dt;
            x += vX * dt;
            
            rotX += vRot.x * dt;
            rotY += vRot.y * dt;
            rotZ += vRot.z * dt;
            
            const floor = 110; 
            if (y > floor && bounces < 1) {
              y = floor;
              vY = -vY * 0.3; 
              bounces++;
            }
            
            return { ...f, x, y, vX, vY, rotX, rotY, rotZ, bounces };
          }).filter(f => f.y < 150); 
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!shouldLoad || pathname?.startsWith('/admin')) return null;
  const src = currentProperty?.threeDElement;
  if (!src) return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <AnimatePresence>
          {fruits.map(f => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: f.scale }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: 150,
                height: 180,
                x: '-50%',
                y: '-50%',
                rotateX: f.rotX,
                rotateY: f.rotY,
                rotateZ: f.rotZ,
                perspective: 1000
              }}
              className="pointer-events-auto cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              <ModelViewer
                src={src}
                alt="Falling Fruit"
                loading="eager"
                auto-rotate-delay="0"
                interaction-prompt="none"
                shadow-intensity="1"
                exposure="1"
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-white/90 dark:bg-black/95 backdrop-blur-3xl"
          onClick={() => setShowPopup(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-primary/30 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPopup(false)}
              className="absolute top-8 right-8 z-[210] bg-white/10 hover:bg-red-500 text-white p-3 rounded-full transition-all">
              <X size={24} />
            </button>

            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col text-left">
              <div className="bg-primary/20 p-5 rounded-2xl mb-10 border border-primary/20 w-fit">
                <Leaf className="text-primary" size={40} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
                {currentProperty?.title?.toLowerCase().includes('sandalwood') ? 'Plantation' : 'Cultivation'}
                <br /><span className="text-white">Model</span>
              </h3>
              <div className="space-y-10 text-gray-300">
                {currentProperty?.fruitDetails?.length > 0 ? (
                  <div className="space-y-12">
                    {currentProperty.fruitDetails.map((d: any, i: number) => (
                      <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                          {d.showArrow && <span className="text-primary font-bold text-2xl">→</span>}
                          <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">{d.heading}</p>
                        </div>
                        {d.isPointed ? (
                          <ul className="grid gap-4">{d.content.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                            <li key={j} className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0" />
                              <span className="text-lg font-medium text-gray-200">{line.trim()}</span>
                            </li>
                          ))}</ul>
                        ) : (
                          <p className="text-xl leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/5 italic whitespace-pre-line">{d.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : currentProperty?.fruitInfo ? (
                  <div className="text-xl leading-relaxed whitespace-pre-line">{currentProperty.fruitInfo}</div>
                ) : (
                  <>
                    <p className="text-xl leading-relaxed">Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.</p>
                    <ul className="grid gap-3">{['40 dragon fruit plants','4 plants per pole','10 poles in each 100 sq. yards'].map((item,i)=>(
                      <li key={i} className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="text-primary font-bold">→</span>{item}
                      </li>
                    ))}</ul>
                    <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs text-center">Profit Sharing</p>
                      <div className="flex items-center justify-center gap-10">
                        {[['50%','Company','text-white'],['50%','Client','text-primary']].map(([p,l,c],i)=>(
                          <React.Fragment key={i}>
                            {i>0&&<div className="h-10 w-px bg-primary/30"/>}
                            <div className="text-center">
                              <p className={`text-4xl font-black ${c}`}>{p}</p>
                              <p className="text-[10px] uppercase font-bold text-gray-400">{l}</p>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => setShowPopup(false)}
                className="mt-16 bg-primary text-black font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                Close Details
              </button>
            </div>

            <div className="w-full md:w-1/2 h-64 md:h-full bg-black/40 relative border-l border-white/5">
              {currentProperty?.threeDElement ? (
                <ModelViewer src={currentProperty.threeDElement} auto-rotate camera-controls shadow-intensity="2" exposure="1.2" style={{width:'100%',height:'100%'}}></ModelViewer>
              ) : currentProperty?.fruitImage ? (
                <img src={currentProperty.fruitImage} alt="Preview" className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf size={100} className="opacity-10 text-gray-700"/>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"/>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default FloatingDragon;
