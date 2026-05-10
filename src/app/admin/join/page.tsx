'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';

export default function JoinAdmin() {
  const [content, setContent] = useState<any>({
    joinBadge: '',
    joinTitle: '',
    joinDesc: '',
    joinRules: '',
    joinQualifications: '',
    joinIndividualBtnText: '',
    joinIndividualPhone: '',
    joinTeamTitle: '',
    joinTeamMembers: '',
    chatWithUsText: '',
    navJoin: ''
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
        alert('Join page settings saved successfully!');
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
          <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Join Page Settings</h1>
          <p className="text-gray-500">Manage recruitment info, rules, and team collaboration links.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Main Page Content</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Nav Link Name</label>
                <input name="navJoin" value={content.navJoin || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Top Badge Text</label>
                <input name="joinBadge" value={content.joinBadge || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Page Title</label>
              <input name="joinTitle" value={content.joinTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Description</label>
              <textarea name="joinDesc" rows={3} value={content.joinDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>
          </div>
        </div>

        {/* Office & Rules */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Office & Requirements</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Rules & Regulations (One per line)</label>
              <textarea name="joinRules" rows={4} value={content.joinRules || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Qualifications (One per line)</label>
              <textarea name="joinQualifications" rows={4} value={content.joinQualifications || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>
          </div>
        </div>

        {/* Join Actions */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center justify-between">
            <span>Recruitment Actions</span>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <Info size={12} />
              WhatsApp triggers
            </div>
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Individual Button Text</label>
                <input name="joinIndividualBtnText" value={content.joinIndividualBtnText || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Individual Phone (WhatsApp)</label>
                <input name="joinIndividualPhone" value={content.joinIndividualPhone || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Team Section Title</label>
              <input name="joinTeamTitle" value={content.joinTeamTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Team Members (Format: Name - Phone, one per line)</label>
              <textarea name="joinTeamMembers" rows={4} value={content.joinTeamMembers || ''} onChange={handleChange} placeholder="Shariff - 919666080645&#10;Mohammed - 919573785434" className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Global Chat Label</label>
              <input name="chatWithUsText" value={content.chatWithUsText || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
