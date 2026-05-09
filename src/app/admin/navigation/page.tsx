'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function NavigationAdmin() {
  const [content, setContent] = useState<any>({
    logoTitle: 'STAR LANDS',
    logoSubtitle: 'DEVELOPERS',
    navHome: 'Home',
    navProperties: 'Properties',
    navAbout: 'About',
    navContact: 'Contact',
    btnCall: 'Call',
    btnCallLink: 'tel:+919876543210',
    btnEnquire: 'Enquire',
    btnEnquireLink: 'https://wa.me/919876543210'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Merge fetched data with defaults to ensure inputs aren't empty
          setContent((prev: any) => ({ ...prev, ...data.data }));
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        alert('Navigation settings saved successfully!');
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
        <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Navigation Settings</h1>
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
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Menu Links Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Nav Link 1 (Home)</label>
              <input 
                name="navHome"
                value={content.navHome || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Nav Link 2 (Properties)</label>
              <input 
                name="navProperties"
                value={content.navProperties || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Nav Link 3 (About)</label>
              <input 
                name="navAbout"
                value={content.navAbout || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Nav Link 4 (Contact)</label>
              <input 
                name="navContact"
                value={content.navContact || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Header Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">Action Button 1 (Left Button)</h3>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Button Text</label>
              <input 
                name="btnCall"
                value={content.btnCall || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Button Link URL (e.g. tel:+91...)</label>
              <input 
                name="btnCallLink"
                value={content.btnCallLink || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div className="col-span-1 md:col-span-2 border-b border-gray-100 dark:border-gray-800 pb-4 pt-4">
              <h3 className="font-bold text-gray-700 dark:text-gray-300">Action Button 2 (Right Button)</h3>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Button Text</label>
              <input 
                name="btnEnquire"
                value={content.btnEnquire || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Button Link URL (e.g. https://wa.me/...)</label>
              <input 
                name="btnEnquireLink"
                value={content.btnEnquireLink || ''}
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
