'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function FooterAdmin() {
  const [content, setContent] = useState<any>({
    footerTitle: 'GET IN TOUCH',
    footerInquiriesLabel: 'Inquiries',
    footerPhone: '+91 91234 56789',
    footerPhoneSub: 'Available Mon-Sat, 9AM-7PM',
    footerOfficeLabel: 'Main Office',
    footerAddress: 'Beach Road, MVP Colony,\nVisakhapatnam, AP',
    footerAddressSub: 'Visit us for a coffee and a chat.',
    footerCopyright: '© 2026 STAR LANDS DEVELOPERS GROUP',
    privacyPolicyContent: 'Privacy Policy Content goes here...',
    termsOfServiceContent: 'Terms of Service Content goes here...'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);

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
        alert('Footer and Legal settings saved successfully!');
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
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Footer & Legal</h1>
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
        
        {/* Footer Info Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Footer Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Main Big Title</label>
                <input 
                  name="footerTitle"
                  value={content.footerTitle || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Footer Logo Image</label>
                {content.footerLogoImage ? (
                  <div className="relative w-32 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img src={content.footerLogoImage} alt="Footer Logo" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setContent({ ...content, footerLogoImage: '' })}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Save size={12} className="hidden" />
                      <span className="text-[10px] font-bold">X</span>
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
                      className="w-full p-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    {uploadingFooter && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Inquiries Block</h3>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Label</label>
                <input 
                  name="footerInquiriesLabel"
                  value={content.footerInquiriesLabel || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Phone</label>
                <input 
                  name="footerPhone"
                  value={content.footerPhone || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Subtext</label>
                <input 
                  name="footerPhoneSub"
                  value={content.footerPhoneSub || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Office Block</h3>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Label</label>
                <input 
                  name="footerOfficeLabel"
                  value={content.footerOfficeLabel || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Address</label>
                <textarea 
                  name="footerAddress"
                  rows={2}
                  value={content.footerAddress || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Subtext</label>
                <input 
                  name="footerAddressSub"
                  value={content.footerAddressSub || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-4 border-t border-gray-100 dark:border-gray-800 pt-6">
              <label className="block text-sm font-bold text-gray-500 mb-2">Global Footer Short Description (Standard Footer)</label>
              <textarea 
                name="globalFooterDesc"
                rows={2}
                value={content.globalFooterDesc || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium mb-4"
              />
              <label className="block text-sm font-bold text-gray-500 mb-2">Copyright Text (Home Landing Page)</label>
              <input 
                name="footerCopyright"
                value={content.footerCopyright || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium mb-4"
              />
              <label className="block text-sm font-bold text-gray-500 mb-2">Copyright Text (Standard Footer)</label>
              <input 
                name="globalFooterCopyright"
                value={content.globalFooterCopyright || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

          </div>
        </div>

        {/* Office Location Section (Home Page) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Home Office Location (Map Section)</h2>
          <div className="space-y-6">
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
              <label className="block text-sm font-bold text-gray-500 mb-2">Location Description (The "Look bro" text)</label>
              <textarea 
                name="officeDescription"
                rows={2}
                value={content.officeDescription || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Google Maps External Link (URL for button)</label>
              <input 
                name="officeMapUrl"
                value={content.officeMapUrl || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </div>
        </div>

        {/* Legal Pages Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Legal Pages</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Privacy Policy Content</label>
              <textarea 
                name="privacyPolicyContent"
                rows={6}
                value={content.privacyPolicyContent || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
              <p className="text-xs text-gray-400 mt-2">This content will be shown on the /privacy page.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Terms of Service Content</label>
              <textarea 
                name="termsOfServiceContent"
                rows={6}
                value={content.termsOfServiceContent || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
              <p className="text-xs text-gray-400 mt-2">This content will be shown on the /terms page.</p>
            </div>
          </div>
        </div>

        {/* Extra Services Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Extra Service Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Service Link 1</h3>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Link Title</label>
                <input 
                  name="footerService1"
                  value={content.footerService1 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Page Content</label>
                <textarea 
                  name="service1Content"
                  rows={4}
                  value={content.service1Content || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
                <p className="text-xs text-gray-400 mt-2">Shown on /interior page.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-700 dark:text-gray-300">Service Link 2</h3>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Link Title</label>
                <input 
                  name="footerService2"
                  value={content.footerService2 || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Page Content</label>
                <textarea 
                  name="service2Content"
                  rows={4}
                  value={content.service2Content || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
                <p className="text-xs text-gray-400 mt-2">Shown on /consultation page.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
