'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
  useMotionValueEvent, useScroll,
} from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

const FloatingDragon = () => {
  const [showPopup,        setShowPopup]        = useState(false);
  const [currentProperty,  setCurrentProperty]  = useState<any>(null);
  const [shouldLoad,       setShouldLoad]        = useState(false);
  const [visible,          setVisible]           = useState(true);
  const [hovered,          setHovered]           = useState(false);
  const pathname        = usePathname();
  const modelViewerRef  = useRef<any>(null);
  const { scrollYProgress } = useScroll();

  // ── Motion values bypass React state → zero re-renders, zero drift ─────────
  const mX      = useMotionValue(typeof window !== 'undefined' ? window.innerWidth - 120 : 900);
  const mY      = useMotionValue(typeof window !== 'undefined' ? window.innerHeight * 0.12 : 120);
  // Slow spring for X (cinematic side-switch), Y is direct (never drifts)
  const springX = useSpring(mX, { stiffness: 18, damping: 22, mass: 3 });

  // ── Lazy-load trigger ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShouldLoad(true), 1800);
    const s = () => { setShouldLoad(true); window.removeEventListener('scroll', s); };
    window.addEventListener('scroll', s);
    return () => { clearTimeout(t); window.removeEventListener('scroll', s); };
  }, []);

  // ── Scroll-driven positioning (ONLY fires when user scrolls) ───────────────
  useEffect(() => {
    const PAD = 36;

    const compute = () => {
      const W   = window.innerWidth;
      const H   = window.innerHeight;
      const msz = W < 768 ? 60 : 110;

      // ── Y: direct from scroll progress — zero lag, zero post-scroll drift ──
      const pageH = Math.max(1, document.body.scrollHeight - H);
      const prog  = Math.min(1, window.scrollY / pageH);
      mY.set(Math.max(msz, Math.min(H - msz, H * (0.12 + prog * 0.68))));

      // ── X: section-alignment driven ───────────────────────────────────────
      if (W < 768) { mX.set(W - msz - PAD); return; }

      const trigTop = H * 0.20;
      const trigBot = H * 0.80;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-model-align]')
      );

      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top < trigBot && r.bottom > trigTop) {
          const align = el.dataset.modelAlign ?? 'left';
          const card  = el.querySelector<HTMLElement>('.glass-card');
          const cr    = card?.getBoundingClientRect();

          if (align === 'right') {
            // text RIGHT → model sits in LEFT empty strip
            mX.set(cr ? Math.max(msz + PAD, cr.left / 2) : msz + PAD);
          } else {
            // text LEFT or CENTER → model sits in RIGHT empty strip
            mX.set(cr ? Math.min(W - msz - PAD, cr.right + (W - cr.right) / 2)
                      : W - msz - PAD);
          }
          return;
        }
      }

      // No section in trigger band → snap to right edge
      mX.set(W - msz - PAD);
    };

    // Set correct initial position without spring animation
    compute();
    // Jump springX to current mX value so spring doesn't animate from 0
    springX.jump(mX.get());

    // Only recompute when scrollY actually changes
    let lastY = window.scrollY;
    const onScroll = () => {
      const sy = window.scrollY;
      if (Math.abs(sy - lastY) < 1) return;
      lastY = sy;
      compute();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Visibility check (rAF — cheap, no state churn) ─────────────────────────
  useEffect(() => {
    let frame: number;
    const tick = () => {
      const H = window.innerHeight;
      let hide = false;
      document.querySelectorAll<HTMLElement>(
        '.dragon-disappear, .model-hide-zone'
      ).forEach(z => {
        const r = z.getBoundingClientRect();
        if (Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) > H * 0.25)
          hide = true;
      });
      setVisible(!hide);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ── Fetch property data ────────────────────────────────────────────────────
  useEffect(() => {
    const pid = pathname?.split('/properties/')?.[1]?.split('/')?.[0];
    if (pid && pid.length > 10) {
      fetch(`/api/properties/${pid}?t=${Date.now()}`)
        .then(r => r.json()).then(setCurrentProperty).catch(() => setCurrentProperty(null));
    } else setCurrentProperty(null);
  }, [pathname]);

  // ── Camera orbit on scroll ─────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (modelViewerRef.current)
      modelViewerRef.current.cameraOrbit = `${v * 1080}deg 75deg 10m`;
  });

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!shouldLoad || pathname?.startsWith('/admin')) return null;
  const src = currentProperty?.threeDElement;
  if (!src) return null;

  const mob = typeof window !== 'undefined' && window.innerWidth < 768;
  const mW = mob ? 110 : 170;
  const mH = mob ? 148 : 225;

  return (
    <>
      {/* ── Floating model ─────────────────────────────────────────────────── */}
      <motion.div
        style={{ x: springX, y: mY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 pointer-events-none z-[100]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
          transition={{ duration: visible ? 0.8 : 0.2, ease: 'easeInOut' }}
          style={{ width: mW, height: mH }}
          className="relative pointer-events-auto cursor-pointer"
          onClick={() => setShowPopup(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/25 pointer-events-none"
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <ModelViewer
            ref={modelViewerRef} src={src} alt="3D Model"
            camera-controls disable-zoom disable-pan
            shadow-intensity="2" exposure="1.2" bounds="tight"
            camera-orbit="0deg 75deg 10m"
            min-camera-orbit="auto auto 10m" max-camera-orbit="auto auto 10m"
            field-of-view="25deg" interaction-prompt="none"
            style={{ width: '100%', height: '100%' }}
          ></ModelViewer>

          <AnimatePresence>
            {hovered && (
              <motion.div key="tip"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                           bg-black/85 backdrop-blur-md text-white text-[9px]
                           font-black uppercase tracking-[0.18em] px-4 py-2 rounded-full
                           border border-primary/40 shadow-[0_0_14px_rgba(16,185,129,0.3)]
                           pointer-events-none z-10"
              >
                <span className="text-primary mr-1">✦</span>
                View Plantation &amp; Cultivation Info
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Popup ──────────────────────────────────────────────────────────── */}
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
