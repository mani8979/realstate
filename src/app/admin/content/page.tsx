'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function SiteContentAdmin() {
  const [content, setContent] = useState<any>({
    heroBadgeText: 'World-Class Real Estate',
    heroTitle: 'Find Your Perfect Property',
    heroSubtitle: "Invest in a lifestyle defined by luxury, comfort, and exceptional value. Your dream home awaits in Vizag's most prestigious locations.",
    heroCtaText: 'Explore Properties',
    heroCta1Link: '/properties',
    heroCta2Text: 'Book Site Visit',
    heroCta2Link: 'https://wa.me/1234567890',
    heroBgImage: '/luxury_villa_hero_1777953581914.png',
    aboutMission: '',
    aboutVision: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        alert('Content saved successfully!');
      }
    } catch (err) {
      alert('Failed to save content');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Site Content</h1>
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
        {/* Hero Section */}
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

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Background Image URL</label>
              <input 
                name="heroBgImage"
                value={content.heroBgImage || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                placeholder="e.g. /luxury_villa_hero.png or https://..."
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Secondary Button Text</label>
                <input 
                  name="heroCta2Text"
                  value={content.heroCta2Text || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Secondary Button Link</label>
                <input 
                  name="heroCta2Link"
                  value={content.heroCta2Link || ''}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        </div>
 
+        {/* Global 3D Experience */}
+        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
+          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Global 3D Experience</h2>
+          
+          <div className="space-y-4">
+            <div>
+              <label className="block text-sm font-bold text-gray-500 mb-2">Global 3D Model (.glb URL)</label>
+              <input 
+                name="globalThreeDModel"
+                value={content.globalThreeDModel || ''}
+                onChange={handleChange}
+                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
+                placeholder="e.g. /models/dragon_fruit.glb or https://..."
+              />
+            </div>
+            
+            <div>
+              <label className="block text-sm font-bold text-gray-500 mb-2">Popup Title</label>
+              <input 
+                name="globalPopupTitle"
+                value={content.globalPopupTitle || ''}
+                onChange={handleChange}
+                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
+              />
+            </div>
+
+            <div>
+              <label className="block text-sm font-bold text-gray-500 mb-2">Popup Content</label>
+              <textarea 
+                name="globalPopupContent"
+                rows={4}
+                value={content.globalPopupContent || ''}
+                onChange={handleChange}
+                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
+              />
+            </div>
+          </div>
+        </div>
+
         {/* Contact Information */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Contact Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Email Address</label>
              <input 
                name="contactEmail"
                value={content.contactEmail || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Phone Number</label>
              <input 
                name="contactPhone"
                value={content.contactPhone || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Address</label>
              <input 
                name="contactAddress"
                value={content.contactAddress || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
