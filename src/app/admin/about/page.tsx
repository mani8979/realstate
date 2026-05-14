'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, Upload, X, Users, Plus, Trash2, Layout, Sparkles, ShieldCheck, Target, Award, Camera, Settings, Loader2 } from 'lucide-react';
import FileDropzone from '@/components/admin/FileDropzone';
import { cn } from '@/lib/utils';

type TabType = 'branding' | 'hero' | 'founder' | 'vision' | 'values' | 'journey' | 'gallery';

export default function AboutAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('branding');
  const [content, setContent] = useState<any>({
    logoTitle: '',
    logoSubtitle: '',
    aboutTitle: '',
    aboutDesc: '',
    mainFounderName: '',
    mainFounderRole: '',
    mainFounderBio: '',
    mainFounderVision: '',
    mainFounderExp: '',
    mainFounderImage: '',
    cofounderName: '',
    cofounderRole: '',
    cofounderBio: '',
    cofounderVision: '',
    cofounderExp: '',
    cofounderImage: '',
    aboutMissionTitle: '',
    aboutMissionDesc: '',
    aboutVisionTitle: '',
    aboutVisionDesc: '',
    aboutExpertTitle: '',
    aboutExpertDesc: '',
    aboutLegalTitle: '',
    aboutLegalDesc: '',
    aboutZeroTitle: '',
    aboutZeroDesc: '',
    aboutTeamTitle: '',
    aboutTeamDesc: '',
    aboutYearTitle: '',
    aboutYearDesc: '',
    aboutGallery: []
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

  const handleUpload = async (files: FileList | File[], field: string, index?: number) => {
    const file = files[0];
    if (!file) return;

    const uploadKey = index !== undefined ? `gallery-${index}` : field;
    setUploading(uploadKey);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        if (index !== undefined) {
          const updatedGallery = [...content.aboutGallery];
          updatedGallery[index] = { ...updatedGallery[index], url: data.url };
          setContent((prev: any) => ({ ...prev, aboutGallery: updatedGallery }));
        } else {
          setContent((prev: any) => ({ ...prev, [field]: data.url }));
        }
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const addGalleryItem = () => {
    setContent({
      ...content,
      aboutGallery: [...(content.aboutGallery || []), { url: '', caption: '' }]
    });
  };

  const removeGalleryItem = (index: number) => {
    const updatedGallery = content.aboutGallery.filter((_: any, i: number) => i !== index);
    setContent({ ...content, aboutGallery: updatedGallery });
  };

  const handleGalleryChange = (index: number, field: string, value: string) => {
    const updatedGallery = [...content.aboutGallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setContent({ ...content, aboutGallery: updatedGallery });
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
        alert('About page settings saved successfully!');
      }
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'branding', label: 'Branding', icon: Layout },
    { id: 'hero', label: 'Hero', icon: Sparkles },
    { id: 'founder', label: 'Founder', icon: Users },
    { id: 'vision', label: 'Vision & Mission', icon: Target },
    { id: 'journey', label: 'Our Journey', icon: Award },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'values', label: 'Core Values', icon: ShieldCheck },
  ];

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">About Page Settings</h1>
          <p className="text-gray-500 mt-2">Manage the core story, professionals, history, and gallery.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">Preview</button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-black dark:text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Page Content'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-2xl mb-10 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white dark:bg-gray-900 text-primary shadow-sm" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
        {activeTab === 'branding' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Logo Title</label>
                  <input name="logoTitle" value={content.logoTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Logo Subtitle</label>
                  <input name="logoSubtitle" value={content.logoSubtitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Main Hero Title</label>
                <input name="aboutTitle" value={content.aboutTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xl font-bold" />
             </div>
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Intro Paragraph</label>
                <textarea name="aboutDesc" rows={6} value={content.aboutDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
             </div>
          </div>
        )}

        {activeTab === 'founder' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
               <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-primary">Main Founder Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="md:col-span-1 space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Founder Image</label>
                    {content.mainFounderImage ? (
                      <div className="relative aspect-square rounded-2xl overflow-hidden group">
                        <img src={content.mainFounderImage} className="w-full h-full object-cover" />
                        <button onClick={() => setContent({...content, mainFounderImage: ''})} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><X size={24} /></button>
                      </div>
                    ) : (
                      <FileDropzone
                        onFilesSelected={(files) => handleUpload(files, 'mainFounderImage')}
                        uploading={uploading === 'mainFounderImage'}
                        accept="image/*"
                      >
                        <div className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all">
                          {uploading === 'mainFounderImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-400" />}
                        </div>
                      </FileDropzone>
                    )}
                  </div>
                  <div className="md:col-span-3 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Name</label>
                          <input name="mainFounderName" value={content.mainFounderName || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Role</label>
                          <input name="mainFounderRole" value={content.mainFounderRole || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Biography</label>
                        <textarea name="mainFounderBio" rows={4} value={content.mainFounderBio || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
               <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-primary">Co-Founder Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="md:col-span-1 space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Founder Image</label>
                    {content.cofounderImage ? (
                      <div className="relative aspect-square rounded-2xl overflow-hidden group">
                        <img src={content.cofounderImage} className="w-full h-full object-cover" />
                        <button onClick={() => setContent({...content, cofounderImage: ''})} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><X size={24} /></button>
                      </div>
                    ) : (
                      <FileDropzone
                        onFilesSelected={(files) => handleUpload(files, 'cofounderImage')}
                        uploading={uploading === 'cofounderImage'}
                        accept="image/*"
                      >
                        <div className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all">
                          {uploading === 'cofounderImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-400" />}
                        </div>
                      </FileDropzone>
                    )}
                  </div>
                  <div className="md:col-span-3 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Name</label>
                          <input name="cofounderName" value={content.cofounderName || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Role</label>
                          <input name="cofounderRole" value={content.cofounderRole || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Biography</label>
                        <textarea name="cofounderBio" rows={4} value={content.cofounderBio || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-lg font-bold text-primary">Our Mission</h3>
                   <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Mission Title</label>
                      <input name="aboutMissionTitle" value={content.aboutMissionTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                   </div>
                   <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Mission Description</label>
                      <textarea name="aboutMissionDesc" rows={4} value={content.aboutMissionDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                   </div>
                </div>
                <div className="space-y-6 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-lg font-bold text-primary">Our Vision</h3>
                   <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Vision Title</label>
                      <input name="aboutVisionTitle" value={content.aboutVisionTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                   </div>
                   <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Vision Description</label>
                      <textarea name="aboutVisionDesc" rows={4} value={content.aboutVisionDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Metric 1 (Team)</h3>
                   <input name="aboutTeamTitle" value={content.aboutTeamTitle || ''} onChange={handleChange} placeholder="e.g. 50+ Experts" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mb-4 font-bold" />
                   <textarea name="aboutTeamDesc" rows={2} value={content.aboutTeamDesc || ''} onChange={handleChange} placeholder="Description..." className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                </div>
                <div className="space-y-4 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Metric 2 (Years)</h3>
                   <input name="aboutYearTitle" value={content.aboutYearTitle || ''} onChange={handleChange} placeholder="e.g. 15+ Years" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mb-4 font-bold" />
                   <textarea name="aboutYearDesc" rows={2} value={content.aboutYearDesc || ''} onChange={handleChange} placeholder="Description..." className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">About Page Gallery</h3>
                <button onClick={addGalleryItem} className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                   <Plus size={18} />
                   Add Image
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.aboutGallery?.map((item: any, index: number) => (
                  <div key={index} className="p-6 rounded-3xl bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-gray-800 relative group">
                     <button onClick={() => removeGalleryItem(index)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                     <div className="space-y-4">
                        {item.url ? (
                          <div className="relative aspect-video rounded-2xl overflow-hidden group/img">
                            <img src={item.url} className="w-full h-full object-cover" />
                            <button onClick={() => handleGalleryChange(index, 'url', '')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all"><X size={20} /></button>
                          </div>
                        ) : (
                          <FileDropzone
                            onFilesSelected={(files) => handleUpload(files, '', index)}
                            uploading={uploading === `gallery-${index}`}
                            accept="image/*"
                          >
                            <div className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all">
                              {uploading === `gallery-${index}` ? <Loader2 className="animate-spin" /> : <Upload size={24} className="text-gray-400" />}
                            </div>
                          </FileDropzone>
                        )}
                        <input value={item.caption || ''} onChange={(e) => handleGalleryChange(index, 'caption', e.target.value)} placeholder="Image caption..." className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'values' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Value 1</h3>
                   <input name="aboutExpertTitle" value={content.aboutExpertTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-bold mb-4" />
                   <textarea name="aboutExpertDesc" rows={3} value={content.aboutExpertDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                </div>
                <div className="space-y-4 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Value 2</h3>
                   <input name="aboutLegalTitle" value={content.aboutLegalTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-bold mb-4" />
                   <textarea name="aboutLegalDesc" rows={3} value={content.aboutLegalDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                </div>
                <div className="space-y-4 p-8 bg-gray-50 dark:bg-black/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Value 3</h3>
                   <input name="aboutZeroTitle" value={content.aboutZeroTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-bold mb-4" />
                   <textarea name="aboutZeroDesc" rows={3} value={content.aboutZeroDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
