'use client';

import React, { useState, useEffect } from 'react';
import { Save, Sparkles, MessageCircle, Globe } from 'lucide-react';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';

export default function ReadyToClaimAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<any>({
    ctaSectionTitle: 'Ready to claim\nyour Signature land?',
    ctaSectionDesc: 'Join 1,000+ happy homeowners in Vizag\'s most prestigious communities. Limited units available for immediate registration.',
    ctaSectionBtn1: 'Schedule a Site Visit',
    ctaSectionBtn2: '+91 91234 56789'
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
        alert('CTA settings saved successfully!');
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
        url="/#cta-section" 
        title="CTA Section Preview"
      />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tighter">Ready To Claim</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage the final call-to-action section on the homepage.</p>
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
            {saving ? 'Saving...' : 'Save CTA'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={160} /></div>
          
          <div className="space-y-8 relative">
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Main Heading (use \n for line break)</label>
                <textarea 
                  name="ctaSectionTitle" 
                  rows={2} 
                  value={content.ctaSectionTitle || ''} 
                  onChange={handleChange} 
                  className="w-full p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-800 text-2xl font-black tracking-tight text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
             </div>

             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Description Text</label>
                <textarea 
                  name="ctaSectionDesc" 
                  rows={4} 
                  value={content.ctaSectionDesc || ''} 
                  onChange={handleChange} 
                  className="w-full p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-800 text-lg !text-black dark:!text-white focus:ring-2 focus:ring-primary outline-none transition-all min-h-[160px] shadow-inner"
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                   <label className="block text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Sparkles size={14} className="text-primary" />
                      Primary Button Text
                   </label>
                   <input 
                      name="ctaSectionBtn1" 
                      value={content.ctaSectionBtn1 || ''} 
                      onChange={handleChange} 
                      className="w-full p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-800 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                   />
                </div>
                <div className="space-y-4">
                   <label className="block text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MessageCircle size={14} className="text-primary" />
                      Secondary Button Text (e.g. Phone)
                   </label>
                   <input 
                      name="ctaSectionBtn2" 
                      value={content.ctaSectionBtn2 || ''} 
                      onChange={handleChange} 
                      className="w-full p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-800 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
