'use client';

import { ReactNode, useEffect } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenis = useLenis();

  useEffect(() => {
    // Handle initial hash on load
    if (lenis && window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          lenis.scrollTo(target, { offset: -150, duration: 2 });
        }, 1000); // Wait for animations and layout
      }
    }

    // Handle messages from AdminPreviewModal
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'SCROLL_TO_ANCHOR' && e.data.anchor && lenis) {
        const target = document.querySelector(e.data.anchor);
        if (target) {
          // Force scroll to target
          lenis.scrollTo(target, { offset: -150, duration: 1.5, lerp: 0.1 });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [lenis]);

  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.5, 
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children as any}
    </ReactLenis>
  );
};
