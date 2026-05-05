'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode } from 'react';

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
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
