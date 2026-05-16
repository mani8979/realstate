'use client';

import { ReactNode, useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis && window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          lenis.scrollTo(target, { offset: -150 });
        }, 500); // Small delay to ensure layout is ready
      }
    }
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
