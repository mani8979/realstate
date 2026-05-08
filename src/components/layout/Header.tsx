'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [content, setContent] = useState<any>({
    logoTitle: "REALSTATE",
    logoSubtitle: "Vizag Premium",
    navHome: "Home",
    navProperties: "Properties",
    navAbout: "About",
    navContact: "Contact",
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
        if (data.success && data.data) setContent(data.data);
      })
      .catch(err => console.error("Error fetching content:", err));
  }, []);

  const navLinks = [
    { name: content.navHome || 'Home', href: '/' },
    { name: content.navProperties || 'Properties', href: '/properties' },
    { name: content.navAbout || 'About', href: '/about' },
    { name: content.navContact || 'Contact', href: '/contact' },
  ];

  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/studio') || pathname.endsWith('/media');
  if (isAdmin) return null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[60] transition-all duration-500',
        isScrolled 
          ? 'py-4 bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]' 
          : 'py-8 bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {content.headerLogoImage ? (
            <div className="relative h-12 w-32">
              <img src={content.headerLogoImage} alt={content.logoTitle} className="h-full w-full object-contain" />
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="bg-primary p-2.5 rounded-xl text-white group-hover:rotate-[15deg] transition-transform duration-500 shadow-lg shadow-primary/30">
                  <Home size={24} />
                </div>
                <div className="absolute -top-1 -right-1 bg-amber-400 p-1 rounded-full animate-pulse shadow-lg">
                  <Sparkles size={10} className="text-black" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className={cn(
                  "text-2xl font-black tracking-tighter transition-colors font-heading",
                  isScrolled ? "text-white" : "text-white"
                )}>
                  {content.logoTitle}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{content.logoSubtitle}</span>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-primary relative group',
                pathname === link.href 
                  ? 'text-primary' 
                  : 'text-gray-300'
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-2 left-0 h-[2px] bg-primary transition-all duration-300",
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          <ThemeToggle />
          <div className="h-6 w-[1px] bg-white/10" />
          <a
            href={content.btnCallLink || "tel:+919876543210"}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-primary transition-colors"
          >
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-primary/20">
              <Phone size={16} />
            </div>
            <span>{content.btnCall || 'Call'}</span>
          </a>
          <a
            href={content.btnEnquireLink || "https://wa.me/919876543210"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-primary px-6 py-3 rounded-xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 transform hover:scale-105"
          >
            <MessageSquare size={16} />
            <span>{content.btnEnquire || 'Enquire'}</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            className="p-3 bg-white/5 rounded-xl border border-white/10 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl p-8 border-b border-white/10 shadow-2xl"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'text-2xl font-black uppercase tracking-tighter transition-colors',
                      pathname === link.href ? 'text-primary' : 'text-white'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="grid grid-cols-1 gap-4 mt-8">
                <a
                  href={content.btnCallLink || "tel:+919876543210"}
                  className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  <Phone size={20} className="text-primary" />
                  {content.btnCall || 'Call Support'}
                </a>
                <a
                  href={content.btnEnquireLink || "https://wa.me/919876543210"}
                  className="flex items-center justify-center gap-3 bg-primary text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  <MessageSquare size={20} />
                  {content.btnEnquire || 'WhatsApp Us'}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
