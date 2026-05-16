'use client';

import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Plus, Image as ImageIcon, Loader2, Globe } from 'lucide-react';
import FileDropzone from '@/components/admin/FileDropzone';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';

export default function GalleryAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<any>({
    aboutGallery: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/content').then(res => res.ok ? res.json() : {success: false}).then(data => {
        if (data.success && data.data) {
          setContent((prev: any) => ({ ...prev, ...data.data }));
        }
        setLoading(false);
      });
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.url) {
          setContent((prev: any) => ({ 
            ...prev, 
            aboutGallery: [...(prev.aboutGallery || []), { url: data.url, caption: '' }] 
          }));
        }
      }
    } catch (err) {
      alert('Some uploads failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newGallery = [...content.aboutGallery];
    newGallery.splice(index, 1);
    setContent({ ...content, aboutGallery: newGallery });
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newGallery = [...content.aboutGallery];
    newGallery[index].caption = caption;
    setContent({ ...content, aboutGallery: newGallery });
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
        alert('Gallery saved successfully!');
      }
    } catch (err) {
      alert('Failed to save gallery');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div id="premium-gallery" className="max-w-6xl pb-20">
      <AdminPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        url="/#gallery-section" 
        title="Gallery Section Preview"
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tight">About Page Gallery</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage the cinematic photo collection for your About Us section.</p>
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
            className="bg-primary text-black dark:text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
          >
            <Save size={22} />
            {saving ? 'Saving...' : 'Publish Gallery'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Add New Image Card */}
        <FileDropzone
          onFilesSelected={uploadFiles}
          uploading={uploading}
          multiple
          accept="image/*"
        >
          <div className="flex flex-col items-center justify-center aspect-square rounded-[2.5rem] border-4 border-dashed border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:bg-primary/5 bg-gray-50 dark:bg-gray-900/50 transition-all group relative h-full">
            <div className="w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:text-primary group-hover:scale-110">
              {uploading ? <Loader2 className="animate-spin" size={32} /> : <Plus size={32} />}
            </div>
            <span className="text-sm font-black uppercase tracking-widest mt-4 transition-all text-gray-600 dark:text-gray-400 group-hover:text-primary">
              {uploading ? 'Uploading...' : 'Add Photos'}
            </span>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 font-bold">Drag & Drop Supported</p>
          </div>
        </FileDropzone>

        {/* Existing Images */}
        {content.aboutGallery?.map((img: any, index: number) => (
          <div key={index} className="group relative flex flex-col gap-4">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-800">
              <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-md text-black dark:text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-xl"
              >
                <X size={18} />
              </button>
              
              <div className="absolute bottom-4 left-4 text-black dark:text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                <ImageIcon size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Image {index + 1}</span>
              </div>
            </div>
            
            <input 
              type="text"
              placeholder="Add caption..."
              value={img.caption || ''}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
        ))}
      </div>

      {content.aboutGallery?.length === 0 && !uploading && (
        <div className="mt-12 p-20 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-900 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
            <ImageIcon size={40} className="text-gray-700 dark:text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">Your gallery is empty</h3>
          <p className="text-gray-500 mt-2">Upload your first cinematic photo to showcase on the About page.</p>
        </div>
      )}
    </div>
  );
}
