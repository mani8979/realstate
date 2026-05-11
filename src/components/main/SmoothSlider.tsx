'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
}

interface Land {
  _id: string;
  title: string;
  price: number;
  images: string[];
  location: string;
}

interface SmoothSliderProps {
  lands: Land[];
}

const SmoothSlider = ({ lands }: SmoothSliderProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const displayLands = React.useMemo(() => {
    let result = [...lands];
    if (result.length === 0) {
      return Array.from({ length: 10 }, (_, i) => ({
        _id: `fallback-${i}`,
        title: `Premium Land ${i + 1}`,
        price: 5000000 + i * 100000,
        images: [`https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop`],
        location: 'Visakhapatnam, AP'
      }));
    }
    return result;
  }, [lands]);

  const totalSlides = displayLands.length;

  useEffect(() => {
    CustomEase.create('smooth', 'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [activeSlideIndex, isAnimating]);

  const moveSlider = (newIndex: number, direction: 'next' | 'prev') => {
    if (isAnimating || !containerRef.current) return;
    setIsAnimating(true);

    const slides = containerRef.current.querySelectorAll('.slide-item');
    const currentSlide = slides[activeSlideIndex];
    const nextSlide = slides[newIndex];

    const xOffset = direction === 'next' ? '100%' : '-100%';
    
    // Preview Background Animation
    if (previewRef.current) {
      const nextLand = displayLands[newIndex];
      const newImg = document.createElement('img');
      newImg.src = nextLand.images[0];
      newImg.className = 'absolute top-0 left-0 w-full h-full object-cover opacity-0 grayscale';
      previewRef.current.appendChild(newImg);
      
      gsap.to(newImg, {
        opacity: 0.15,
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
          const oldImgs = previewRef.current?.querySelectorAll('img:not(:last-child)');
          oldImgs?.forEach(img => img.remove());
        }
      });
    }

    // Main Slide Animation
    gsap.set(nextSlide, { x: xOffset, opacity: 1, zIndex: 10 });
    gsap.set(currentSlide, { zIndex: 5 });

    gsap.to(currentSlide, {
      x: direction === 'next' ? '-100%' : '100%',
      duration: 1.4,
      ease: 'smooth'
    });

    gsap.to(nextSlide, {
      x: '0%',
      duration: 1.4,
      ease: 'smooth',
      onComplete: () => {
        setActiveSlideIndex(newIndex);
        setIsAnimating(false);
      }
    });

    // Content Box Animation
    const content = nextSlide.querySelector('.content-box');
    if (content) {
      gsap.fromTo(content, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
      );
    }
  };

  const nextSlide = () => moveSlider((activeSlideIndex + 1) % totalSlides, 'next');
  const prevSlide = () => moveSlider((activeSlideIndex - 1 + totalSlides) % totalSlides, 'prev');

  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] overflow-x-hidden font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        .slide-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          font-family: 'Inter', sans-serif;
        }
        .slide-item.active {
          opacity: 1;
          pointer-events: auto;
          z-index: 5;
        }
        .slider-preview img {
          animation: panBackground 60s infinite linear;
        }
        @keyframes panBackground {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(-2%, -2%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .active-land-item {
          color: white !important;
          transform: translateX(10px);
        }
      `}</style>

      {/* Background Preview (Blurred photo background) */}
      <div ref={previewRef} className="slider-preview absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image 
          src={displayLands[activeSlideIndex]?.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop'} 
          alt="Preview" 
          fill
          className="object-cover opacity-80 blur-[40px] scale-110"
        />
        <div className="absolute inset-0 bg-white dark:bg-black/20" />
      </div>

      <div ref={containerRef} className="absolute inset-0 z-10">
        {displayLands.map((land, index) => (
          <div 
            key={`${land._id}-${index}`}
            className={`slide-item ${index === activeSlideIndex ? 'active' : ''}`}
          >
            <div className="relative w-full h-full flex flex-col justify-center py-10 md:py-20">
              
              {/* Main Photo (Popup style) */}
              <div className="absolute inset-0 z-0 flex items-center justify-center px-4 md:px-12 py-8 md:py-16 pointer-events-none">
                <div 
                  onClick={() => router.push(`/properties/${land._id}`)}
                  className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/30 pointer-events-auto cursor-pointer group/slideimg"
                >
                  <Image 
                    src={land.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop'} 
                    alt={land.title} 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover/slideimg:scale-110"
                    priority={index === 0}
                  />
                  {/* Subtle gradient just at the very bottom for text safety */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/slideimg:opacity-100 transition-opacity duration-700 flex items-center justify-center pointer-events-none">
                    <span className="bg-white dark:bg-black/60 backdrop-blur-md text-black dark:text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.5em] text-[10px] border border-black/20 dark:border-white/20">
                      View Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Box Overlaid */}
              <div className="container mx-auto px-6 md:px-24 relative z-10 w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] pointer-events-none">
                <div className="max-w-3xl content-box pointer-events-auto">
                <p className="text-primary font-black text-[8px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] mb-2 md:mb-6">
                  Signature Collection
                </p>
                <h1 
                  onClick={() => router.push(`/properties/${land._id}`)}
                  className="text-3xl md:text-6xl lg:text-7xl font-black text-black dark:text-white uppercase leading-[1.1] md:leading-[0.95] mb-6 md:mb-12 tracking-tighter cursor-pointer hover:text-primary transition-colors"
                >
                  {land.title}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-4 mb-8 md:mb-16">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2">Investment Starting At</p>
                    <p className="text-black dark:text-white text-4xl md:text-6xl font-black tracking-tighter">
                      ₹{land.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  {/* Mobile Action Button */}
                  <button 
                    onClick={() => router.push(`/properties/${land._id}`)}
                    className="md:hidden w-fit bg-primary text-black dark:text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl border border-primary/20 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                  >
                    View Experience
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left-side Land List (Direct from Zip Styling) */}
      <div className="absolute left-10 bottom-10 z-[100] hidden lg:block">
        <div className="space-y-3">
          {displayLands.slice(0, 8).map((land, i) => (
            <p 
              key={land._id}
              onClick={() => moveSlider(i, i > activeSlideIndex ? 'next' : 'prev')}
              className={`text-[#5e5e5e] text-[9px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all duration-500 hover:text-black dark:text-white flex items-center gap-3 ${i === activeSlideIndex ? 'active-land-item' : ''}`}
            >
              <span className={`w-4 h-[1px] bg-white transition-all duration-500 ${i === activeSlideIndex ? 'w-8' : 'w-0 opacity-0'}`}></span>
              {land.title}
            </p>
          ))}
          {totalSlides > 8 && <p className="text-[#333] text-[9px] font-black tracking-widest pl-3">+ {totalSlides - 8} MORE UNITS</p>}
        </div>
      </div>

      {/* Bottom Counter (Zip Styling) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 z-[100] flex items-center gap-10">
        <div className="text-black dark:text-white text-sm font-black flex items-center gap-4">
          <span className="text-2xl">{(activeSlideIndex + 1).toString().padStart(2, '0')}</span>
          <span className="text-[#5e5e5e] text-xs">/</span>
          <span className="text-[#5e5e5e] text-xs">{totalSlides.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-10 bottom-10 z-[100] flex gap-4">
        <button 
          onClick={prevSlide}
          className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-white hover:text-black transition-all group backdrop-blur-md"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-white hover:bg-white hover:text-black transition-all group backdrop-blur-md"
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Mobile Branding */}
      <div className="absolute top-24 left-6 md:hidden z-50">
        <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Premium Collection</h2>
      </div>
    </div>
  );
};

export default SmoothSlider;
