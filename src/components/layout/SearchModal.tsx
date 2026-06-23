'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Clock, ArrowRight, Building, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  onClose: () => void;
}

const mockRecentSearches = [
  'Luxury Villas',
  'Commercial Plots',
  'Seaside Properties',
  'Downtown Apartments',
];

const mockSuggestions = [
  { id: 1, title: 'Palm Jumeirah Villa', type: 'property', location: 'Dubai' },
  { id: 2, title: 'Downtown Heights', type: 'apartment', location: 'City Center' },
];

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus trap and escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Focus input on mount
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/properties?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4 sm:px-0">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
        role="dialog"
        aria-modal="true"
        aria-label="Search properties"
      >
        <form onSubmit={handleSearch} className="relative border-b border-gray-100 dark:border-white/5">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent py-5 pl-12 pr-12 text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
            placeholder="Search properties, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <div className="p-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </div>
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
          {query === '' ? (
            <div className="p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">
                Recent Searches
              </h3>
              <ul className="space-y-1">
                {mockRecentSearches.map((item, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                      className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors group"
                    >
                      <Clock className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      <span>{item}</span>
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">
                Suggestions
              </h3>
              <ul className="space-y-1">
                {mockSuggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        router.push('/properties');
                        onClose();
                      }}
                      className="w-full flex items-center gap-4 px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 text-gray-500 group-hover:text-primary transition-colors">
                        {item.type === 'property' ? <Building className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.location}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="hidden sm:flex border-t border-gray-100 dark:border-white/5 px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a] items-center justify-between">
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-sans text-[10px]">↑</kbd> <kbd className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-sans text-[10px]">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-sans text-[10px]">Enter</kbd> to select</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded font-sans text-[10px]">Esc</kbd> to close</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
