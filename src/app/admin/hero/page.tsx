'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import FileDropzone from '@/components/admin/FileDropzone';

export default function HeroAdmin() {
  const [content, setContent] = useState<any>({
    heroBadgeText: 'World-Class Real Estate',
    heroTitle: 'Find Your Perfect Property',
    heroSubtitle: "Invest in a lifestyle defined by luxury, comfort, and exceptional value. Your dream home awaits in Vizag's most prestigious locations.",
    heroCtaText: 'Explore Properties',
    heroCta1Link: '/properties',
    heroCta2Text: 'Book Site Visit',
    heroCta2Link: 'https://wa.me/1234567890',
    heroBgImage: '/luxury_villa_hero_1777953581914.png'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

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
        alert('Hero settings saved successfully!');
      }
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Hero Settings</h1>
        <div className="flex items-center gap-4">
          <a 
            href="/" 
            target="_blank" 
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            Preview Page
          </a>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-black dark:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Top Badge Text</label>
              <input 
                name="heroBadgeText"
                value={content.heroBadgeText || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Hero Title</label>
              <input 
                name="heroTitle"
                value={content.heroTitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Hero Subtitle</label>
              <textarea 
                name="heroSubtitle"
                rows={3}
                value={content.heroSubtitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-500 mb-2">Hero Background Image</label>
              {content.heroBgImage ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <img src={content.heroBgImage} alt="Hero" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setContent({ ...content, heroBgImage: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-black dark:text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-xs font-bold">X</span>
                  </button>
                </div>
              ) : (
              <FileDropzone
                onFilesSelected={async (files) => {
                  const file = files[0];
                  if (!file) return;
                  setUploadingHero(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    if (res.ok) {
                      const data = await res.json();
                      setContent((prev: any) => ({ ...prev, heroBgImage: data.url }));
                    } else {
                      alert('Upload failed.');
                    }
                  } catch (err) {
                    alert('Upload error: ' + (err as any).message);
                  } finally {
                    setUploadingHero(false);
                  }
                }}
                uploading={uploadingHero}
                accept="image/*"
              >
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 hover:border-primary transition-all group">
                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg group-hover:bg-primary group-hover:text-black transition-all">
                    {uploadingHero ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {uploadingHero ? 'Uploading...' : 'Upload Hero Image'}
                  </span>
                </div>
              </FileDropzone>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Primary Button Text</label>
                <input 
                  name="heroCtaText"
                  value={content.heroCtaText || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Primary Button Link</label>
                <input 
                  name="heroCta1Link"
                  value={content.heroCta1Link || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">CTA 2 Text</label>
                <input name="heroCta2Text" value={content.heroCta2Text || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">CTA 2 Link (Optional)</label>
                <input name="heroCta2Link" value={content.heroCta2Link || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">CTA 3 Text (Latest Updates)</label>
                <input name="heroCta3Text" value={content.heroCta3Text || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">CTA 3 Link (Group/Updates Link)</label>
                <input name="heroCta3Link" value={content.heroCta3Link || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Home Branding & Motivation</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Motivation Line</label>
                     <textarea name="motivationLine" rows={3} value={content.motivationLine || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-medium" placeholder="Success in real estate begins with trust..." />
                     <p className="text-[10px] text-gray-500 italic">* Appears in the high-impact banner section below the Hero.</p>
                  </div>
                  <div className="space-y-4">
                     <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Motivation Banner Background</label>
                     {content.motivationBgImage ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden group">
                           <img src={content.motivationBgImage} alt="Motivation BG" className="w-full h-full object-cover" />
                           <button onClick={() => setContent({...content, motivationBgImage: ''})} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold uppercase tracking-widest text-xs">Remove Photo</button>
                        </div>
                     ) : (
                      <FileDropzone
                        onFilesSelected={async (files) => {
                          const file = files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          const data = await res.json();
                          if (data.url) setContent((prev: any) => ({...prev, motivationBgImage: data.url}));
                        }}
                        accept="image/*"
                      >
                        <div className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all bg-gray-50 dark:bg-gray-800/50">
                           <span className="text-xs font-bold text-gray-500">Upload Motivation BG</span>
                        </div>
                      </FileDropzone>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
