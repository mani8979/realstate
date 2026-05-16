'use client';

import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, ChevronRight, Globe } from 'lucide-react';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';

export default function WhyChooseUsAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<any>({
    brandBadge: 'Our Core Pillars',
    brandTitle1: 'Why',
    brandTitle2: 'Choose Us',
    brandP1Side: 'Quality First',
    brandP1Title: 'Verified Properties',
    brandP1Desc: 'Every listing is manually verified by our team.',
    brandP2Side: 'Legally Secure',
    brandP2Title: 'Clear Documentation',
    brandP2Desc: '100% legal transparency and title clarity.',
    brandP3Side: 'Honest Deals',
    brandP3Title: '100% Transparency',
    brandP3Desc: 'No hidden costs. Direct registration.',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/content').then(res => res.ok ? res.json() : {success: false}).then(data => {
      if (data.success && data.data) {
        setContent((prev: any) => ({ ...prev, ...data.data }));
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      const data = await res.json();
      if (data.success) {
        alert('Why Choose Us settings saved successfully!');
      }
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl pb-20">
      <AdminPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        url="/#why-choose-us-section" 
        title="Why Choose Us Preview"
      />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tighter">Why Choose Us</h1>
          <p className="text-gray-500 mt-2">Manage the core pillars and brand values shown on the homepage.</p>
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
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Pillars'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Main Header */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Top Badge Text</label>
                <input name="brandBadge" value={content.brandBadge || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Title Line 1</label>
                    <input name="brandTitle1" value={content.brandTitle1 || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Title Line 2</label>
                    <input name="brandTitle2" value={content.brandTitle2 || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                 </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                 <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Brand Description (Subtitle)</label>
                 <textarea name="brandDesc" rows={2} value={content.brandDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
              </div>
           </div>
        </div>

        {/* Pillar 1 */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
          <h3 className="text-xl font-bold mb-8 text-primary flex items-center gap-2 uppercase tracking-tighter">
             <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">01</span>
             Pillar One
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Side Label</label>
                <input name="brandP1Side" value={content.brandP1Side || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
             </div>
             <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Pillar Title</label>
                   <input name="brandP1Title" value={content.brandP1Title || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                   <textarea name="brandP1Desc" rows={2} value={content.brandP1Desc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
                </div>
             </div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
          <h3 className="text-xl font-bold mb-8 text-primary flex items-center gap-2 uppercase tracking-tighter">
             <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">02</span>
             Pillar Two
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Side Label</label>
                <input name="brandP2Side" value={content.brandP2Side || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
             </div>
             <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Pillar Title</label>
                   <input name="brandP2Title" value={content.brandP2Title || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                   <textarea name="brandP2Desc" rows={2} value={content.brandP2Desc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
                </div>
             </div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
          <h3 className="text-xl font-bold mb-8 text-primary flex items-center gap-2 uppercase tracking-tighter">
             <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">03</span>
             Pillar Three
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Side Label</label>
                <input name="brandP3Side" value={content.brandP3Side || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
             </div>
             <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Pillar Title</label>
                   <input name="brandP3Title" value={content.brandP3Title || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                   <textarea name="brandP3Desc" rows={2} value={content.brandP3Desc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
