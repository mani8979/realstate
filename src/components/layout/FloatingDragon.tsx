'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ModelViewer = 'model-viewer' as any;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the X-centre (in px) the model should occupy based on the
 * alignment of the content section currently most visible in the viewport.
 *
 * Layout rule:
 *   text=left   → model goes to the RIGHT empty strip
 *   text=right  → model goes to the LEFT  empty strip
 *   text=center → model goes to the RIGHT empty strip (default)
 *   no sections → model stays RIGHT (top-right default)
 */
const getTargetX = (viewportW: number, modelSize: number): number => {
  const pad = 24;

  // Read sections tagged by page.tsx with data-model-align
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('[data-model-align]')
  );

  if (sections.length === 0) {
    // Default: top-right
    return viewportW - modelSize - pad;
  }

  // Find the section most visible in the viewport
  const vh = window.innerHeight;
  let bestSection: HTMLElement | null = null;
  let bestOverlap = 0;

  for (const el of sections) {
    const r = el.getBoundingClientRect();
    const overlap = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestSection = el;
    }
  }

  const align = bestSection?.dataset.modelAlign ?? 'left';

  if (align === 'right') {
    // Text is on the right → model goes to left strip
    return modelSize + pad;
  }
  if (align === 'center') {
    // Text is centered → model goes to right strip
    return viewportW - modelSize - pad;
  }
  // Default (left-aligned text) → model goes to right strip
  return viewportW - modelSize - pad;
};

/**
 * Maps scroll progress to a viewport-Y position.
 * Starts at 12% (top area) and drifts to 80% as the user scrolls.
 */
