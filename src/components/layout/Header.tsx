'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import { openContactDialog } from './ContactDialog';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [content, setContent] = useState<any>({
    logoTitle: "STAR LAND",
    logoSubtitle: "DEVELOPERS",
    navHome: "Home",
    navProperties: "Properties",
    navAbout: "About",
    navContact: "Contact",
    navJoin: "Join",
    btnCall: "Call",
    btnEnquire: "Enquire"
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setContent((prev: any) => ({ ...prev, ...data.data }));
      })
      .catch(err => console.error("Error fetching content:", err));
  }, []);

  const navLinks = [
    { name: content.navHome || 'Home', href: '/' },
    { name: content.navProperties || 'Properties', href: '/properties' },
    { name: content.navAbout || 'About', href: '/about' },
    { name: content.navContact || 'Contact', href: '/contact' },
    { name: content.navJoin || 'Join', href: '/join' },
  ];

  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.includes('/media');

  const isHomePage = pathname === '/';
  const shouldBeSolid = isScrolled || !isHomePage;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[110] transition-all duration-500',
        isAdmin ? 'hidden pointer-events-none' : (shouldBeSolid ? 'py-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 shadow-lg shadow-black/5' : 'py-8 bg-transparent')
      )}
    >
      {!isAdmin && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <nav className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href={content.logoLink || "/"} className="group relative z-10">
              {content.headerLogoImage ? (
                <div className="relative h-10 md:h-14 w-auto flex items-center">
                  <img 
                    src={content.headerLogoImage} 
                    alt={content.logoTitle || "Logo"} 
                    className={cn(
                      "h-full w-auto object-contain transition-all duration-500",
                      !shouldBeSolid && "brightness-0 invert" 
                    )} 
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className={cn(
                    "text-2xl md:text-3xl font-black tracking-tighter leading-none transition-colors duration-500",
                    shouldBeSolid ? "text-black dark:text-white" : "text-white"
                  )}>
                    {content.logoTitle || 'STAR LANDS'}
                  </span>
                  <span className={cn(
                    "text-[10px] md:text-xs font-bold tracking-[0.3em] leading-none mt-1 transition-all duration-500",
                    shouldBeSolid ? "text-primary" : "text-primary/90"
                  )}>
                    {content.logoSubtitle || 'DEVELOPERS'}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <div className={cn(
                "flex items-center p-1 rounded-full border transition-all duration-500",
                shouldBeSolid ? "bg-gray-100/50 dark:bg-white/5 border-gray-200 dark:border-white/10" : "bg-white/10 border-white/20 backdrop-blur-md"
              )}>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        'px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 relative group',
                        isActive 
                          ? 'bg-primary text-black dark:text-white shadow-lg shadow-primary/20' 
                          : cn(shouldBeSolid ? "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white" : "text-white/80 hover:text-white")
                      )}
                    >
                      <span className="relative z-10">{link.name}</span>
                      {!isActive && (
                        <span className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden lg:flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => openContactDialog('call')}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2",
                    shouldBeSolid 
                      ? "bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/5 text-gray-900 dark:text-white hover:bg-primary hover:border-primary hover:text-black dark:hover:text-white shadow-sm" 
                      : "bg-white/10 text-white hover:bg-white hover:text-black backdrop-blur-md border border-white/20"
                  )}
                >
                  <Phone size={14} />
                  <span>{content.btnCall || 'Call'}</span>
                </button>
                <button
                  onClick={() => openContactDialog('whatsapp')}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-black dark:text-white shadow-sm dark:shadow-xl dark:shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span>{content.btnEnquire || 'Enquire'}</span>
                </button>
              </div>

              {/* Mobile Actions (Theme + Menu) */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className={cn(
                  "rounded-xl transition-all duration-500 overflow-hidden",
                  shouldBeSolid ? "bg-gray-100 dark:bg-white/5" : "bg-white/10 backdrop-blur-md"
                )}>
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={cn(
                    "p-3 rounded-xl transition-all duration-500",
                    shouldBeSolid ? "bg-gray-100 dark:bg-white/5 text-black dark:text-white" : "bg-white/10 text-white backdrop-blur-md"
                  )}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {!isAdmin && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] md:top-[80px] z-50 lg:hidden bg-white dark:bg-[#050505] p-6 h-[calc(100vh-70px)] overflow-y-auto"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "p-4 md:p-3 rounded-2xl text-xl md:text-lg font-black uppercase tracking-tight border transition-all",
                    pathname === link.href 
                      ? "bg-primary text-black dark:text-white border-primary shadow-md dark:shadow-xl dark:shadow-primary/20" 
                      : "bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-transparent"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openContactDialog('call');
                  }}
                  className="p-6 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs flex flex-col items-center gap-3"
                >
                  <Phone size={24} className="text-primary" />
                  {content.btnCall || 'Call'}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openContactDialog('whatsapp');
                  }}
                  className="p-6 rounded-2xl bg-primary text-black dark:text-white font-black uppercase tracking-widest text-xs flex flex-col items-center gap-3 shadow-xl shadow-primary/20"
                >
                  <MessageSquare size={24} />
                  {content.btnEnquire || 'Enquire'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
