'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Maximize2, Minimize2, RefreshCcw } from 'lucide-react';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

const AdminPreviewModal = ({ isOpen, onClose, url, title = 'Site Preview' }: AdminPreviewModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0); // For refreshing the iframe

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/10 transition-all duration-500 ${isFullscreen ? 'w-full h-full' : 'w-[95%] h-[90%] max-w-7xl'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 font-black uppercase tracking-widest text-xs text-gray-400">{title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setKey(prev => prev + 1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-gray-500"
              title="Refresh Preview"
            >
              <RefreshCcw size={18} />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-gray-500"
              title={isFullscreen ? "Minimize" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <a 
              href={url} 
              target="_blank" 
              className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-gray-500"
              title="Open in New Tab"
            >
              <ExternalLink size={18} />
            </a>
            <div className="w-px h-6 bg-gray-100 dark:bg-zinc-800 mx-2" />
            <button 
              onClick={onClose}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black p-3 rounded-2xl hover:scale-110 transition-all shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe Content */}
        <div className="flex-grow relative bg-gray-50 dark:bg-zinc-900">
          <iframe 
            key={key}
            src={url} 
            className="w-full h-full border-none"
            title="Preview"
          />
          
          {/* Loading Indicator Overlay (optional) */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
             <div className="h-full bg-primary animate-progress-indefinite" />
          </div>
        </div>

        {/* Footer / Info Bar */}
        <div className="px-8 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-md">
              Previewing: {url}
            </span>
            <div className="flex gap-4">
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Live Preview Mode</span>
            </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-indefinite {
          0% { left: -30%; width: 30%; }
          50% { left: 40%; width: 20%; }
          100% { left: 100%; width: 30%; }
        }
        .animate-progress-indefinite {
          position: absolute;
          animation: progress-indefinite 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminPreviewModal;
