'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, Upload, X, Users, Plus, Trash2, Loader2, Globe } from 'lucide-react';
import FileDropzone from '@/components/admin/FileDropzone';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';

export default function JoinAdmin() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    joinBgImage: '',
    joinWorkspaceTitle: '',
    joinWorkspaceDesc: '',
    joinIndividualTitle: '',
    joinIndividualDesc: '',
    joinTeamDesc: '',
    joinEligibility: '',
    officeAddress: '',
    joinTeamLeads: []
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

  const handleLeadChange = (index: number, field: string, value: string) => {
    const updatedLeads = [...content.joinTeamLeads];
    updatedLeads[index] = { ...updatedLeads[index], [field]: value };
    setContent({ ...content, joinTeamLeads: updatedLeads });
  };

  const addLead = () => {
    setContent({
      ...content,
      joinTeamLeads: [...content.joinTeamLeads, { name: '', phone: '', image: '' }]
    });
  };

  const removeLead = (index: number) => {
    const updatedLeads = content.joinTeamLeads.filter((_: any, i: number) => i !== index);
    setContent({ ...content, joinTeamLeads: updatedLeads });
  };

  const handleUpload = async (files: FileList | File[], field: string, index?: number) => {
    const file = files[0];
    if (!file) return;

    const uploadKey = index !== undefined ? `lead-${index}` : field;
    setUploading(uploadKey);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        if (index !== undefined) {
          handleLeadChange(index, 'image', data.url);
        } else {
          setContent((prev: any) => ({ ...prev, [field]: data.url }));
        }
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
      <AdminPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        url="/join" 
        title="Join Page Preview"
      />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase text-gray-900 dark:text-white">Join Page Settings</h1>
          <p className="text-gray-500">Manage recruitment info, rules, and team collaboration links.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
          >
            <Globe size={18} />
            Preview Page
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-black dark:text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hero Background */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Hero Background</h2>
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Background Image</label>
            {content.joinBgImage ? (
              <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                <img src={content.joinBgImage} alt="Join Hero BG" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setContent({ ...content, joinBgImage: '' })} 
                  className="absolute top-4 right-4 bg-red-500 text-black dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <FileDropzone
                onFilesSelected={(files) => handleUpload(files, 'joinBgImage')}
                uploading={uploading === 'joinBgImage'}
                accept="image/*"
              >
                <div className="flex flex-col items-center justify-center w-full aspect-[21/9] rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                  {uploading === 'joinBgImage' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-600 dark:text-gray-400 mb-2" />}
                  <span className="text-sm font-bold text-gray-500">Upload Hero Background</span>
                </div>
              </FileDropzone>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 italic mt-2">
              <Info size={14} className="text-primary" />
              <span>Recommended: High-quality landscape image (2000x800px+).</span>
            </div>
          </div>
        </div>

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
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Floating Chat Label</label>
              <input name="chatWithUsText" value={content.chatWithUsText || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" placeholder="e.g. Chat With Us" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Office Address</label>
              <textarea name="officeAddress" rows={2} value={content.officeAddress || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>
          </div>
        </div>

        {/* Workspace & Path Details */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">Workspace & Path Details</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Workspace Title</label>
                <input name="joinWorkspaceTitle" value={content.joinWorkspaceTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Workspace Description</label>
                <textarea name="joinWorkspaceDesc" rows={2} value={content.joinWorkspaceDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Individual Path Title</label>
                <input name="joinIndividualTitle" value={content.joinIndividualTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Individual Path Description</label>
                <textarea name="joinIndividualDesc" rows={2} value={content.joinIndividualDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Team Path Title</label>
                <input name="joinTeamTitle" value={content.joinTeamTitle || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Team Path Description</label>
                <textarea name="joinTeamDesc" rows={2} value={content.joinTeamDesc || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
              </div>
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
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Eligibility Criteria (One per line)</label>
              <textarea name="joinEligibility" rows={4} value={content.joinEligibility || ''} onChange={handleChange} className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium" />
            </div>
          </div>
        </div>

        {/* Dynamic Team Leads */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
               <Users size={24} className="text-primary" />
               Team Leaders (Popup)
            </h2>
            <button 
              onClick={addLead}
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-black dark:text-white transition-all"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
          
          <div className="space-y-6">
            {content.joinTeamLeads.map((lead: any, index: number) => (
              <div key={index} className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 relative group">
                <button 
                  onClick={() => removeLead(index)}
                  className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-2">Photo</label>
                    {lead.image ? (
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group/img">
                        <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
                        <button onClick={() => handleLeadChange(index, 'image', '')} className="absolute inset-0 bg-white dark:bg-black/40 text-black dark:text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all"><X size={16} /></button>
                      </div>
                    ) : (
                      <FileDropzone
                        onFilesSelected={(files) => handleUpload(files, '', index)}
                        uploading={uploading === `lead-${index}`}
                        accept="image/*"
                      >
                        <div className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all cursor-pointer">
                          {uploading === `lead-${index}` ? <Loader2 className="animate-spin" /> : <Upload size={20} className="text-gray-600 dark:text-gray-400 mb-1" />}
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Upload</span>
                        </div>
                      </FileDropzone>
                    )}
                    {uploading === `lead-${index}` && <p className="text-[10px] text-primary font-bold mt-2 animate-pulse">Uploading...</p>}
                  </div>
                  
                  <div className="md:col-span-3 space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                      <input 
                        value={lead.name || ''} 
                        onChange={(e) => handleLeadChange(index, 'name', e.target.value)} 
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium text-sm" 
                        placeholder="Lead Name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-1">WhatsApp Number</label>
                      <input 
                        value={lead.phone || ''} 
                        onChange={(e) => handleLeadChange(index, 'phone', e.target.value)} 
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium text-sm" 
                        placeholder="91 00000 00000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {content.joinTeamLeads.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-600 dark:text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold">No team leads added yet.</p>
                <button onClick={addLead} className="text-primary font-black uppercase tracking-widest text-xs mt-2 hover:underline">Add First Member</button>
              </div>
            )}
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
                  <button onClick={() => setContent({ ...content, joinOfficeImage1: '' })} className="absolute top-4 right-4 bg-red-500 text-black dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={20} /></button>
                </div>
              ) : (
                <FileDropzone
                  onFilesSelected={(files) => handleUpload(files, 'joinOfficeImage1')}
                  uploading={uploading === 'joinOfficeImage1'}
                  accept="image/*"
                >
                  <div className="flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                    {uploading === 'joinOfficeImage1' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-600 dark:text-gray-400 mb-2" />}
                    <span className="text-sm font-bold text-gray-500">Upload Photo 1</span>
                  </div>
                </FileDropzone>
              )}
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Office Photo 2</label>
              {content.joinOfficeImage2 ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 group">
                  <img src={content.joinOfficeImage2} alt="Office 2" className="w-full h-full object-cover" />
                  <button onClick={() => setContent({ ...content, joinOfficeImage2: '' })} className="absolute top-4 right-4 bg-red-500 text-black dark:text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={20} /></button>
                </div>
              ) : (
                <FileDropzone
                  onFilesSelected={(files) => handleUpload(files, 'joinOfficeImage2')}
                  uploading={uploading === 'joinOfficeImage2'}
                  accept="image/*"
                >
                  <div className="flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary transition-all cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                    {uploading === 'joinOfficeImage2' ? <Loader2 className="animate-spin" /> : <Upload size={32} className="text-gray-600 dark:text-gray-400 mb-2" />}
                    <span className="text-sm font-bold text-gray-500">Upload Photo 2</span>
                  </div>
                </FileDropzone>
              )}
            </div>
          </div>
          {(uploading) && <p className="text-primary text-xs font-bold mt-4 animate-pulse uppercase tracking-widest">Uploading Media...</p>}
        </div>
      </div>
    </div>
  );
}
