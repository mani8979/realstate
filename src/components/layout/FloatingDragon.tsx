'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

const FloatingDragon = () => {
  const [showPopup, setShowPopup]           = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [pos, setPos]                       = useState({ x: 0, y: 0 });
  const [shouldLoad, setShouldLoad]         = useState(false);
  const [visible, setVisible]               = useState(true);
  const [mounted, setMounted]               = useState(false);
  const [hovered, setHovered]               = useState(false);
  const pathname                            = usePathname();
  const modelViewerRef                      = useRef<any>(null);
  const targetRef                           = useRef({ x: 0, y: 0 });
  const { scrollYProgress }                 = useScroll();

  useEffect(() => {
    const timer    = setTimeout(() => setShouldLoad(true), 2000);
    const onScroll = () => { setShouldLoad(true); window.removeEventListener('scroll', onScroll); };
    window.addEventListener('scroll', onScroll);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    setMounted(true);

    const vW0   = window.innerWidth;
    const vH0   = window.innerHeight;
    const ms0   = vW0 < 768 ? 60 : 110;
    const pad   = 40;

    // Start top-right
    let curX = vW0 - ms0 - pad;
    let curY = vH0 * 0.15;
    targetRef.current = { x: curX, y: curY };

    // ── Compute new targets from scroll state ──────────────────────────────
    const computeTargets = () => {
      const vW      = window.innerWidth;
      const vH      = window.innerHeight;
      const mSize   = vW < 768 ? 60 : 110;
      const isMob   = vW < 768;

      // Y: scroll progress → 15 % … 80 % of viewport
      const pageH    = document.body.scrollHeight - vH;
      const progress = pageH > 0 ? Math.min(1, window.scrollY / pageH) : 0;
      const newY     = vH * (0.15 + progress * 0.65);

      // X: read real card rect, place model in opposite empty strip
      let newX = targetRef.current.x; // hold position by default

      if (!isMob) {
        const trigTop = vH * 0.25;
        const trigBot = vH * 0.75;
        const sections = Array.from(
          document.querySelectorAll<HTMLElement>('[data-model-align]')
        );

        let sectionFound = false;
        for (const el of sections) {
          const r = el.getBoundingClientRect();
          if (r.top < trigBot && r.bottom > trigTop) {
            sectionFound = true;
            const align   = el.dataset.modelAlign ?? 'left';
            const card    = el.querySelector<HTMLElement>('.glass-card');
            const cr      = card?.getBoundingClientRect();

            if (align === 'right' && cr) {
              // Card on RIGHT → empty left strip
              newX = Math.max(mSize + 16, cr.left / 2);
            } else if (cr) {
              // Card on LEFT/CENTER → empty right strip
              const mid = cr.right + (vW - cr.right) / 2;
              newX = Math.min(vW - mSize - 16, mid);
            } else {
              newX = align === 'right' ? mSize + pad : vW - mSize - pad;
            }
            break;
          }
        }

        // No section in band → snap to right edge only when near top
        if (!sectionFound && window.scrollY < vH * 0.5) {
          newX = vW - mSize - pad;
        }
      } else {
        // Mobile: always right
        newX = vW - ms0 - pad;
      }

      targetRef.current = { x: newX, y: newY };
    };

    // Initial target
    computeTargets();

    // Only recompute on actual scroll
    let lastSY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastSY) > 1) {
        lastSY = window.scrollY;
        computeTargets();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── rAF: smooth lerp only — targets never change here ─────────────────
    let frameId : number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const { x: tx, y: ty } = targetRef.current;

      // halfLifeX = 1.8 s (slow, cinematic) | halfLifeY = 0.65 s (follows scroll)
      const ax = 1 - Math.pow(0.5, dt / 1.8);
      const ay = 1 - Math.pow(0.5, dt / 0.65);

      const dx = (tx - curX) * ax;
      const dy = (ty - curY) * ay;

      if (Math.abs(dx) > 0.15) curX += dx;
      if (Math.abs(dy) > 0.15) curY += dy;

      const vW    = window.innerWidth;
      const vH    = window.innerHeight;
      const mSize = vW < 768 ? 60 : 110;
      curX = Math.max(mSize, Math.min(vW - mSize, curX));
      curY = Math.max(mSize, Math.min(vH - mSize, curY));

      setPos({ x: curX, y: curY });

      // Visibility: hide over inventory / enquiry zones
      const zones = document.querySelectorAll<HTMLElement>(
        '.dragon-disappear, .model-hide-zone'
      );
      let hide = false;
      zones.forEach(z => {
        const r = z.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(r.bottom, vH) - Math.max(r.top, 0));
        if (overlap > vH * 0.28) hide = true;
      });
      setVisible(!hide);

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [mounted]);

  useEffect(() => {
    const propertyId = pathname?.split('/properties/')?.[1]?.split('/')?.[0];
    if (propertyId && propertyId.length > 10) {
      fetch(`/api/properties/${propertyId}?t=${Date.now()}`)
        .then(r => r.json())
        .then(d => setCurrentProperty(d))
        .catch(() => setCurrentProperty(null));
    } else {
      setCurrentProperty(null);
    }
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (modelViewerRef.current)
      modelViewerRef.current.cameraOrbit = `${v * 360 * 3}deg 75deg 10m`;
  });

  if (!mounted || !shouldLoad)        return null;
  if (pathname?.startsWith('/admin')) return null;
  const modelSrc = currentProperty?.threeDElement;
  if (!modelSrc)                      return null;

  const isMob  = typeof window !== 'undefined' && window.innerWidth < 768;
  const mW     = isMob ? 110 : 170;
  const mH     = isMob ? 148 : 225;

  return (
    <>
      <motion.div
        style={{ x: pos.x, y: pos.y, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 pointer-events-none z-[100]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
          transition={{ duration: visible ? 1.0 : 0.2, ease: 'easeInOut' }}
          style={{ width: mW, height: mH }}
          className="relative pointer-events-auto cursor-pointer"
          onClick={() => setShowPopup(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/30 pointer-events-none"
            animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <ModelViewer
            ref={modelViewerRef}
            src={modelSrc}
            alt="Property 3D Model"
            camera-controls disable-zoom disable-pan
            shadow-intensity="2" exposure="1.2" bounds="tight"
            camera-orbit="0deg 75deg 10m"
            min-camera-orbit="auto auto 10m"
            max-camera-orbit="auto auto 10m"
            field-of-view="25deg" interaction-prompt="none"
            style={{ width: '100%', height: '100%' }}
          ></ModelViewer>

          <AnimatePresence>
            {hovered && (
              <motion.div
                key="tip"
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0,  scale: 1   }}
                exit   ={{ opacity: 0, y: 8,  scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                           bg-black/85 backdrop-blur-md text-white
                           text-[9px] font-black uppercase tracking-[0.18em]
                           px-4 py-2 rounded-full border border-primary/40
                           shadow-[0_0_16px_rgba(16,185,129,0.3)] pointer-events-none z-10"
              >
                <span className="text-primary mr-1">✦</span>
                View Plantation &amp; Cultivation Info
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {showPopup && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-white/90 dark:bg-black/95 backdrop-blur-3xl"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-primary/30
                       rounded-[3rem] overflow-hidden flex flex-col md:flex-row
                       shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-8 right-8 z-[210] bg-black/10 dark:bg-white/10
                         hover:bg-red-500 text-black dark:text-white p-3 rounded-full transition-all"
            ><X size={24} /></button>

            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col text-left">
              <div className="bg-primary/20 p-5 rounded-2xl mb-10 border border-primary/20 flex-shrink-0 w-fit">
                <Leaf className="text-primary" size={40} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
                {currentProperty?.title?.toLowerCase().includes('sandalwood') ? 'Plantation' : 'Cultivation'}
                <br /><span className="text-black dark:text-white">Model</span>
              </h3>
              <div className="space-y-10 text-gray-700 dark:text-gray-300">
                {currentProperty?.fruitDetails?.length > 0 ? (
                  <div className="space-y-12">
                    {currentProperty.fruitDetails.map((d: any, i: number) => (
                      <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                          {d.showArrow && <span className="text-primary font-bold text-2xl">→</span>}
                          <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">{d.heading}</p>
                        </div>
                        {d.isPointed ? (
                          <ul className="grid grid-cols-1 gap-4">
                            {d.content.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                              <li key={j} className="flex gap-4 items-start bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{line.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xl leading-relaxed font-medium bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-white/5 italic whitespace-pre-line">{d.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : currentProperty?.fruitInfo ? (
                  <div className="text-xl leading-relaxed font-medium whitespace-pre-line prose dark:prose-invert max-w-none">{currentProperty.fruitInfo}</div>
                ) : (
                  <>
                    <p className="text-xl leading-relaxed font-medium">Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.</p>
                    <div className="space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">Plantation Details (Per 100 Sq. Yards)</p>
                      <ul className="grid grid-cols-1 gap-3">
                        {['40 dragon fruit plants','4 plants per pole','10 poles in each 100 sq. yards'].map((item, i) => (
                          <li key={i} className="flex gap-3 items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/5">
                            <span className="text-primary font-bold">→</span> {item}
                          </li>
                        ))}
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
                        <div className="h-10 w-[1px] bg-primary/30" />
                        <div className="text-center">
                          <p className="text-4xl font-black text-primary">50%</p>
                          <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">Client</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => setShowPopup(false)} className="mt-16 bg-primary text-black font-black uppercase tracking-widest py-6 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-primary/30">
                Close Details
              </button>
            </div>

            <div className="w-full md:w-1/2 h-64 md:h-full bg-white dark:bg-black/40 relative border-l border-white/5">
              {currentProperty?.threeDElement ? (
                <ModelViewer src={currentProperty.threeDElement} auto-rotate camera-controls shadow-intensity="2" exposure="1.2" style={{ width: '100%', height: '100%' }}></ModelViewer>
              ) : currentProperty?.fruitImage ? (
                <img src={currentProperty.fruitImage} alt="Fruit Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700"><Leaf size={100} className="opacity-10" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default FloatingDragon;
