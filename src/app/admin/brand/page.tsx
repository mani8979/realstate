'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function BrandAdmin() {
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
    galleryBadge: 'Cinematic Showcase',
    galleryTitle: 'Premium Land Gallery',
    legacyBadge: 'Our Legacy & Values',
    legacyTitle1: '01. The Mission',
    legacyHeading1: "Transforming Vizag's Landscape",
    legacyDesc1: 'We believe in creating sustainable, premium living environments that harmonize with nature while providing modern connectivity.',
    legacyTitle2: '02. The Vision',
    legacyList1: 'Architectural Innovation',
    legacyList2: 'Smart Community Living',
    marqueeText: 'Featured Lands',
    scrollStackDesc: 'Premium residential lands situated in the most sought-after locations, offering the perfect blend of tranquility and urban connectivity.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingMainFounder, setUploadingMainFounder] = useState(false);
  const [uploadingCoFounder, setUploadingCoFounder] = useState(false);
  const [uploadingMotivation, setUploadingMotivation] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
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
        alert('Brand values saved successfully!');
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
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Home Extra Settings</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Global Brand Assets</h2>
          <p className="text-xs text-gray-500 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Manage your logos and site icons in one place to update the entire platform.</p>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Header Logo Image</label>
                {content.headerLogoImage ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group bg-black/5 flex items-center justify-center p-2">
                    <img src={content.headerLogoImage} alt="Header Logo" className="max-w-full max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, headerLogoImage: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-xs font-bold">X</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingHeader}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingHeader(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setContent({ ...content, headerLogoImage: data.url });
                          } else {
                            alert('Upload failed. Please check your Cloudinary settings.');
                          }
                        } catch (err) {
                          alert('Upload error: ' + (err as any).message);
                        } finally {
                          setUploadingHeader(false);
                        }
                      }}
                      className="w-full p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {uploadingHeader && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-gray-500 mt-2 italic">* This logo appears in the top navigation across all pages.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Logo Image</label>
                {content.footerLogoImage ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group bg-black/5 flex items-center justify-center p-2">
                    <img src={content.footerLogoImage} alt="Footer Logo" className="max-w-full max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, footerLogoImage: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-xs font-bold">X</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingFooter}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingFooter(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setContent({ ...content, footerLogoImage: data.url });
                          } else {
                            alert('Upload failed. Please check your Cloudinary settings.');
                          }
                        } catch (err) {
                          alert('Upload error: ' + (err as any).message);
                        } finally {
                          setUploadingFooter(false);
                        }
                      }}
                      className="w-full p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {uploadingFooter && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-gray-500 mt-2 italic">* This logo appears in the footer across all pages.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title Logo (Favicon)</label>
                {content.faviconImage ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group bg-black/5 flex items-center justify-center p-2">
                    <img src={content.faviconImage} alt="Favicon" className="w-16 h-16 object-contain" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, faviconImage: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-xs font-bold">X</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingFavicon}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingFavicon(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setContent({ ...content, faviconImage: data.url });
                          } else {
                            alert('Upload failed. Please check your Cloudinary settings.');
                          }
                        } catch (err) {
                          alert('Upload error: ' + (err as any).message);
                        } finally {
                          setUploadingFavicon(false);
                        }
                      }}
                      className="w-full p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {uploadingFavicon && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-gray-500 mt-2 italic">* This is the icon that appears in the browser tab.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Global Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Logo Title (e.g. STAR LANDS)</label>
              <input 
                name="logoTitle"
                value={content.logoTitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Logo Subtitle (e.g. DEVELOPERS)</label>
              <input 
                name="logoSubtitle"
                value={content.logoSubtitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Home Branding & Motivation</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Home Motivation Line</label>
                <input 
                  name="motivationLine"
                  value={content.motivationLine || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  placeholder="e.g. Success in real estate begins with trust..."
                />
                <p className="text-[10px] text-gray-500 mt-2 italic">* Appears in the high-impact banner section below the Hero.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Motivation Banner Background Photo</label>
                {content.motivationBgImage ? (
                  <div className="relative w-full h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img src={content.motivationBgImage} alt="Motivation Bg" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, motivationBgImage: '' })}
                      className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px]"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingMotivation}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingMotivation(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setContent({ ...content, motivationBgImage: data.url });
                          }
                        } catch (err) {} finally { setUploadingMotivation(false); }
                      }}
                      className="w-full p-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-[10px]"
                    />
                    {uploadingMotivation && <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl text-[10px]">Uploading...</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Top Badge Text</label>
                <input 
                  name="brandBadge"
                  value={content.brandBadge || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-500 mb-2">Main Title (Line 1)</label>
                  <input 
                    name="brandTitle1"
                    value={content.brandTitle1 || ''}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-500 mb-2">Main Title (Line 2)</label>
                  <input 
                    name="brandTitle2"
                    value={content.brandTitle2 || ''}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Founder Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Main Founder Profile (Mahaboob shariff)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Founder Photo</label>
                {content.mainFounderImage ? (
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img src={content.mainFounderImage} alt="Main Founder" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, mainFounderImage: '' })}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-xs font-bold">Remove Image</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingMainFounder}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingMainFounder(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setContent({ ...content, mainFounderImage: data.url });
                          }
                        } catch (err) {} finally { setUploadingMainFounder(false); }
                      }}
                      className="w-full p-10 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {uploadingMainFounder && <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-2xl">Loading...</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Full Name</label>
                <input name="mainFounderName" value={content.mainFounderName || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Designation / Role</label>
                <input name="mainFounderRole" value={content.mainFounderRole || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Biography (Bio)</label>
                <textarea name="mainFounderBio" rows={4} value={content.mainFounderBio || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Founder Vision Statement</label>
                <textarea name="mainFounderVision" rows={3} value={content.mainFounderVision || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Experience & Expertise Points (One per line)</label>
                <textarea name="mainFounderExp" rows={5} value={content.mainFounderExp || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[10px] font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* Co-Founder Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Co-Founder Profile (Muhammad Yaseen)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Co-Founder Photo</label>
                {content.cofounderImage ? (
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img src={content.cofounderImage} alt="Co-Founder" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, cofounderImage: '' })}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-xs font-bold">Remove Image</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCoFounder}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCoFounder(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setContent({ ...content, cofounderImage: data.url });
                          }
                        } catch (err) {} finally { setUploadingCoFounder(false); }
                      }}
                      className="w-full p-10 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {uploadingCoFounder && <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-2xl">Loading...</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Full Name</label>
                <input name="cofounderName" value={content.cofounderName || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Designation / Role</label>
                <input name="cofounderRole" value={content.cofounderRole || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Biography (Bio)</label>
                <textarea name="cofounderBio" rows={4} value={content.cofounderBio || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Mission & Vision Statement</label>
                <textarea name="cofounderVision" rows={3} value={content.cofounderVision || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Experience & Expertise Points (One per line)</label>
                <textarea name="cofounderExp" rows={5} value={content.cofounderExp || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[10px] font-mono" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Pillar 1</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Side Heading (e.g. Quality First)</label>
              <input 
                name="brandP1Side"
                value={content.brandP1Side || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
              <input 
                name="brandP1Title"
                value={content.brandP1Title || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
              <textarea 
                name="brandP1Desc"
                rows={2}
                value={content.brandP1Desc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Pillar 2</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Side Heading (e.g. Legally Secure)</label>
              <input 
                name="brandP2Side"
                value={content.brandP2Side || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
              <input 
                name="brandP2Title"
                value={content.brandP2Title || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
              <textarea 
                name="brandP2Desc"
                rows={2}
                value={content.brandP2Desc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Pillar 3</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Side Heading (e.g. Honest Deals)</label>
              <input 
                name="brandP3Side"
                value={content.brandP3Side || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
              <input 
                name="brandP3Title"
                value={content.brandP3Title || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
              <textarea 
                name="brandP3Desc"
                rows={2}
                value={content.brandP3Desc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Cinematic Showcase (Gallery)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Gallery Badge</label>
              <input 
                name="galleryBadge"
                value={content.galleryBadge || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Gallery Title</label>
              <input 
                name="galleryTitle"
                value={content.galleryTitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Featured Lands Marquee Text</label>
              <input 
                name="marqueeText"
                value={content.marqueeText || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Scroll Gallery Description</label>
              <textarea 
                name="scrollStackDesc"
                rows={2}
                value={content.scrollStackDesc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Legacy & Values Section</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Legacy Top Badge</label>
              <input 
                name="legacyBadge"
                value={content.legacyBadge || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Item 1 - Title</label>
                <input 
                  name="legacyTitle1"
                  value={content.legacyTitle1 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Item 1 - Heading</label>
                <input 
                  name="legacyHeading1"
                  value={content.legacyHeading1 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Item 1 - Description</label>
              <textarea 
                name="legacyDesc1"
                rows={2}
                value={content.legacyDesc1 || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Item 2 - Title</label>
                <input 
                  name="legacyTitle2"
                  value={content.legacyTitle2 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Item 2 - List Point 1</label>
                <input 
                  name="legacyList1"
                  value={content.legacyList1 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Item 2 - List Point 2</label>
                <input 
                  name="legacyList2"
                  value={content.legacyList2 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer & Detailed Contact Settings */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Global Footer & Contact Details</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Reveal Heading (e.g. GET IN TOUCH)</label>
                <input 
                  name="footerTitle"
                  value={content.footerTitle || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Copyright Text</label>
                <input 
                  name="footerCopyright"
                  value={content.footerCopyright || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Inquiry Column</h3>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label (e.g. Inquiries)</label>
                  <input 
                    name="footerInquiriesLabel"
                    value={content.footerInquiriesLabel || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                  <input 
                    name="footerPhone"
                    value={content.footerPhone || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Availability Text (e.g. Mon-Sat...)</label>
                  <input 
                    name="footerPhoneSub"
                    value={content.footerPhoneSub || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Office Column</h3>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label (e.g. Main Office)</label>
                  <input 
                    name="footerOfficeLabel"
                    value={content.footerOfficeLabel || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Address Display (Use \n for line breaks)</label>
                  <textarea 
                    name="footerAddress"
                    rows={2}
                    value={content.footerAddress || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Subtext (e.g. Visit us for coffee...)</label>
                  <input 
                    name="footerAddressSub"
                    value={content.footerAddressSub || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Service 1 Text (e.g. Luxury Interior)</label>
                <input 
                  name="footerService1"
                  value={content.footerService1 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Service 2 Text (e.g. Consultation)</label>
                <input 
                  name="footerService2"
                  value={content.footerService2 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Contact Info (Standard Footer) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Global Contact Info (Standard Footer)</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Footer Description Text</label>
              <textarea 
                name="globalFooterDesc"
                rows={2}
                value={content.globalFooterDesc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Contact Phone</label>
                <input 
                  name="contactPhone"
                  value={content.contactPhone || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Contact Email</label>
                <input 
                  name="contactEmail"
                  value={content.contactEmail || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Copyright (Standard Footer)</label>
                <input 
                  name="globalFooterCopyright"
                  value={content.globalFooterCopyright || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Contact Address</label>
              <textarea 
                name="contactAddress"
                rows={2}
                value={content.contactAddress || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Final Call to Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-500 mb-2">Heading Title (Use \n for new line)</label>
              <textarea 
                name="ctaSectionTitle"
                rows={2}
                value={content.ctaSectionTitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
              <textarea 
                name="ctaSectionDesc"
                rows={2}
                value={content.ctaSectionDesc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Primary Button Text</label>
              <input 
                name="ctaSectionBtn1"
                value={content.ctaSectionBtn1 || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Secondary Button Text (e.g. Phone Number)</label>
              <input 
                name="ctaSectionBtn2"
                value={content.ctaSectionBtn2 || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Office & Location Settings */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Office & Location Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Office Address</label>
              <textarea 
                name="officeAddress"
                rows={2}
                value={content.officeAddress || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Location Instructions (Description)</label>
              <textarea 
                name="officeDescription"
                rows={3}
                value={content.officeDescription || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                placeholder="e.g. Look bro, this is the building..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Shop Number</label>
                <input 
                  name="officeShopNo"
                  value={content.officeShopNo || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  placeholder="e.g. SHOP NO. 202"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Floor Level</label>
                <input 
                  name="officeFloor"
                  value={content.officeFloor || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  placeholder="e.g. SECOND FLOOR"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Google Maps Link (Direct Link)</label>
              <input 
                name="officeMapUrl"
                value={content.officeMapUrl || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Google Maps Embed URL (Iframe src)</label>
              <textarea 
                name="officeMapEmbedUrl"
                rows={3}
                value={content.officeMapEmbedUrl || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-[10px]"
              />
            </div>
          </div>
        </div>

        {/* Global Footer (Reveal Style) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Homepage Footer (Reveal Style)</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Heading (e.g. GET IN TOUCH)</label>
                <input 
                  name="footerTitle"
                  value={content.footerTitle || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Copyright</label>
                <input 
                  name="footerCopyright"
                  value={content.footerCopyright || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Inquiry Column</h3>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label</label>
                  <input name="footerInquiriesLabel" value={content.footerInquiriesLabel || ''} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                  <input name="footerPhone" value={content.footerPhone || ''} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Availability Subtext</label>
                  <input name="footerPhoneSub" value={content.footerPhoneSub || ''} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Office Column</h3>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label</label>
                  <input name="footerOfficeLabel" value={content.footerOfficeLabel || ''} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Address Display</label>
                  <textarea name="footerAddress" rows={2} value={content.footerAddress || ''} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Subtext</label>
                  <input name="footerAddressSub" value={content.footerAddressSub || ''} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Service 1 Text</label>
                <input name="footerService1" value={content.footerService1 || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Service 2 Text</label>
                <input name="footerService2" value={content.footerService2 || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
