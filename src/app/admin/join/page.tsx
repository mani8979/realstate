'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, Upload, X, Users } from 'lucide-react';

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
    chatWithUsText: '',
    navJoin: '',
    joinOfficeImage1: '',
    joinOfficeImage2: '',
    teamLead1Name: '',
    teamLead1Phone: '',
    teamLead1Image: '',
    teamLead2Name: '',
    teamLead2Phone: '',
    teamLead2Image: '',
    teamLead3Name: '',
    teamLead3Phone: '',
    teamLead3Image: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
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
        setContent({ ...content, [field]: data.url });
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

        {/* Team Leads (Popup Management) */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center gap-3">
             <Users size={24} className="text-primary" />
             Team Leaders Management (Popup)
          </h2>
          
          <div className="space-y-12">
            {[1, 2, 3].map((num) => (
              <div key={num} className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-primary">Team Lead {num}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Photo</label>
                    {content[`teamLead${num}Image`] ? (
                      <div className="relative aspect-square w-32 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                        <img src={content[`teamLead${num}Image`]} alt={`Lead ${num}`} className="w-full h-full object-cover" />
                        <button onClick={() => setContent({ ...content, [`teamLead${num}Image`]: '' })} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><X size={20} /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-square w-32 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all cursor-pointer">
                        <Upload size={24} className="text-gray-400 mb-1" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Upload</span>
                        <input type="file" className="hidden" onChange={(e) => handleUpload(e, `teamLead${num}Image`)} />
                      </label>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                      <input name={`teamLead${num}Name`} value={content[`teamLead${num}Name`] || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">WhatsApp Number</label>
                      <input name={`teamLead${num}Phone`} value={content[`teamLead${num}Phone`] || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Gallery */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Office Gallery Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Office Photo 1</label>
              {content.joinOfficeImage1 ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                  <img src={content.joinOfficeImage1} alt="Office 1" className="w-full h-full object-cover" />
                  <button onClick={() => setContent({ ...content, joinOfficeImage1: '' })} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={20} /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm font-bold text-gray-500">Upload Photo 1</span>
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'joinOfficeImage1')} />
                </label>
              )}
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Office Photo 2</label>
              {content.joinOfficeImage2 ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                  <img src={content.joinOfficeImage2} alt="Office 2" className="w-full h-full object-cover" />
                  <button onClick={() => setContent({ ...content, joinOfficeImage2: '' })} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={20} /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm font-bold text-gray-500">Upload Photo 2</span>
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'joinOfficeImage2')} />
                </label>
              )}
            </div>
          </div>
          {(uploading) && <p className="text-primary text-xs font-bold mt-4 animate-pulse uppercase tracking-widest">Uploading Media...</p>}
        </div>
      </div>
    </div>
  );
}
