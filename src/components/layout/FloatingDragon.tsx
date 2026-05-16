'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

const FloatingDragon = () => {
  const [showPopup, setShowPopup]             = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [pos, setPos]                         = useState({ x: 0, y: 0 });
  const [shouldLoad, setShouldLoad]           = useState(false);
  const [visible, setVisible]                 = useState(true);
  const [hovered, setHovered]                 = useState(false);
  const pathname      = usePathname();
  const modelViewerRef = useRef<any>(null);
  const targetRef      = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  // ── Lazy load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShouldLoad(true), 2000);
    const s = () => { setShouldLoad(true); window.removeEventListener('scroll', s); };
    window.addEventListener('scroll', s);
    return () => { clearTimeout(t); window.removeEventListener('scroll', s); };
  }, []);

  // ── Core animation (runs once on mount) ────────────────────────────────────
  useEffect(() => {
    const vW   = window.innerWidth;
    const vH   = window.innerHeight;
    const mSz  = vW < 768 ? 60 : 110;
    const pad  = 40;

    // curX lerps; curY tracks scroll directly (no lag → no drift)
    let curX = vW - mSz - pad;

    // ── Compute where the model should sit ─────────────────────────────────
    const computeTargets = () => {
      const W    = window.innerWidth;
      const H    = window.innerHeight;
      const msz  = W < 768 ? 60 : 110;

      // Y — direct from scroll progress (no lerp so it never drifts)
      const pageH = Math.max(1, document.body.scrollHeight - H);
      const prog  = Math.min(1, window.scrollY / pageH);
      const newY  = H * (0.12 + prog * 0.66);

      // X — read actual card rect, place model in opposite empty strip
      let newX = targetRef.current.x || (W - msz - pad);

      if (W >= 768) {
        const tTop = H * 0.25;
        const tBot = H * 0.75;
        const sections = Array.from(
          document.querySelectorAll<HTMLElement>('[data-model-align]')
        );

        for (const el of sections) {
          const r = el.getBoundingClientRect();
          if (r.top < tBot && r.bottom > tTop) {
            const align = el.dataset.modelAlign ?? 'left';
            const card  = el.querySelector<HTMLElement>('.glass-card');
            const cr    = card?.getBoundingClientRect();

            if (align === 'right' && cr && cr.left > msz * 2) {
              newX = cr.left / 2;                            // center of left empty strip
            } else if (cr && cr.right < W - msz * 2) {
              newX = cr.right + (W - cr.right) / 2;         // center of right empty strip
            } else if (align === 'right') {
              newX = msz + pad;
            } else {
              newX = W - msz - pad;
            }
            break;
          }
        }

        // No section in band → if near top, reset to right edge
        const firstSection = sections[0];
        if (firstSection) {
          const fr = firstSection.getBoundingClientRect();
          if (fr.top > H) newX = W - msz - pad;             // above all content → right
        }
      } else {
        newX = W - msz - pad;                                // mobile: always right
      }

      newX = Math.max(msz + 12, Math.min(W - msz - 12, newX));
      targetRef.current = { x: newX, y: newY };
    };

    // Initial position
    computeTargets();
    curX = targetRef.current.x;

    // Recompute on EVERY scroll tick (Lenis fires continuously while scrolling)
    const onScroll = () => computeTargets();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── rAF: only lerp X; Y is set directly ─────────────────────────────────
    let frameId: number;
    let last = performance.now();

    const frame = (now: number) => {
      const dt  = Math.min((now - last) / 1000, 0.1);
      last = now;

      const { x: tx, y: ty } = targetRef.current;
      const W  = window.innerWidth;
      const H  = window.innerHeight;
      const sz = W < 768 ? 60 : 110;

      // X: slow cinematic lerp (2 s half-life)
      const ax = 1 - Math.pow(0.5, dt / 2.0);
      const dx = (tx - curX) * ax;
      if (Math.abs(dx) > 0.15) curX += dx;
      curX = Math.max(sz, Math.min(W - sz, curX));

      // Y: direct — zero lag, zero drift when scroll stops
      const curY = Math.max(sz, Math.min(H - sz, ty));

      setPos({ x: curX, y: curY });

      // Visibility — hide over inventory / enquiry zones
      let hide = false;
      document.querySelectorAll<HTMLElement>(
        '.dragon-disappear, .model-hide-zone'
      ).forEach(z => {
        const r = z.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0));
        if (overlap > H * 0.25) hide = true;
      });
      setVisible(!hide);

      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []); // ← run ONCE only, no mounted dependency that causes double-run

  // ── Fetch property ─────────────────────────────────────────────────────────
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

  // ── Scroll-driven camera ───────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (modelViewerRef.current)
      modelViewerRef.current.cameraOrbit = `${v * 1080}deg 75deg 10m`;
  });

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!shouldLoad)                    return null;
  if (pathname?.startsWith('/admin')) return null;
  const modelSrc = currentProperty?.threeDElement;
  if (!modelSrc)                      return null;

  const mob = typeof window !== 'undefined' && window.innerWidth < 768;
  const mW  = mob ? 110 : 170;
  const mH  = mob ? 148 : 225;

  return (
    <>
      {/* Floating model */}
      <motion.div
        style={{ x: pos.x, y: pos.y, translateX: '-50%', translateY: '-50%' }}
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
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <ModelViewer
            ref={modelViewerRef} src={modelSrc} alt="3D Model"
            camera-controls disable-zoom disable-pan
            shadow-intensity="2" exposure="1.2" bounds="tight"
            camera-orbit="0deg 75deg 10m"
            min-camera-orbit="auto auto 10m" max-camera-orbit="auto auto 10m"
            field-of-view="25deg" interaction-prompt="none"
            style={{ width: '100%', height: '100%' }}
          ></ModelViewer>

          {/* Hover tooltip */}
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

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-white/90 dark:bg-black/95 backdrop-blur-3xl"
          onClick={() => setShowPopup(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-primary/30
                       rounded-[3rem] overflow-hidden flex flex-col md:flex-row
                       shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowPopup(false)}
              className="absolute top-8 right-8 z-[210] bg-black/10 dark:bg-white/10 hover:bg-red-500 text-black dark:text-white p-3 rounded-full transition-all">
              <X size={24} />
            </button>

            <div data-lenis-prevent className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col text-left">
              <div className="bg-primary/20 p-5 rounded-2xl mb-10 border border-primary/20 w-fit">
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
                  <div className="text-xl leading-relaxed font-medium whitespace-pre-line">{currentProperty.fruitInfo}</div>
                ) : (
                  <>
                    <p className="text-xl leading-relaxed font-medium">Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.</p>
                    <ul className="grid gap-3">{['40 dragon fruit plants', '4 plants per pole', '10 poles in each 100 sq. yards'].map((item, i) => (
                      <li key={i} className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="text-primary font-bold">→</span> {item}
                      </li>
                    ))}</ul>
                    <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs text-center">Profit Sharing</p>
                      <div className="flex items-center justify-center gap-10">
                        {[['50%', 'Company', 'text-white'], ['50%', 'Client', 'text-primary']].map(([pct, label, cls], i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <div className="h-10 w-px bg-primary/30" />}
                            <div className="text-center">
                              <p className={`text-4xl font-black ${cls}`}>{pct}</p>
                              <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
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
                <ModelViewer src={currentProperty.threeDElement} auto-rotate camera-controls shadow-intensity="2" exposure="1.2" style={{ width: '100%', height: '100%' }}></ModelViewer>
              ) : currentProperty?.fruitImage ? (
                <img src={currentProperty.fruitImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Leaf size={100} className="opacity-10 text-gray-700" /></div>
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
