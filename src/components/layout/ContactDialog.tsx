'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Calendar, X, User, Send, CheckCircle2, Loader2, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type DialogType = 'call' | 'whatsapp' | 'book' | null;

export const ContactDialog = () => {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contacts, setContacts] = useState<any[]>([]);

  // Fetch dynamic contact info from SiteContent
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const content = data.data;
          setContacts([
            {
              name: content.mainFounderName || 'Mahaboob shariff',
              role: content.mainFounderRole || 'Founder, Managing Director',
              phone: content.mainFounderPhone || '919666080645',
              image: content.mainFounderImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100'
            },
            {
              name: content.cofounderName || 'Muhammad Yaseen',
              role: content.cofounderRole || 'Co-Founder & Director',
              phone: content.cofounderPhone || '919573785434',
              image: content.cofounderImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'
            }
          ]);
        }
      })
      .catch(err => console.error("Error fetching contact dialog content:", err));
  }, []);

  // Listener for custom events to trigger dialogs from anywhere
  useEffect(() => {
    const handleOpenContact = (e: any) => {
      setActiveDialog(e.detail.type);
      setCustomMessage(e.detail.message || null);
    };
    window.addEventListener('open-contact-dialog', handleOpenContact);
    return () => window.removeEventListener('open-contact-dialog', handleOpenContact);
  }, []);

  const closeDialog = () => {
    setActiveDialog(null);
    setCustomMessage(null);
    setStatus('idle');
    setFormData({ name: '', phone: '' });
  };

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setStatus('loading');
    
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    // Phone validation (10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setStatus('error');
      return;
    }

    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      setStatus('error');
      return;
    }

    try {
      // Save to database & send Telegram via API
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: `Requested a Site Visit from page: ${window.location.href}`,
          type: 'Site Visit'
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(closeDialog, 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {activeDialog && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDialog}
            className="absolute inset-0 bg-white dark:bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-8 pb-4">
              <button 
                onClick={closeDialog}
                className="absolute top-6 right-6 p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-primary/20 p-3 rounded-2xl text-primary">
                  {activeDialog === 'call' && <Phone size={24} />}
                  {activeDialog === 'whatsapp' && <MessageSquare size={24} />}
                  {activeDialog === 'book' && <Calendar size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">
                    {activeDialog === 'call' && 'Direct Call'}
                    {activeDialog === 'whatsapp' && 'WhatsApp Chat'}
                    {activeDialog === 'book' && 'Book a Visit'}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    {activeDialog === 'book' ? 'Get a callback within 30 mins' : 'Connect with our leadership'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-0">
              {(activeDialog === 'call' || activeDialog === 'whatsapp') && (
                <div className="space-y-4 mt-4">
                  {contacts.map((contact, index) => (
                    <motion.a
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      href={activeDialog === 'call' ? `tel:${contact.phone}` : `https://wa.me/${contact.phone.replace('+', '')}?text=${encodeURIComponent(customMessage || `Hi ${contact.name}, I'm interested in your real estate projects.`)}`}
                      target={activeDialog === 'whatsapp' ? "_blank" : undefined}
                      className="flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 border border-white/5 rounded-3xl hover:bg-black/10 dark:bg-white/10 hover:border-primary/30 group transition-all"
                    >
                      <div className="relative h-14 w-14 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
                         <img src={contact.image} alt={contact.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-black dark:text-white font-black uppercase tracking-tight group-hover:text-primary transition-colors">{contact.name}</p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{contact.role}</p>
                      </div>
                      <div className={cn(
                        "p-3 rounded-xl transition-all group-hover:scale-110",
                        activeDialog === 'call' ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-500"
                      )}>
                        {activeDialog === 'call' ? <Phone size={18} /> : <MessageSquare size={18} />}
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              {activeDialog === 'book' && (
                <div className="mt-4">
                  {status === 'success' ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-primary/20 p-6 rounded-full text-primary">
                          <CheckCircle2 size={48} className="animate-bounce" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Booking Successful!</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Our team will contact you shortly to confirm the visit schedule.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookVisit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Your Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                              type="text"
                              required
                              placeholder="Enter your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white font-medium focus:border-primary/50 focus:ring-0 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                              type="tel"
                              required
                              placeholder="Enter mobile number"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white font-medium focus:border-primary/50 focus:ring-0 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-primary text-black dark:text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {status === 'loading' ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <>
                            <Send size={18} />
                            Submit Request
                          </>
                        )}
                      </button>
                      
                      {status === 'error' && (
                        <p className="text-red-500 text-center text-xs font-bold">
                          {formData.phone.replace(/\D/g, '').length !== 10 
                            ? 'Please enter a valid 10-digit mobile number.' 
                            : 'Failed to send request. Please try again.'}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-black/5 dark:bg-white/5 px-8 py-4 border-t border-black/10 dark:border-white/10 flex items-center justify-center gap-2">
               <Trophy size={14} className="text-primary" />
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vizag's Most Trusted Developers</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Global helper to open dialog
export const openContactDialog = (type: DialogType, message?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-contact-dialog', { detail: { type, message } }));
  }
};
