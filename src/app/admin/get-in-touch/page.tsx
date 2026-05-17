'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Globe, Phone, MapPin, Clock, HelpCircle, Loader2 } from 'lucide-react';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';

export default function GetInTouchAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<any>({
    getInTouchTitle: 'GET IN TOUCH',
    getInTouchInquiryLabel: 'INQUIRIES',
    getInTouchPhone: '+91 96660 80645',
    getInTouchAvailability: 'Available Daily, 10AM-7PM',
    getInTouchOfficeLabel: 'MAIN OFFICE',
    getInTouchAddress: 'Flat No.202,Backside Complex,Opposite of DMART,Srinagar,Gajuwaka Visakhapatnam, AP,530026',
    getInTouchFooter: 'Visit us for a coffee and a chat.',
    footerQuickLinks: [
      { label: 'Luxury Interior', href: '/services/interior', content: 'Luxury Interior content...' },
      { label: 'Exclusive Consultation', href: '/services/consultation', content: 'Consultation content...' },
      { label: 'Privacy Policy', href: '/privacy', content: 'Privacy Policy content...' },
      { label: 'Terms of Service', href: '/terms', content: 'Terms of Service content...' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => (res.ok ? res.json() : { success: false }))
      .then((data) => {
        if (data.success && data.data) {
          setContent((prev: any) => ({
            ...prev,
            ...data.data,
            // Ensure footerQuickLinks exists
            footerQuickLinks: data.data.footerQuickLinks || prev.footerQuickLinks
          }));
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...content.footerQuickLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setContent({ ...content, footerQuickLinks: updatedLinks });
  };

  const handleAddLink = () => {
    const updatedLinks = [...content.footerQuickLinks];
    updatedLinks.push({ label: 'New Link Section', href: '/services/new-section', content: 'Matter details here...' });
    setContent({ ...content, footerQuickLinks: updatedLinks });
  };

  const handleDeleteLink = (index: number) => {
    const updatedLinks = content.footerQuickLinks.filter((_: any, i: number) => i !== index);
    setContent({ ...content, footerQuickLinks: updatedLinks });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        alert('Get In Touch and Links settings saved successfully!');
      } else {
        alert('Failed to save settings: ' + data.error);
      }
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl pb-20">
      <AdminPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        url="/contact"
        title="Get In Touch Section Preview"
      />
      
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tighter">
            Get In Touch Manager
          </h1>
          <p className="text-gray-500 mt-2">
            Customize the Contact hero block details and manage individual rich-content pages.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <Globe size={18} />
            Preview Section
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-black dark:text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/30 transition-all shadow-xl shadow-primary/20"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Banner Block Settings */}
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Phone className="text-primary" /> Main Hero Banner
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Section Title</label>
              <input
                name="getInTouchTitle"
                value={content.getInTouchTitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 font-bold text-xl"
                placeholder="e.g. GET IN TOUCH"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Inquiry Column Label</label>
              <input
                name="getInTouchInquiryLabel"
                value={content.getInTouchInquiryLabel || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 font-bold text-xl"
                placeholder="e.g. INQUIRIES"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Phone Number Display</label>
              <input
                name="getInTouchPhone"
                value={content.getInTouchPhone || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 font-bold text-xl"
                placeholder="e.g. +91 96660 80645"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Availability Info</label>
              <input
                name="getInTouchAvailability"
                value={content.getInTouchAvailability || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 font-bold text-xl"
                placeholder="e.g. Available Daily, 10AM-7PM"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Office Column Label</label>
              <input
                name="getInTouchOfficeLabel"
                value={content.getInTouchOfficeLabel || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 font-bold text-xl"
                placeholder="e.g. MAIN OFFICE"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Invitation Footer Subtext</label>
              <input
                name="getInTouchFooter"
                value={content.getInTouchFooter || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 font-bold text-xl"
                placeholder="e.g. Visit us for a coffee and a chat."
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Main Office Address (Multi-Line)</label>
              <textarea
                name="getInTouchAddress"
                rows={3}
                value={content.getInTouchAddress || ''}
                onChange={handleChange}
                className="w-full p-5 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 text-lg font-bold"
                placeholder="Enter address..."
              />
            </div>
          </div>
        </div>

        {/* Dynamic Pages / Get In Touch Links Editor */}
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <MapPin className="text-primary" /> Dynamic Quick Links & Sub-Pages
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Customize titles, slug paths, and detailed body HTML content for footer sub-sections.
              </p>
            </div>
            <button
              onClick={handleAddLink}
              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-5 py-3 rounded-2xl font-bold transition-all"
            >
              <Plus size={18} /> Add Section Link
            </button>
          </div>

          <div className="space-y-8">
            {content.footerQuickLinks.map((link: any, idx: number) => (
              <div
                key={idx}
                className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-gray-800 relative group transition-all hover:border-primary/30"
              >
                <button
                  onClick={() => handleDeleteLink(idx)}
                  className="absolute top-6 right-6 text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 p-3 rounded-xl transition-all"
                  title="Delete Section Link"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Link Label Name</label>
                    <input
                      value={link.label || ''}
                      onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-bold"
                      placeholder="e.g. Luxury Interior"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug / Route URL Path</label>
                    <input
                      value={link.href || ''}
                      onChange={(e) => handleLinkChange(idx, 'href', e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-bold"
                      placeholder="e.g. /services/interior"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    Extra Page Content / HTML Matter
                    <span title="HTML syntax is fully supported.">
                      <HelpCircle size={12} className="text-gray-500" />
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    value={link.content || ''}
                    onChange={(e) => handleLinkChange(idx, 'content', e.target.value)}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-mono text-sm leading-relaxed"
                    placeholder="Provide detailed custom content details for this dynamic page here..."
                  />
                </div>
              </div>
            ))}

            {content.footerQuickLinks.length === 0 && (
              <div className="text-center py-12 text-gray-500 font-medium">
                No active sub-page sections. Click 'Add Section Link' above to define new custom routes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
