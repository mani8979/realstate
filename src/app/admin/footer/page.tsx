'use client';

import React, { useState, useEffect } from 'react';
import { Save, Globe, Share2, MapPin, Phone, Mail, Info, FileText, Layout } from 'lucide-react';

export default function FooterAdmin() {
  const [content, setContent] = useState<any>({
    logoTitle: 'STAR LANDS',
    globalFooterDesc: 'Find your dream property with our expert real estate services. We specialize in buying, selling, and renting premium properties.',
    navHome: 'Home',
    navProperties: 'Properties',
    navAbout: 'About',
    navContact: 'Contact',
    navJoin: 'Join',
    footerCol1Title: 'Navigation',
    footerCol2Title: 'Portfolios',
    footerCol2Links: 'Premium Farm lands, Commercial Lands, Residential Lands, VMRDA Lands',
    footerCol3Title: 'Get In Touch',
    contactAddress: 'Flat No.202,Backside Complex,Opposite DMART,Srinagar,Gajuwaka,Visakhapatnam-530026',
    contactPhone: '+91 9666080645',
    contactEmail: 'starlanddevelopers2@gmail.com',
    globalFooterCopyright: '© 2026 STAR LAND DEVELOPERS. All rights reserved.',
    socialFacebook: '',
    socialInstagram: '',
    footerLogoImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);

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
        alert('Footer settings saved successfully!');
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
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tighter">Footer Management</h1>
          <p className="text-gray-500 mt-2 font-medium">Customize the global footer information across all pages.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-black dark:text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/30 transition-all shadow-xl shadow-primary/20"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Footer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Brand & Desc */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
               <Globe size={18} />
               Brand Identity
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Logo Title (e.g. REALS)</label>
                <input name="logoTitle" value={content.logoTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Global Footer Description</label>
                <textarea name="globalFooterDesc" rows={3} value={content.globalFooterDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Footer Logo Image</label>
                {content.footerLogoImage ? (
                  <div className="relative aspect-[3/1] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 group bg-gray-50 dark:bg-gray-800/50">
                    <img src={content.footerLogoImage} alt="Footer Logo" className="w-full h-full object-contain" />
                    <button onClick={() => setContent({ ...content, footerLogoImage: '' })} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold">Remove Logo</button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[3/1] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 cursor-pointer hover:border-primary transition-all bg-gray-50 dark:bg-gray-800/50 group">
                    <input type="file" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingFooter(true);
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.url) setContent({ ...content, footerLogoImage: data.url });
                      setUploadingFooter(false);
                    }} />
                    <Layout size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-gray-500 mt-2">Upload Footer Logo</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
               <Share2 size={18} />
               Social Links
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Facebook URL</label>
                <input name="socialFacebook" value={content.socialFacebook || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Instagram URL</label>
                <input name="socialInstagram" value={content.socialInstagram || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Navigation & Portfolios */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
               <Info size={18} />
               Navigation Column
            </h2>
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Column Title</label>
                  <input name="footerCol1Title" value={content.footerCol1Title || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Home Label</label>
                    <input name="navHome" value={content.navHome || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Properties Label</label>
                    <input name="navProperties" value={content.navProperties || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">About Label</label>
                    <input name="navAbout" value={content.navAbout || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Contact Label</label>
                    <input name="navContact" value={content.navContact || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Join Label</label>
                    <input name="navJoin" value={content.navJoin || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm font-bold" />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
               <Globe size={18} />
               Portfolios Column
            </h2>
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Column Title</label>
                  <input name="footerCol2Title" value={content.footerCol2Title || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
               </div>
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Links (Comma-separated)</label>
                  <textarea name="footerCol2Links" rows={3} value={content.footerCol2Links || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-medium" />
               </div>
            </div>
          </div>
        </div>

        {/* Column 3: Get In Touch */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
           <h2 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Phone size={18} />
              Get In Touch Column
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Column Title</label>
                  <input name="footerCol3Title" value={content.footerCol3Title || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold mb-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><MapPin size={10} /> Address</label>
                       <textarea name="contactAddress" rows={3} value={content.contactAddress || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-medium" />
                    </div>
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><Phone size={10} /> Phone Number</label>
                          <input name="contactPhone" value={content.contactPhone || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><Mail size={10} /> Email Address</label>
                          <input name="contactEmail" value={content.contactEmail || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 font-bold" />
                       </div>
                    </div>
                  </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2"><FileText size={14} /> Copyright & Legal</label>
                  <div className="space-y-6">
                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Standard Copyright</label>
                        <textarea name="globalFooterCopyright" rows={3} value={content.globalFooterCopyright || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold" />
                     </div>
                  </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
