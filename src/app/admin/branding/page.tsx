'use client';

import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Globe, Layout, Smartphone, Loader2 } from 'lucide-react';
import FileDropzone from '@/components/admin/FileDropzone';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';

export default function BrandingAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<any>({
    headerLogoImage: '',
    footerLogoImage: '',
    faviconImage: '',
    logoTitle: '',
    logoSubtitle: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert('Branding settings saved successfully!');
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
        url="/#main-header" 
        title="Site Branding Preview"
      />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tighter">Global Branding</h1>
          <p className="text-gray-500">Manage your logos, identity, and browser icons.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <Globe size={18} />
            Preview Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-black dark:text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Branding'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Global Logos */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-2">
             <Layout size={20} className="text-primary" />
             Global Logos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Header Logo</label>
                {content.headerLogoImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 group">
                    <img src={content.headerLogoImage} alt="Header Logo" className="w-full h-full object-contain p-4" />
                    <button onClick={() => setContent({...content, headerLogoImage: ''})} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><X size={18} /></button>
                  </div>
                ) : (
                  <FileDropzone
                    onFilesSelected={(files) => handleUpload(files, 'headerLogoImage')}
                    uploading={uploading === 'headerLogoImage'}
                    accept="image/*"
                  >
                    <div className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all bg-gray-50 dark:bg-gray-800/50">
                      {uploading === 'headerLogoImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-400 mb-2" />}
                      <span className="text-sm font-bold text-gray-500">{uploading === 'headerLogoImage' ? 'Uploading...' : 'Upload Header Logo'}</span>
                    </div>
                  </FileDropzone>
                )}
             </div>

             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Footer Logo</label>
                {content.footerLogoImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 group">
                    <img src={content.footerLogoImage} alt="Footer Logo" className="w-full h-full object-contain p-4" />
                    <button onClick={() => setContent({...content, footerLogoImage: ''})} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><X size={18} /></button>
                  </div>
                ) : (
                  <FileDropzone
                    onFilesSelected={(files) => handleUpload(files, 'footerLogoImage')}
                    uploading={uploading === 'footerLogoImage'}
                    accept="image/*"
                  >
                    <div className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all bg-gray-50 dark:bg-gray-800/50">
                      {uploading === 'footerLogoImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-400 mb-2" />}
                      <span className="text-sm font-bold text-gray-500">{uploading === 'footerLogoImage' ? 'Uploading...' : 'Upload Footer Logo'}</span>
                    </div>
                  </FileDropzone>
                )}
             </div>
          </div>
        </div>

        {/* Global Identity */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-2">
             <Globe size={20} className="text-primary" />
             Global Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Logo Title (Text)</label>
                <input name="logoTitle" value={content.logoTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" placeholder="e.g. STAR LANDS" />
             </div>
             <div className="space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Logo Subtitle (Text)</label>
                <input name="logoSubtitle" value={content.logoSubtitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" placeholder="e.g. DEVELOPERS" />
             </div>
             <div className="space-y-4 md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Logo Link URL (Redirect when clicked)</label>
                <input name="logoLink" value={content.logoLink || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" placeholder="e.g. /" />
             </div>
          </div>
        </div>

        {/* Browser Icon */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-2">
             <Smartphone size={20} className="text-primary" />
             Browser Favicon
          </h2>
          <div className="flex items-center gap-8">
             {content.faviconImage ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 group p-4">
                   <img src={content.faviconImage} alt="Favicon" className="w-full h-full object-contain" />
                   <button onClick={() => setContent({...content, faviconImage: ''})} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"><X size={18} /></button>
                </div>
             ) : (
                 <FileDropzone
                   onFilesSelected={(files) => handleUpload(files, 'faviconImage')}
                   uploading={uploading === 'faviconImage'}
                   accept="image/*"
                   className="w-24 h-24"
                 >
                    <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all bg-gray-50 dark:bg-gray-800/50">
                      {uploading === 'faviconImage' ? <Loader2 className="animate-spin" /> : <Upload size={24} className="text-gray-400" />}
                    </div>
                 </FileDropzone>
             )}
             <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Browser Tab Icon</h4>
                <p className="text-xs text-gray-500 mt-1">Upload a square image (32x32 or 64x64) in .png or .ico format for the best results across all browsers.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
