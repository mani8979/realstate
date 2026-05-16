'use client';

import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, ChevronRight, Globe, Upload, X, Loader2, Sparkles } from 'lucide-react';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';
import FileDropzone from '@/components/admin/FileDropzone';

export default function WhyChooseUsAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<any>({
    brandBadge: 'Our Core Pillars',
    brandTitle1: 'Why',
    brandTitle2: 'Choose Us',
    brandDesc: '',
    brandP1Side: '',
    brandP1Title: '',
    brandP1Desc: '',
    brandP1Image: '',
    brandP2Side: '',
    brandP2Title: '',
    brandP2Desc: '',
    brandP2Image: '',
    brandP3Side: '',
    brandP3Title: '',
    brandP3Desc: '',
    brandP3Image: '',
    brandP4Side: 'Vizag Expert',
    brandP4Title: 'Personalized Care',
    brandP4Desc: 'We help you find the property that matches your lifestyle.',
    brandP4Image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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

  const handleUpload = async (files: FileList | File[], field: string) => {
    const file = files[0];
    if (!file) return;

    setUploading(field);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setContent((prev: any) => ({ ...prev, [field]: data.url }));
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(null);
    }
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
    <div className="max-w-6xl pb-20">
      <AdminPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        url="/#why-choose-us-section" 
        title="Why Choose Us Preview"
      />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tighter">Why Choose Us</h1>
          <p className="text-gray-500 mt-2">Manage the core pillars, brand values, and high-impact images.</p>
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
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Top Badge Text</label>
                <input name="brandBadge" value={content.brandBadge || ''} onChange={handleChange} className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold text-xl" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Title Line 1</label>
                    <input name="brandTitle1" value={content.brandTitle1 || ''} onChange={handleChange} className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold text-xl" />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Title Line 2</label>
                    <input name="brandTitle2" value={content.brandTitle2 || ''} onChange={handleChange} className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold text-xl" />
                 </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                 <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Brand Description (Subtitle)</label>
                 <textarea name="brandDesc" rows={3} value={content.brandDesc || ''} onChange={handleChange} className="w-full p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-lg" />
              </div>
           </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[1, 2, 3, 4].map((num) => (
             <div key={num} className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
                
                <div className="relative z-10 space-y-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-primary uppercase tracking-tighter flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs">0{num}</span>
                        Pillar {num}
                      </h3>
                   </div>

                   <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                         <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Background Image (Optional)</label>
                            {content[`brandP${num}Image`] ? (
                              <div className="relative aspect-video rounded-2xl overflow-hidden group/img">
                                <img src={content[`brandP${num}Image`]} className="w-full h-full object-cover" />
                                <button onClick={() => setContent({...content, [`brandP${num}Image`]: ''})} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all"><X size={24} /></button>
                              </div>
                            ) : (
                              <FileDropzone
                                onFilesSelected={(files) => handleUpload(files, `brandP${num}Image`)}
                                uploading={uploading === `brandP${num}Image`}
                                accept="image/*"
                              >
                                <div className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                                  {uploading === `brandP${num}Image` ? <Loader2 className="animate-spin text-primary" /> : <Upload size={32} className="text-gray-400" />}
                                  <span className="text-[10px] font-bold text-gray-500 mt-2 uppercase">Upload Photo</span>
                                </div>
                              </FileDropzone>
                            )}
                         </div>

                         <div className="space-y-4">
                            <div className="space-y-2">
                               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Side Label / Badge</label>
                               <input name={`brandP${num}Side`} value={content[`brandP${num}Side`] || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                            </div>
                            <div className="space-y-2">
                               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Pillar Title</label>
                               <input name={`brandP${num}Title`} value={content[`brandP${num}Title`] || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-black text-xl" />
                            </div>
                            <div className="space-y-2">
                               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                               <textarea name={`brandP${num}Desc`} rows={3} value={content[`brandP${num}Desc`] || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-medium" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
