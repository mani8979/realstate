'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, ArrowLeft, Play, Image as ImageIcon, 
  Map as MapIcon, Download, ChevronLeft, ChevronRight,
  Maximize2, MousePointer2, LayoutGrid, Box, Settings, List, Sliders, Plus, Trash2, Upload,
  Loader2, Sparkles, Save, FileText, Check, Search,
  ChevronUp, ChevronDown, Trash, Edit2, Copy, Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SmartContentEditor, Section } from './SmartContentEditor';
import FileDropzone from './FileDropzone';

const parseRawText = (text: string): any[] => {
  const sections: any[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
  let currentSection: any = null;

  lines.forEach(line => {
    // Heading detection: All caps, at least 3 chars, not a list item
    const isAllCaps = line.length >= 3 && line === line.toUpperCase() && !/^[\-\*\•\d\.]/.test(line);
    const cleanLine = line.replace(/[^A-Z]/g, '');
    
    if ((isAllCaps && cleanLine.length > 0) || !currentSection) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line,
        content: '',
        alignment: 'left',
        isPointed: false,
        showArrow: true
      };
    } else {
      currentSection.content += (currentSection.content ? '\n' : '') + line;
      
      // Auto-detect list format: if multiple lines or any line starts with a marker
      const contentLines = currentSection.content.split('\n');
      const hasBulletMarker = /^[\-\*\•\d\.]/.test(line);
      const isListLike = contentLines.length > 1 && contentLines.every((l: string) => l.length < 150);
      
      if (hasBulletMarker || isListLike) {
        currentSection.isPointed = true;
      }
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(() => {
    const base = {
      title: '',
      price: '',
      location: '',
      type: 'House',
      description: '',
      images: [],
      bedrooms: '',
      bathrooms: '',
      area: '',
      featured: false,
      fruitImage: '',
      fruitInfo: '',
      landPhotos: [],
      threeDElement: '',
      videoUrl: '',
      mapUrl: '',
      landBrochure: [],
      details: [],
      fruitDetails: [],
      layoutImage: '',
      plots: [],
      alignment: 'left'
    };
    if (!initialData) return base;
    return {
      ...base,
      ...initialData,
      details: Array.isArray(initialData.details) ? initialData.details : [],
      plots: Array.isArray(initialData.plots) ? initialData.plots.map((p: any) => ({
        ...p,
        x: p.x ?? 0,
        y: p.y ?? 0,
        width: p.width ?? 5,
        height: p.height ?? 3
      })) : [],
      landPhotos: Array.isArray(initialData.landPhotos) ? initialData.landPhotos : [],
      landBrochure: Array.isArray(initialData.landBrochure) ? initialData.landBrochure : [],
      alignment: initialData.alignment || 'left',
      subType: initialData.subType || ''
    };
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({
        ...prev,
        ...initialData,
        title: initialData.title || '',
        price: initialData.price || '',
        location: initialData.location || '',
        type: initialData.type || 'House',
        subType: initialData.subType || '',
        description: initialData.description || '',
        images: Array.isArray(initialData.images) ? initialData.images.filter(Boolean) : [],
        bedrooms: initialData.bedrooms || '',
        bathrooms: initialData.bathrooms || '',
        area: initialData.area || '',
        featured: !!initialData.featured,
        fruitImage: initialData.fruitImage || '',
        fruitInfo: initialData.fruitInfo || '',
        landPhotos: Array.isArray(initialData.landPhotos) ? initialData.landPhotos.filter(Boolean) : [],
        threeDElement: initialData.threeDElement || '',
        videoUrl: initialData.videoUrl || '',
        mapUrl: initialData.mapUrl || '',
        landBrochure: Array.isArray(initialData.landBrochure) ? initialData.landBrochure.filter(Boolean) : [],
        details: Array.isArray(initialData.details) ? initialData.details.filter((d: any) => d !== null).map((d: any) => ({
          heading: d?.heading || '',
          content: d?.content || '',
          sideHeading: d?.sideHeading || '',
          showArrow: !!d?.showArrow,
          isPointed: !!d?.isPointed,
          alignment: d?.alignment || 'left'
        })) : [],
        fruitDetails: Array.isArray(initialData.fruitDetails) ? initialData.fruitDetails.filter((d: any) => d !== null).map((d: any) => ({
          heading: d?.heading || '',
          content: d?.content || '',
          showArrow: !!d?.showArrow,
          isPointed: !!d?.isPointed
        })) : [],
        plots: Array.isArray(initialData.plots) ? initialData.plots.filter((p: any) => p !== null).map((p: any) => ({
          ...p,
          x: p.x ?? 0,
          y: p.y ?? 0,
          width: p.width ?? 5,
          height: p.height ?? 3,
          status: p.status || 'available'
        })) : [],
        alignment: initialData.alignment || 'left',
        layoutImage: initialData.layoutImage || ''
      }));
    }
  }, [initialData]);

  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/content`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.data?.propertyCategories) {
          // Ensure every category has a subCategories array
          const sanitized = data.data.propertyCategories.map((c: any) => ({
            ...c,
            subCategories: Array.isArray(c.subCategories) ? c.subCategories : []
          }));
          setCategories(sanitized);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);
  const [localFiles, setLocalFiles] = useState<{
    images: { file: File; preview: string }[];
    landPhotos: { file: File; preview: string }[];
    landBrochure: { file: File; preview: string }[];
    fruitImage: { file: File; preview: string } | null;
    threeDElement: { file: File; preview: string } | null;
    layoutImage: { file: File; preview: string } | null;
  }>({
    images: [],
    landPhotos: [],
    landBrochure: [],
    fruitImage: null,
    threeDElement: null,
    layoutImage: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const landPhotosInputRef = useRef<HTMLInputElement>(null);
  const fruitInputRef = useRef<HTMLInputElement>(null);
  const threeDInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const layoutImageInputRef = useRef<HTMLInputElement>(null);
  const [showSmartEditor, setShowSmartEditor] = useState(false);

  const deleteAsset = async (url: string) => {
    if (!url || !url.includes('cloudinary.com')) return;
    try {
      await fetch(`${window.location.origin}/api/upload`, {
        method: 'DELETE',
        body: JSON.stringify({ url }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Failed to delete asset:', err);
    }
  };
  const handleSmartSave = (sections: Section[]) => {
    const formattedDetails = sections.map(s => ({
      heading: s.heading || '',
      sideHeading: s.sideHeading || '',
      content: s.content || '',
      showArrow: !!s.showArrow,
      isPointed: !!s.isPointed,
      alignment: s.alignment || 'left'
    }));
    setFormData((prev: any) => ({ ...prev, details: formattedDetails }));
    setShowSmartEditor(false);
  };

  const handleSmartParse = () => {
    if (!formData.description.trim()) return;
    const parsed = parseRawText(formData.description);
    const formattedDetails = parsed.map(s => ({
      heading: s.heading || '',
      sideHeading: s.sideHeading || '',
      content: s.content || '',
      showArrow: !!s.showArrow,
      isPointed: !!s.isPointed,
      alignment: s.alignment || 'left'
    }));
    setFormData((prev: any) => ({ ...prev, details: formattedDetails }));
    
    // Scroll to the details section
    const detailsElement = document.getElementById('details-section');
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    const response = await fetch(`${window.location.origin}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    });
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  };

  const handleFruitUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const preview = URL.createObjectURL(file);
    
    // Auto-delete old cloudinary image if overwriting
    if (formData.fruitImage?.includes('cloudinary.com')) {
      deleteAsset(formData.fruitImage);
    }

    setLocalFiles(prev => ({ ...prev, fruitImage: { file, preview } }));
    setFormData((prev: any) => ({ ...prev, fruitImage: preview }));
  };

  const removeFruitImage = () => {
    if (formData.fruitImage?.includes('cloudinary.com')) {
      deleteAsset(formData.fruitImage);
    }
    setLocalFiles(prev => ({ ...prev, fruitImage: null }));
    setFormData((prev: any) => ({ ...prev, fruitImage: '' }));
  };

  const handleThreeDUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const preview = URL.createObjectURL(file);

    if (formData.threeDElement?.includes('cloudinary.com')) {
      deleteAsset(formData.threeDElement);
    }

    setLocalFiles(prev => ({ ...prev, threeDElement: { file, preview } }));
    setFormData((prev: any) => ({ ...prev, threeDElement: preview }));
  };

  const removeThreeD = () => {
    if (formData.threeDElement?.includes('cloudinary.com')) {
      deleteAsset(formData.threeDElement);
    }
    setLocalFiles(prev => ({ ...prev, threeDElement: null }));
    setFormData((prev: any) => ({ ...prev, threeDElement: '' }));
  };

  const handleFileUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setLocalFiles(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    setFormData((prev: any) => ({
      ...prev,
      images: [...prev.images, ...newFiles.map(f => f.preview)]
    }));
  };

  const handleLandPhotosUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setLocalFiles(prev => ({ ...prev, landPhotos: [...prev.landPhotos, ...newFiles] }));
    setFormData((prev: any) => ({
      ...prev,
      landPhotos: [...prev.landPhotos, ...newFiles.map(f => f.preview)]
    }));
  };

  const removeLandPhoto = (url: string) => {
    setLocalFiles(prev => ({
      ...prev,
      landPhotos: prev.landPhotos.filter(f => f.preview !== url)
    }));
    setFormData((prev: any) => ({
      ...prev,
      landPhotos: prev.landPhotos.filter((img: string) => img !== url)
    }));
  };

  const handleVideoUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      
      // 1. Get signature from our API
      const sigResponse = await fetch(`${window.location.origin}/api/upload/signature`);
      const sigData = await sigResponse.json();
      
      if (!sigResponse.ok) throw new Error(sigData.error || 'Failed to get upload signature');

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp.toString());
      formData.append('signature', sigData.signature);
      formData.append('folder', 'starlands_uploads');

      const clResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const clData = await clResponse.json();

      if (clResponse.ok) {
        setFormData((prev: any) => ({ ...prev, videoUrl: clData.secure_url }));
        alert('Video uploaded successfully!');
      } else {
        alert(`Cloudinary Upload failed: ${clData.error?.message || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setFormData((prev: any) => ({ ...prev, videoUrl: '' }));
  };

  const handleLayoutImageUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const preview = URL.createObjectURL(file);

    if (formData.layoutImage?.includes('cloudinary.com')) {
      deleteAsset(formData.layoutImage);
    }

    setLocalFiles(prev => ({ ...prev, layoutImage: { file, preview } }));
    setFormData((prev: any) => ({ ...prev, layoutImage: preview }));
  };

  const removeLayoutImage = () => {
    if (formData.layoutImage?.includes('cloudinary.com')) {
      deleteAsset(formData.layoutImage);
    }
    setLocalFiles(prev => ({ ...prev, layoutImage: null }));
    setFormData((prev: any) => ({ ...prev, layoutImage: '' }));
  };

  const handleBrochureUpload = (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setLocalFiles(prev => ({ ...prev, landBrochure: [...prev.landBrochure, ...newFiles] }));
    setFormData((prev: any) => ({
      ...prev,
      landBrochure: [...prev.landBrochure, ...newFiles.map(f => f.preview)]
    }));
  };

  const removeImage = (url: string) => {
    if (url.includes('cloudinary.com')) {
      deleteAsset(url);
    }
    setLocalFiles(prev => ({
      ...prev,
      images: prev.images.filter(f => f.preview !== url)
    }));
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== url)
    }));
  };

  const setAsMainImage = (url: string) => {
    setFormData((prev: any) => ({
      ...prev,
      images: [url, ...prev.images.filter((img: string) => img !== url)]
    }));
  };

  const removeBrochure = (url: string) => {
    if (url.includes('cloudinary.com')) {
      deleteAsset(url);
    }
    setLocalFiles(prev => ({
      ...prev,
      landBrochure: prev.landBrochure.filter(f => f.preview !== url)
    }));
    setFormData((prev: any) => ({
      ...prev,
      landBrochure: prev.landBrochure.filter((item: string) => item !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const finalPayload = { ...formData };

      // 1. Upload Gallery Images
      const galleryUrls = [];
      for (const img of formData.images) {
        if (img.startsWith('blob:')) {
          const local = localFiles.images.find(f => f.preview === img);
          if (local) {
            const url = await uploadFile(local.file);
            galleryUrls.push(url);
          }
        } else {
          galleryUrls.push(img);
        }
      }
      finalPayload.images = galleryUrls;

      // 2. Upload Land Photos
      const landUrls = [];
      for (const img of formData.landPhotos) {
        if (img.startsWith('blob:')) {
          const local = localFiles.landPhotos.find(f => f.preview === img);
          if (local) {
            const url = await uploadFile(local.file);
            landUrls.push(url);
          }
        } else {
          landUrls.push(img);
        }
      }
      finalPayload.landPhotos = landUrls;

      // 3. Upload Brochures
      const brochureUrls = [];
      for (const img of formData.landBrochure) {
        if (img.startsWith('blob:')) {
          const local = localFiles.landBrochure.find(f => f.preview === img);
          if (local) {
            const url = await uploadFile(local.file);
            brochureUrls.push(url);
          }
        } else {
          brochureUrls.push(img);
        }
      }
      finalPayload.landBrochure = brochureUrls;

      // 4. Single File Fields
      if (formData.fruitImage?.startsWith('blob:') && localFiles.fruitImage) {
        finalPayload.fruitImage = await uploadFile(localFiles.fruitImage.file);
      }
      if (formData.threeDElement?.startsWith('blob:') && localFiles.threeDElement) {
        finalPayload.threeDElement = await uploadFile(localFiles.threeDElement.file);
      }
      if (formData.layoutImage?.startsWith('blob:') && localFiles.layoutImage) {
        finalPayload.layoutImage = await uploadFile(localFiles.layoutImage.file);
      }

      await onSubmit(finalPayload);
    } catch (error) {
      console.error('Final publish failed:', error);
      alert('Failed to publish property assets. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>

    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Submit Section */}
        <div className="col-span-full bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Ready to Publish?</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest italic">All changes will be saved and photos will be securely synced to the cloud.</p>
          </div>
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full md:w-auto bg-primary hover:bg-white text-black font-black px-12 py-5 rounded-2xl transition-all flex items-center justify-center gap-4 group shadow-[0_20px_50px_rgba(212,175,55,0.3)] disabled:opacity-70"
          >
            {loading || uploading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span className="uppercase tracking-[0.2em] text-xs">Publishing Property & Assets...</span>
              </>
            ) : (
              <>
                <Save size={24} className="group-hover:scale-110 transition-transform" />
                <span className="uppercase tracking-[0.2em] text-xs">Publish Property Now</span>
              </>
            )}
          </button>
        </div>

        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Property Title</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="e.g. Luxury Beachfront Villa"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Price (₹)</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="e.g. 5.5 Crores"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Property Type</label>
              <select
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer font-bold"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, subType: '' })}
              >
                <option value="">Select Type</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {formData.type && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top duration-500">
                 {categories.find(c => c.name === formData.type)?.subCategories?.length > 0 ? (
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-widest px-1 flex items-center gap-2">
                      <List size={14} />
                      Sub-Division / Category
                    </label>
                    <select
                      className="w-full px-6 py-4 bg-primary/5 dark:bg-primary/10 text-primary font-black rounded-2xl border-2 border-primary/20 focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                      value={formData.subType}
                      onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                    >
                      <option value="">All {formData.type}</option>
                      {categories.find(c => c.name === formData.type)?.subCategories?.map((sub: string) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-primary/60 font-bold px-2 uppercase tracking-tight italic">
                      Select the specific division for this {formData.type.toLowerCase()}
                    </p>
                   </div>
                 ) : (
                   <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                     <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-center">
                       No sub-divisions defined for {formData.type}
                     </p>
                   </div>
                 )}
              </div>
            )}

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Sliders size={14} className="text-primary" />
                Content Alignment
              </label>
              <div className="flex gap-2 p-1 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => setFormData((prev: any) => ({ ...prev, alignment: align }))}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      formData.alignment === align 
                        ? 'bg-primary text-black dark:text-white shadow-lg' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 font-medium px-2 italic">
                Choose how text and headings align on the property details page.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Location</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="e.g. Miami, Florida"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Beds</label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Baths</label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Area (sqft)</label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="2,500"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <input
              type="checkbox"
              id="featured"
              className="w-5 h-5 accent-primary cursor-pointer"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-sm font-bold text-primary cursor-pointer uppercase tracking-widest">Mark as Featured Property</label>
          </div>
        </div>

        {/* Media & Description */}
        <div className="space-y-10">
          {/* Images */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Property Images</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {formData.images.map((img: string, i: number) => (
                <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden border-2 group transition-all ${i === 0 ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-gray-100 dark:border-gray-800'}`}>
                  {img && <Image src={img} alt="Property" fill className="object-cover" unoptimized={img.startsWith('blob:')} />}
                  
                  {/* Badge for Title Image */}
                  {i === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-black px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest z-10">
                      Title Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => setAsMainImage(img)}
                        className="bg-primary text-black p-2 rounded-xl hover:scale-110 transition-transform"
                        title="Set as Title Image"
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="bg-red-500 text-black p-2 rounded-xl hover:scale-110 transition-transform"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <FileDropzone
                onFilesSelected={handleFileUpload}
                uploading={uploading}
                multiple
                accept="image/*"
                className="aspect-square"
              >
                <div className="h-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                    <Plus size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-center px-2">
                    Add Property Photos
                  </span>
                </div>
              </FileDropzone>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} className="text-primary" />
              Tip: The first image will be used as the property's title/cover photo.
            </p>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Description</h3>
              <button
                type="button"
                onClick={handleSmartParse}
                disabled={!formData.description.trim()}
                className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary hover:text-black transition-all disabled:opacity-50"
              >
                <Sparkles size={14} />
                <span>Smart Parse into Sections</span>
              </button>
            </div>
            <textarea
              required
              rows={8}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="Write a detailed description of the property..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* Structured Details */}
          <div id="details-section" className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Structured Property Details</h3>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, details: [...formData.details, { heading: '', content: '', sideHeading: '', showArrow: false, isPointed: false, alignment: 'left' }] })}
                  className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-all"
                >
                  <Plus size={14} />
                  <span>Manual Add</span>
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Add extra side headings, arrow marks, and bullet points (dots) for complex property info.</p>

            <div className="space-y-8">
              {formData.details.map((detail: any, idx: number) => (
                <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 relative space-y-4">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 mr-4">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const newDetails = [...formData.details];
                          [newDetails[idx], newDetails[idx - 1]] = [newDetails[idx - 1], newDetails[idx]];
                          setFormData({ ...formData, details: newDetails });
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.details.length - 1}
                        onClick={() => {
                          const newDetails = [...formData.details];
                          [newDetails[idx], newDetails[idx + 1]] = [newDetails[idx + 1], newDetails[idx]];
                          setFormData({ ...formData, details: newDetails });
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-30"
                      >
                         <ChevronDown size={16} />
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, details: formData.details.filter((_: any, i: number) => i !== idx) })}
                      className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 px-1">Section Heading</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-sm"
                        placeholder="e.g. Location Advantages"
                        value={detail.heading}
                        onChange={(e) => {
                          const newDetails = [...formData.details];
                          newDetails[idx] = { ...newDetails[idx], heading: e.target.value };
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 px-1">Side Heading (Optional)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-sm"
                        placeholder="e.g. Prime Location"
                        value={detail.sideHeading}
                        onChange={(e) => {
                          const newDetails = [...formData.details];
                          newDetails[idx] = { ...newDetails[idx], sideHeading: e.target.value };
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 px-1">Content</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                      placeholder="Write the section content here... (New lines will be used for dots if 'Use Dots' is enabled)"
                      value={detail.content}
                      onChange={(e) => {
                        const newDetails = [...formData.details];
                        newDetails[idx] = { ...newDetails[idx], content: e.target.value };
                        setFormData({ ...formData, details: newDetails });
                      }}
                    ></textarea>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary"
                        checked={detail.showArrow}
                        onChange={(e) => {
                          const newDetails = [...formData.details];
                          newDetails[idx] = { ...newDetails[idx], showArrow: e.target.checked };
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Show Arrow (→)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-primary"
                        checked={detail.isPointed}
                        onChange={(e) => {
                          const newDetails = [...formData.details];
                          newDetails[idx] = { ...newDetails[idx], isPointed: e.target.checked };
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Use Dots for Points</span>
                    </label>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-700 ml-auto">
                      {['left', 'center', 'right'].map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => {
                            const newDetails = formData.details.map((d: any, i: number) => 
                              i === idx ? { ...d, alignment: align } : d
                            );
                            setFormData({ ...formData, details: newDetails });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                            detail.alignment === align 
                              ? 'bg-primary text-black dark:text-white shadow-sm' 
                              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {formData.details.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">No structured details added yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* 3D Model Details */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3D Model (GLB/GLTF)</h3>
            <p className="text-sm text-gray-500 mb-6">Upload a 3D model that will scroll through the page. Supports .glb or .gltf files.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1 mb-2 block">3D Model File</label>
                {formData.threeDElement ? (
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="bg-primary text-black p-3 rounded-xl">
                      <Save size={20} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{formData.threeDElement?.split('/').pop() || '3D Model'}</p>
                      <p className="text-xs text-gray-500">3D Model Loaded</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeThreeD}
                      className="bg-red-500 text-black dark:text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FileDropzone
                      onFilesSelected={handleThreeDUpload}
                      uploading={uploading}
                      accept=".glb,.gltf"
                    >
                      <div className="w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                          {uploading ? 'Uploading...' : 'Upload GLB/GLTF Model'}
                        </span>
                      </div>
                    </FileDropzone>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Farm/Fruit Details */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Farm/Fruit Details (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">If this is a farm land with active cultivation, you can add a picture of the fruit/crop and some details. Users can click the image to view the details in a popup.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1 mb-2 block">Crop/Fruit Image</label>
                {formData.fruitImage ? (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 group">
                    {formData.fruitImage && <Image src={formData.fruitImage} alt="Fruit" fill className="object-cover" />}
                    <button
                      type="button"
                      onClick={removeFruitImage}
                      className="absolute top-2 right-2 bg-red-500 text-black dark:text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FileDropzone
                      onFilesSelected={handleFruitUpload}
                      uploading={uploading}
                      accept="image/*"
                      className="w-32 h-32"
                    >
                      <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Add Image</span>
                      </div>
                    </FileDropzone>
                  </>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1 mb-2 block">Crop/Fruit Info</label>
                <textarea
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="E.g., Farm land where dragon fruit cultivation is actively done..."
                  value={formData.fruitInfo || ''}
                  onChange={(e) => setFormData({ ...formData, fruitInfo: e.target.value })}
                ></textarea>
              </div>

              {/* Structured Plantation Details */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-black uppercase tracking-widest text-primary">Structured Plantation Info</label>
                   <button
                     type="button"
                     onClick={() => setFormData({ ...formData, fruitDetails: [...(formData.fruitDetails || []), { heading: '', content: '', showArrow: false, isPointed: false }] })}
                     className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                   >
                     <Plus size={14} /> Add Point
                   </button>
                </div>

                <div className="space-y-4">
                   {formData.fruitDetails?.map((detail: any, idx: number) => (
                     <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 relative group">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, fruitDetails: formData.fruitDetails.filter((_: any, i: number) => i !== idx) })}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input
                             type="text"
                             placeholder="Heading (e.g. Yield Duration)"
                             className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-bold"
                             value={detail.heading}
                             onChange={(e) => {
                               const newDetails = [...formData.fruitDetails];
                               newDetails[idx].heading = e.target.value;
                               setFormData({ ...formData, fruitDetails: newDetails });
                             }}
                           />
                           <div className="flex gap-4 items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={detail.showArrow}
                                  onChange={(e) => {
                                    const newDetails = [...formData.fruitDetails];
                                    newDetails[idx].showArrow = e.target.checked;
                                    setFormData({ ...formData, fruitDetails: newDetails });
                                  }}
                                  className="w-3 h-3 accent-primary"
                                />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Arrow</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={detail.isPointed}
                                  onChange={(e) => {
                                    const newDetails = [...formData.fruitDetails];
                                    newDetails[idx].isPointed = e.target.checked;
                                    setFormData({ ...formData, fruitDetails: newDetails });
                                  }}
                                  className="w-3 h-3 accent-primary"
                                />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Dots</span>
                              </label>
                           </div>
                        </div>
                        <textarea
                          placeholder="Content... (New lines for dots if enabled)"
                          rows={2}
                          className="w-full mt-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-medium resize-none"
                          value={detail.content}
                          onChange={(e) => {
                            const newDetails = [...formData.fruitDetails];
                            newDetails[idx].content = e.target.value;
                            setFormData({ ...formData, fruitDetails: newDetails });
                          }}
                        />
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
          {/* Land Photos Section */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Land Photos (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">Specific gallery for land or plot images.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {formData.landPhotos?.map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 group">
                  {img && <Image src={img} alt="Land Photo" fill className="object-cover" />}
                  <button
                    type="button"
                    onClick={() => removeLandPhoto(img)}
                    className="absolute top-2 right-2 bg-red-500 text-black dark:text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <FileDropzone
                onFilesSelected={handleLandPhotosUpload}
                uploading={uploading}
                multiple
                accept="image/*"
                className="aspect-square"
              >
                <div className="h-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  </div>
                </div>
              </FileDropzone>
            </div>
          </div>

          {/* Land Video Section */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Land Video (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">Upload a video directly or provide a YouTube link.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">YouTube Video URL</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl?.includes('youtube') ? formData.videoUrl : ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-gray-100 dark:bg-gray-800"></div>
                <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em]">OR</span>
                <div className="h-px flex-grow bg-gray-100 dark:bg-gray-800"></div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Direct Video Upload</label>
                {formData.videoUrl && !formData.videoUrl.includes('youtube') ? (
                  <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="bg-primary text-black p-3 rounded-xl">
                      <Play size={20} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{formData.videoUrl?.split('/').pop() || 'Video File'}</p>
                      <p className="text-xs text-gray-500">Video Uploaded</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="bg-red-500 text-black dark:text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FileDropzone
                      onFilesSelected={handleVideoUpload}
                      uploading={uploading}
                      accept="video/*"
                    >
                      <div className="w-full py-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                          {uploading ? 'Uploading...' : 'Upload Video File'}
                        </span>
                      </div>
                    </FileDropzone>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Plot Layout Section - Trigger Button */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Interactive Plot Layout</h3>
                <p className="text-sm text-gray-500">Manage plot dimensions, availability, and positions.</p>
              </div>
              {formData.layoutImage && (
                <button
                  type="button"
                  onClick={() => {
                    if (initialData?._id) {
                      window.open(`/admin/properties/edit/${initialData._id}/plots`, '_blank');
                    } else {
                      alert('Please save the property first to manage plots.');
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  <Maximize2 size={16} /> Launch Unit Inventory Manager
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {formData.layoutImage ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 group">
                  {formData.layoutImage && <Image src={formData.layoutImage} alt="Layout Thumbnail" fill className="object-contain opacity-50" />}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (initialData?._id) {
                          window.open(`/admin/properties/edit/${initialData._id}/plots`, '_blank');
                        } else {
                          alert('Please save the property first to manage plots.');
                        }
                      }}
                      className="bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-black/10 dark:border-white/10"
                    >
                      <Settings size={32} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, layoutImage: '', plots: [] })}
                    className="absolute top-4 right-4 bg-red-500 text-black dark:text-white p-2 rounded-xl hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <FileDropzone
                    onFilesSelected={handleLayoutImageUpload}
                    uploading={uploading}
                    accept="image/*"
                  >
                    <div className="w-full py-16 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group">
                      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                        {uploading ? <Loader2 size={32} className="animate-spin" /> : <Plus size={32} />}
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">Upload Layout Map</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center">Required for interactive mapping</span>
                      </div>
                    </div>
                  </FileDropzone>
                </>
              )}
            </div>
          </div>
          {/* Land Brochure Section */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Land Brochure (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">Upload multiple PDF or image brochures for the land.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.landBrochure?.map((item: string, i: number) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 group bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4">
                    {item.endsWith('.pdf') ? (
                      <div className="text-center">
                         <Save size={24} className="mx-auto mb-2 text-primary" />
                         <p className="text-[10px] font-bold truncate max-w-[100px]">{item.split('/').pop()}</p>
                      </div>
                    ) : (
                      <Image src={item} alt={`Brochure ${i+1}`} fill className="object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeBrochure(item)}
                      className="absolute top-2 right-2 bg-red-500 text-black dark:text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <FileDropzone
                  onFilesSelected={handleBrochureUpload}
                  uploading={uploading}
                  multiple
                  accept=".pdf,image/*"
                  className="aspect-video"
                >
                  <div className="h-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                      {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Add More</span>
                  </div>
                </FileDropzone>
              </div>
            </div>
          </div>

          {/* Map View Section */}
          <div className="bg-white dark:bg-gray-900/50 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location Map (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">Add a Google Maps embed URL.</p>
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Google Maps Embed URL</label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              />
              <p className="text-[10px] text-gray-600 dark:text-gray-400 px-1 mt-1">Go to Google Maps → Share → Embed a map → Copy the 'src' URL from the iframe tag.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || formData.images.length === 0}
          className="px-10 py-4 bg-primary hover:bg-primary-dark text-black dark:text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          <span>{initialData ? 'Update Property' : 'Publish Property'}</span>
        </button>
      </div>
    </form>

    <SmartContentEditor 
      isOpen={showSmartEditor}
      onClose={() => setShowSmartEditor(false)}
      onSave={handleSmartSave}
      initialSections={formData.details.map((d: any, i: number) => ({
        id: `initial-${i}`,
        heading: d.heading,
        sideHeading: d.sideHeading,
        content: d.content,
        showArrow: d.showArrow,
        isPointed: d.isPointed,
        alignment: d.alignment,
        type: 'heading'
      }))}
    />
  </>
  );
};

export default PropertyForm;