const getTargetY = (viewportH: number): number => {
  const pageHeight = document.body.scrollHeight - viewportH;
  const progress = pageHeight > 0 ? Math.min(1, window.scrollY / pageHeight) : 0;
  return viewportH * (0.12 + progress * 0.68);
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const FloatingDragon = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [shouldLoad, setShouldLoad] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const modelViewerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();

  // ── Boot: delay model load until page is ready ──────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 2500);
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

  // ── Animation loop ───────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    let frameId: number;

    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const modelSize = viewportW < 768 ? 60 : 110;

    // Initialise top-right
    let curX = viewportW - modelSize - 24;
    let curY = viewportH * 0.12;

    const update = () => {
      const vW = window.innerWidth;
      const vH = window.innerHeight;
      const mSize = vW < 768 ? 60 : 110;

      const targetX = getTargetX(vW, mSize);
      const targetY = getTargetY(vH);

      // Smooth lerp
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;

      // Clamp inside viewport
      curX = Math.max(mSize, Math.min(vW - mSize, curX));
      curY = Math.max(mSize, Math.min(vH - mSize, curY));

      setPos({ x: curX, y: curY });

      // Hide when overlapping enquiry / disappear zones
      const disappearZones = document.querySelectorAll('.dragon-disappear');
      let shouldHide = false;
      disappearZones.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (
          curX + mSize > rect.left &&
          curX - mSize < rect.right &&
          curY + mSize > rect.top &&
          curY - mSize < rect.bottom
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

  // ── Fetch property on property pages ────────────────────────────────────
  useEffect(() => {
    const propertyId = pathname?.split('/properties/')?.[1]?.split('/')?.[0];
    if (propertyId && propertyId.length > 10) {
      fetch(`/api/properties/${propertyId}?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => setCurrentProperty(data))
        .catch(() => setCurrentProperty(null));
    } else {
      setCurrentProperty(null);
    }
  }, [pathname]);

  // ── Scroll-driven camera orbit ──────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', latest => {
    if (modelViewerRef.current) {
      const rotation = latest * 360 * 3;
      modelViewerRef.current.cameraOrbit = `${rotation}deg 75deg 10m`;
    }
  });

  // ── Guards ───────────────────────────────────────────────────────────────
  if (!mounted || !shouldLoad) return null;
  if (pathname?.startsWith('/admin')) return null;

  const modelSrc = currentProperty?.threeDElement;
  if (!modelSrc) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const modelW = isMobile ? 120 : 180;
  const modelH = isMobile ? 160 : 240;

  return (
    <>
      {/* ── Floating 3D model ─────────────────────────────────────────── */}
      <motion.div
        style={{
          x: pos.x,
          y: pos.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-fit h-fit pointer-events-none z-[100] overflow-visible"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0 }}
          transition={{ duration: visible ? 1.2 : 0.3, ease: 'easeOut' }}
          style={{ width: modelW, height: modelH }}
          className="pointer-events-auto cursor-pointer"
          onClick={() => setShowPopup(true)}
        >
          <ModelViewer
            ref={modelViewerRef}
            src={modelSrc}
            alt="Property 3D Model"
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

      {/* ── Popup ─────────────────────────────────────────────────────── */}
      {showPopup && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-white dark:bg-black/95 backdrop-blur-3xl"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-full max-w-6xl bg-[#0a0a0a] border-2 border-primary/30 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(16,185,129,0.2)] h-auto md:h-[85vh] max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-8 right-8 z-[210] bg-black/10 dark:bg-white/10 hover:bg-red-500 text-black dark:text-white p-3 rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Content Side */}
            <div
              data-lenis-prevent
              className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto custom-scrollbar flex flex-col text-left"
            >
              <div className="bg-primary/20 p-5 rounded-2xl mb-10 border border-primary/20 flex-shrink-0 w-fit">
                <Leaf className="text-primary" size={40} />
              </div>

              <h3 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
                {currentProperty?.title?.toLowerCase().includes('sandalwood')
                  ? 'Plantation'
                  : 'Cultivation'}{' '}
                <br />
                <span className="text-black dark:text-white">Model</span>
              </h3>

              <div className="space-y-10 text-gray-700 dark:text-gray-300">
                {currentProperty?.fruitDetails?.length > 0 ? (
                  <div className="space-y-12">
                    {currentProperty.fruitDetails.map((detail: any, i: number) => (
                      <div key={i} className="space-y-6">
                        <div className="flex items-center gap-4">
                          {detail.showArrow && (
                            <span className="text-primary font-bold text-2xl">→</span>
                          )}
                          <p className="text-primary font-black uppercase tracking-[0.2em] text-sm">
                            {detail.heading}
                          </p>
                        </div>
                        {detail.isPointed ? (
                          <ul className="grid grid-cols-1 gap-4">
                            {detail.content
                              .split('\n')
                              .filter((l: string) => l.trim())
                              .map((line: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex gap-4 items-start bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all"
                                >
                                  <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                  <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {line.trim()}
                                  </span>
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
                      Dragon fruit cultivation is a high-demand and profitable farming
                      option with long-term benefits.
                    </p>
                    <div className="space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">
                        Plantation Details (Per 100 Sq. Yards)
                      </p>
                      <ul className="grid grid-cols-1 gap-3">
                        {[
                          '40 dragon fruit plants',
                          '4 plants per pole',
                          '10 poles in each 100 sq. yards',
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex gap-3 items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-white/5"
                          >
                            <span className="text-primary font-bold">→</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                          Plantation Period
                        </p>
                        <p className="text-black dark:text-white font-bold italic text-lg">
                          May to November
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                          Yield Duration
                        </p>
                        <p className="text-black dark:text-white font-bold italic text-lg">
                          Up to 30 Years
                        </p>
                      </div>
                    </div>
                    <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 space-y-4">
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs text-center">
                        Profit Sharing
                      </p>
                      <div className="flex items-center justify-center gap-10">
                        <div className="text-center">
                          <p className="text-4xl font-black text-black dark:text-white">50%</p>
                          <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">
                            Company
                          </p>
                        </div>
                        <div className="h-10 w-[1px] bg-primary/30" />
                        <div className="text-center">
                          <p className="text-4xl font-black text-primary">50%</p>
                          <p className="text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">
                            Client
                          </p>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingDragon;
