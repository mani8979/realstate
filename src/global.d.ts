import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        'rotation-per-second'?: string;
        'field-of-view'?: string;
        'camera-orbit'?: string;
        'exposure'?: string;
        poster?: string;
        loading?: string;
        reveal?: string;
      };
    }
  }
}
