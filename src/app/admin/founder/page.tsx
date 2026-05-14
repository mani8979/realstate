'use client';

import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Loader2 } from 'lucide-react';
import FileDropzone from '@/components/admin/FileDropzone';

export default function FounderAdmin() {
  const [content, setContent] = useState<any>({
    mainFounderName: '',
    mainFounderRole: '',
    mainFounderBio: '',
    mainFounderVision: '',
    mainFounderExp: '',
    mainFounderImage: '',
    mainFounderPhone: '',
    cofounderName: '',
    cofounderRole: '',
    cofounderBio: '',
    cofounderVision: '',
    cofounderExp: '',
    cofounderImage: '',
    cofounderPhone: ''
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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
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
        alert('Leadership settings saved successfully!');
      }
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Leadership (Founders)</h1>
          <p className="text-gray-500">Manage founder profiles, photos, and direct contact numbers.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-black dark:text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-12">
        {/* Main Founder Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-3">
             <div className="w-2 h-8 bg-primary rounded-full" />
             Main Founder Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Photo (Vertical 4:5 recommended)</label>
                {content.mainFounderImage ? (
                  <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                    <img src={content.mainFounderImage} alt="Founder" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setContent({ ...content, mainFounderImage: '' })}
                      className="absolute top-4 right-4 bg-red-500 text-black dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <FileDropzone
                    onFilesSelected={(files) => handleUpload(files, 'mainFounderImage')}
                    uploading={uploading === 'mainFounderImage'}
                    accept="image/*"
                  >
                    <div className="flex flex-col items-center justify-center w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                      {uploading === 'mainFounderImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-600 dark:text-gray-400 mb-2" />}
                      <span className="text-sm font-bold text-gray-500">Upload Photo</span>
                    </div>
                  </FileDropzone>
                )}
                {uploading === 'mainFounderImage' && <p className="text-primary text-xs font-bold mt-2 animate-pulse">Uploading...</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">WhatsApp/Phone Number (10 digits)</label>
                <input 
                  name="mainFounderPhone"
                  value={content.mainFounderPhone || ''}
                  onChange={handleChange}
                  placeholder="919666080645"
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Full Name</label>
                <input 
                  name="mainFounderName"
                  value={content.mainFounderName || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Role / Designation</label>
                <input 
                  name="mainFounderRole"
                  value={content.mainFounderRole || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Vision Statement</label>
                <textarea 
                  name="mainFounderVision"
                  rows={3}
                  value={content.mainFounderVision || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Professional Bio</label>
                <textarea 
                  name="mainFounderBio"
                  rows={4}
                  value={content.mainFounderBio || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Highlights (One per line)</label>
                <textarea 
                  name="mainFounderExp"
                  rows={5}
                  value={content.mainFounderExp || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Co-Founder Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-3">
             <div className="w-2 h-8 bg-primary rounded-full" />
             Co-Founder Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Photo (Vertical 4:5 recommended)</label>
                {content.cofounderImage ? (
                  <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                    <img src={content.cofounderImage} alt="Co-Founder" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setContent({ ...content, cofounderImage: '' })}
                      className="absolute top-4 right-4 bg-red-500 text-black dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <FileDropzone
                    onFilesSelected={(files) => handleUpload(files, 'cofounderImage')}
                    uploading={uploading === 'cofounderImage'}
                    accept="image/*"
                  >
                    <div className="flex flex-col items-center justify-center w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                      {uploading === 'cofounderImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-600 dark:text-gray-400 mb-2" />}
                      <span className="text-sm font-bold text-gray-500">Upload Photo</span>
                    </div>
                  </FileDropzone>
                )}
                {uploading === 'cofounderImage' && <p className="text-primary text-xs font-bold mt-2 animate-pulse">Uploading...</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">WhatsApp/Phone Number (10 digits)</label>
                <input 
                  name="cofounderPhone"
                  value={content.cofounderPhone || ''}
                  onChange={handleChange}
                  placeholder="919573785434"
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Full Name</label>
                <input 
                  name="cofounderName"
                  value={content.cofounderName || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Role / Designation</label>
                <input 
                  name="cofounderRole"
                  value={content.cofounderRole || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Vision Statement</label>
                <textarea 
                  name="cofounderVision"
                  rows={3}
                  value={content.cofounderVision || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Professional Bio</label>
                <textarea 
                  name="cofounderBio"
                  rows={4}
                  value={content.cofounderBio || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Highlights (One per line)</label>
                <textarea 
                  name="cofounderExp"
                  rows={5}
                  value={content.cofounderExp || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
