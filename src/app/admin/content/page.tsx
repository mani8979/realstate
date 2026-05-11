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
          className="bg-primary text-black dark:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div id="hero" className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
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

        {/* Global 3D Experience */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Global 3D Experience</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Global 3D Model (.glb)</label>
              <div className="flex gap-4 items-center">
                <input 
                  name="globalThreeDModel"
                  value={content.globalThreeDModel || ''}
                  onChange={handleChange}
                  className="flex-grow p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                  placeholder="e.g. /models/untitled.glb or https://..."
                />
                <label className="bg-gray-50 dark:bg-gray-900 dark:bg-white text-black dark:text-white dark:text-black px-6 py-4 rounded-xl font-bold cursor-pointer hover:opacity-80 transition-all flex-shrink-0">
                  Upload GLB
                  <input 
                    type="file"
                    accept=".glb"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (data.url) {
                          setContent({ ...content, globalThreeDModel: data.url });
                          alert('3D Model uploaded successfully!');
                        }
                      } catch (err) {
                        alert('Upload failed');
                      }
                    }}
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500 font-medium italic">Current: {content.globalThreeDModel || 'None'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Popup Title</label>
              <input 
                name="globalPopupTitle"
                value={content.globalPopupTitle || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Popup Content</label>
              <textarea 
                name="globalPopupContent"
                rows={4}
                value={content.globalPopupContent || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div id="contact-info" className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
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

        {/* Contact Page Content */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Contact Page Specifics</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Contact Badge</label>
                <input name="contactBadge" value={content.contactBadge || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Contact Title</label>
                <input name="contactTitle" value={content.contactTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Contact Description</label>
              <textarea name="contactDesc" rows={3} value={content.contactDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Call Label</label>
                <input name="contactCallLabel" value={content.contactCallLabel || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Call Subtext (Names)</label>
                <input name="contactCallSub" value={content.contactCallSub || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Email Label</label>
                <input name="contactEmailLabel" value={content.contactEmailLabel || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Email Value</label>
                <input name="contactEmailSub" value={content.contactEmailSub || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Visit Label</label>
                <input name="contactVisitLabel" value={content.contactVisitLabel || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Visit Value (Address)</label>
                <input name="contactVisitSub" value={content.contactVisitSub || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Form Name Label</label>
                <input name="contactFormNameLabel" value={content.contactFormNameLabel || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Form Phone Label</label>
                <input name="contactFormPhoneLabel" value={content.contactFormPhoneLabel || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Form Message Label</label>
                <input name="contactFormMsgLabel" value={content.contactFormMsgLabel || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Form Button Text</label>
                <input name="contactFormBtnText" value={content.contactFormBtnText || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>
          </div>
        </div>
        {/* Join Page Content */}
        <div id="join" className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Join Page Specifics</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Join Page Background Image URL</label>
              <input 
                name="joinBgImage"
                value={content.joinBgImage || ''}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                placeholder="e.g. https://images.unsplash.com/..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Join Badge</label>
                <input name="joinBadge" value={content.joinBadge || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Join Title</label>
                <input name="joinTitle" value={content.joinTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Join Description</label>
              <textarea name="joinDesc" rows={3} value={content.joinDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Office Image 1</label>
                <input name="joinOfficeImage1" value={content.joinOfficeImage1 || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Office Image 2</label>
                <input name="joinOfficeImage2" value={content.joinOfficeImage2 || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Individual Btn Text</label>
                <input name="joinIndividualBtnText" value={content.joinIndividualBtnText || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Individual Phone</label>
                <input name="joinIndividualPhone" value={content.joinIndividualPhone || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Workspace Title</label>
                <input name="joinWorkspaceTitle" value={content.joinWorkspaceTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Workspace Description</label>
                <textarea name="joinWorkspaceDesc" rows={2} value={content.joinWorkspaceDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Individual Title</label>
                <input name="joinIndividualTitle" value={content.joinIndividualTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Individual Description</label>
                <textarea name="joinIndividualDesc" rows={2} value={content.joinIndividualDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Team Title</label>
                <input name="joinTeamTitle" value={content.joinTeamTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Team Description</label>
                <textarea name="joinTeamDesc" rows={2} value={content.joinTeamDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Rules (Newline separated)</label>
                <textarea name="joinRules" rows={4} value={content.joinRules || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2">Qualifications (Newline separated)</label>
                <textarea name="joinQualifications" rows={4} value={content.joinQualifications || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* About Star Lands Section */}
        <div id="about-star-lands" className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">About Star Lands</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">About Page Title</label>
              <input name="aboutTitle" value={content.aboutTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">About Page Description</label>
              <textarea name="aboutDesc" rows={3} value={content.aboutDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Expert Verification</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutExpertTitle" value={content.aboutExpertTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutExpertDesc" rows={2} value={content.aboutExpertDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">100% Legal Clarity</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutLegalTitle" value={content.aboutLegalTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutLegalDesc" rows={2} value={content.aboutLegalDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Zero Hidden Costs</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutZeroTitle" value={content.aboutZeroTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutZeroDesc" rows={2} value={content.aboutZeroDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Real Estate Team Excellence</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutTeamTitle" value={content.aboutTeamTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutTeamDesc" rows={2} value={content.aboutTeamDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">15+ Years of Service</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutYearTitle" value={content.aboutYearTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutYearDesc" rows={2} value={content.aboutYearDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Our Mission</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutMissionTitle" value={content.aboutMissionTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutMissionDesc" rows={2} value={content.aboutMissionDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
              <div>
                <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Our Vision</h3>
                <label className="block text-sm font-bold text-gray-500 mb-2">Title</label>
                <input name="aboutVisionTitle" value={content.aboutVisionTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4" />
                <label className="block text-sm font-bold text-gray-500 mb-2">Description</label>
                <textarea name="aboutVisionDesc" rows={2} value={content.aboutVisionDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
