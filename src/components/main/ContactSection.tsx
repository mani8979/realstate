'use client';

import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { openContactDialog } from '../layout/ContactDialog';
import axios from 'axios';

const ContactSection = ({ content }: { content?: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Phone validation (10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setStatus('error');
      return;
    }

    try {
      await axios.post('/api/enquiries', formData);
      setStatus('success');
      
      // WhatsApp redirect to specified number
      const message = `Full Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/919666080645?text=${encodedMessage}`, '_blank');

      setFormData({ name: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
              {content?.contactBadge || 'Get In Touch'}
            </h2>
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
              {content?.contactTitle || 'Have Any Questions?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
              {content?.contactDesc || "Our team is ready to help you find the perfect property. Send us a message and we'll get back to you within 24 hours."}
            </p>

            <div className="space-y-8">
              <button 
                onClick={() => openContactDialog('call')}
                className="flex items-center gap-6 group w-full text-left"
              >
                <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                    {content?.contactCallLabel || 'Call Our Leadership'}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {content?.contactCallSub || 'Shariff / Mohammed'}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                    {content?.contactEmailLabel || 'Email Us'}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {content?.contactEmailSub || 'info@realestate.com'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                    {content?.contactVisitLabel || 'Visit Us'}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {content?.contactVisitSub || 'Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-12 rounded-3xl overflow-hidden h-64 shadow-lg border-4 border-white dark:border-gray-800">
              <iframe 
                src={content?.officeMapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1714561234567!5m2!1sen!2sin"} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {content?.contactFormNameLabel || 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {content?.contactFormPhoneLabel || 'Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 234 567 890"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {content?.contactFormMsgLabel || 'Message'}
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what you're looking for..."
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 group shadow-lg shadow-primary/20"
              >
                {status === 'loading' ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    <span>{content?.contactFormBtnText || 'Send Message'}</span>
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="text-emerald-500 font-bold text-center animate-in fade-in slide-in-from-top">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="text-red-500 font-bold text-center animate-in fade-in slide-in-from-top">
                  {formData.phone.replace(/\D/g, '').length !== 10 
                    ? 'Please enter a valid 10-digit mobile number.' 
                    : 'Error sending message. Please try again.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
