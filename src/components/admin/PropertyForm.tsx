'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, X, Plus, Save, Loader2, ChevronUp, ChevronDown, Play, Target, Hash, Settings, Trash, Sliders, Maximize2, ChevronLeft, Zap, List } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(initialData || {
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
    layoutImage: '',
    plots: initialData?.plots?.map((p: any, i: number) => ({
      ...p,
      x: p.x ?? 0,
      y: p.y ?? 0,
      width: p.width ?? 5,
      height: p.height ?? 3
    })) || []
  });

  // Sync state with initialData when it updates (e.g. after save)
  React.useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({
        ...prev,
        ...initialData,
        // Ensure arrays are handled correctly
        landPhotos: initialData.landPhotos || [],
        landBrochure: initialData.landBrochure || [],
        details: initialData.details || [],
        plots: initialData.plots?.map((p: any, i: number) => ({
          ...p,
          x: p.x ?? 0,
          y: p.y ?? 0,
          width: p.width ?? 5,
          height: p.height ?? 3
        })) || []
      }));
    }
  }, [initialData]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>(['House', 'Apartment', 'Plot', 'Land', 'Commercial']);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.propertyCategories) {
          setCategories(data.data.propertyCategories.map((c: any) => c.name));
        }
      });
  }, []);
  const [uploadingFruit, setUploadingFruit] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [mappingPlot, setMappingPlot] = useState<{ x: number, y: number } | null>(null);
  const [editingPlotIndex, setEditingPlotIndex] = useState<number | null>(null);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [newPlotNumber, setNewPlotNumber] = useState('');
  const [newPlotStatus, setNewPlotStatus] = useState<'available' | 'booked' | 'sold'>('available');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const landPhotosInputRef = useRef<HTMLInputElement>(null);
  const fruitInputRef = useRef<HTMLInputElement>(null);
  const threeDInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const layoutImageInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const draggingPlotRef = useRef<{ idx: number; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleFruitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFruit(true);
    try {
      const file = files[0];
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev: any) => ({ ...prev, fruitImage: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingFruit(false);
      if (fruitInputRef.current) fruitInputRef.current.value = '';
    }
  };

  const removeFruitImage = () => {
    setFormData((prev: any) => ({ ...prev, fruitImage: '' }));
  };

  const handleThreeDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev: any) => ({ ...prev, threeDElement: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (threeDInputRef.current) threeDInputRef.current.value = '';
    }
  };

  const removeThreeD = () => {
    setFormData((prev: any) => ({ ...prev, threeDElement: '' }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...formData.images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          newImages.push(data.url);
        }
      }

      setFormData((prev: any) => ({
        ...prev,
        images: newImages
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLandPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...formData.landPhotos];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          newImages.push(data.url);
        }
      }

      setFormData((prev: any) => ({
        ...prev,
        landPhotos: newImages
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (landPhotosInputRef.current) landPhotosInputRef.current.value = '';
    }
  };

  const removeLandPhoto = (url: string) => {
    setFormData((prev: any) => ({
      ...prev,
      landPhotos: prev.landPhotos.filter((img: string) => img !== url)
    }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      
      // 1. Get signature from our API
      const sigResponse = await fetch('/api/upload/signature');
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
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleLayoutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev: any) => ({ ...prev, layoutImage: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const addPlot = () => {
    setFormData((prev: any) => ({
      ...prev,
      plots: [...(prev.plots || []), { number: '', status: 'available' }]
    }));
  };

  const removePlot = (index: number) => {
    setFormData((prev: any) => {
      const updated = (prev.plots || []).filter((_: any, i: number) => i !== index);
      return { ...prev, plots: updated };
    });
    setEditingPlotIndex(null);
    setSelectedPlotIndex(null);
  };

  const handlePlotPointerDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    // Don't drag if clicking input or buttons
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON') return;
    e.preventDefault();
    e.stopPropagation();
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const plot = formData.plots[idx];
    draggingPlotRef.current = {
      idx,
      startX: e.clientX,
      startY: e.clientY,
      origX: plot.x,
      origY: plot.y,
    };
    setSelectedPlotIndex(idx);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePlotPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingPlotRef.current) return;
    e.preventDefault();
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const { idx, startX, startY, origX, origY } = draggingPlotRef.current;
    const dx = ((e.clientX - startX) / rect.width) * 100;
    const dy = ((e.clientY - startY) / rect.height) * 100;
    const newX = Math.max(0, Math.min(100, origX + dx));
    const newY = Math.max(0, Math.min(100, origY + dy));
    setFormData((prev: any) => {
      const newPlots = [...(prev.plots || [])];
      if (newPlots[idx]) {
        newPlots[idx] = { ...newPlots[idx], x: newX, y: newY };
      }
      return { ...prev, plots: newPlots };
    });
  };

  const handlePlotPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingPlotRef.current = null;
  };



  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent clicking on existing markers from triggering a new plot creation
    if ((e.target as HTMLElement).closest('.plot-marker')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Use Quick Add values if admin has typed a plot number, otherwise auto-name
    const hasQuickAdd = newPlotNumber.trim().length > 0;
    const newPlot = {
      number: hasQuickAdd ? newPlotNumber.trim() : `Plot ${(formData.plots?.length || 0) + 1}`,
      status: hasQuickAdd ? newPlotStatus : 'available',
      x,
      y,
      width: 5,
      height: 3
    };

    const newPlots = [...(formData.plots || []), newPlot];
    setFormData((prev: any) => ({
      ...prev,
      plots: newPlots
    }));

    // Clear quick-add input after placing so next click auto-names
    if (hasQuickAdd) setNewPlotNumber('');

    const newIndex = newPlots.length - 1;
    setSelectedPlotIndex(newIndex);
    // Only open configure modal if NOT using quick-add (quick-add already knows number & status)
    if (!hasQuickAdd) setEditingPlotIndex(newIndex);
  };

  const updatePlotField = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const newPlots = [...(prev.plots || [])];
      if (newPlots[index]) {
        newPlots[index] = { ...newPlots[index], [field]: value };
      }
      return { ...prev, plots: newPlots };
    });
  };

  const removeVideo = () => {
    setFormData((prev: any) => ({ ...prev, videoUrl: '' }));
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newBrochures = [...formData.landBrochure];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          newBrochures.push(data.url);
        }
      }

      setFormData((prev: any) => ({
        ...prev,
        landBrochure: newBrochures
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (brochureInputRef.current) brochureInputRef.current.value = '';
    }
  };

  const removeBrochure = (url: string) => {
    setFormData((prev: any) => ({
      ...prev,
      landBrochure: prev.landBrochure.filter((item: string) => item !== url)
    }));
  };

  const removeImage = (url: string) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
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
                type="number"
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1">Property Type</label>
              <select
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Property Images</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {formData.images.map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 group">
                  <Image src={img} alt="Property" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
              >
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {uploading ? 'Uploading...' : 'Add Image'}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-400 font-medium">* Images are securely hosted on Cloudinary.</p>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
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
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Structured Property Details</h3>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, details: [...formData.details, { heading: '', content: '', sideHeading: '', showArrow: false, isPointed: false }] })}
                className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
              >
                <Plus size={16} />
                <span>Add Section</span>
              </button>
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
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Section Heading</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-sm"
                        placeholder="e.g. Location Advantages"
                        value={detail.heading}
                        onChange={(e) => {
                          const newDetails = [...formData.details];
                          newDetails[idx].heading = e.target.value;
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Side Heading (Optional)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-sm"
                        placeholder="e.g. Prime Location"
                        value={detail.sideHeading}
                        onChange={(e) => {
                          const newDetails = [...formData.details];
                          newDetails[idx].sideHeading = e.target.value;
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Content</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                      placeholder="Write the section content here... (New lines will be used for dots if 'Use Dots' is enabled)"
                      value={detail.content}
                      onChange={(e) => {
                        const newDetails = [...formData.details];
                        newDetails[idx].content = e.target.value;
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
                          newDetails[idx].showArrow = e.target.checked;
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
                          newDetails[idx].isPointed = e.target.checked;
                          setFormData({ ...formData, details: newDetails });
                        }}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Use Dots for Points</span>
                    </label>
                  </div>
                </div>
              ))}

              {formData.details.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                  <p className="text-gray-400 text-sm font-medium">No structured details added yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* 3D Model Details */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
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
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{formData.threeDElement.split('/').pop()}</p>
                      <p className="text-xs text-gray-500">3D Model Loaded</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeThreeD}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      ref={threeDInputRef}
                      onChange={handleThreeDUpload}
                    />
                    <button
                      type="button"
                      onClick={() => threeDInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                        {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {uploading ? 'Uploading...' : 'Upload GLB/GLTF Model'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Farm/Fruit Details */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Farm/Fruit Details (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">If this is a farm land with active cultivation, you can add a picture of the fruit/crop and some details. Users can click the image to view the details in a popup.</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest px-1 mb-2 block">Crop/Fruit Image</label>
                {formData.fruitImage ? (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 group">
                    <Image src={formData.fruitImage} alt="Fruit" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={removeFruitImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fruitInputRef}
                      onChange={handleFruitUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fruitInputRef.current?.click()}
                      disabled={uploadingFruit}
                      className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                        {uploadingFruit ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add Image</span>
                    </button>
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
            </div>
          </div>
          {/* Land Photos Section */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Land Photos (Optional)</h3>
            <p className="text-sm text-gray-500 mb-6">Specific gallery for land or plot images.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {formData.landPhotos?.map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 group">
                  <Image src={img} alt="Land Photo" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeLandPhoto(img)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={landPhotosInputRef}
                onChange={handleLandPhotosUpload}
              />
              
              <button
                type="button"
                onClick={() => landPhotosInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
              >
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                </div>
              </button>
            </div>
          </div>

          {/* Land Video Section */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
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
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">OR</span>
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
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{formData.videoUrl.split('/').pop()}</p>
                      <p className="text-xs text-gray-500">Video Uploaded</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={videoInputRef}
                      onChange={handleVideoUpload}
                    />
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                        {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {uploading ? 'Uploading...' : 'Upload Video File'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Plot Layout Section - Trigger Button */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Interactive Plot Layout</h3>
                <p className="text-sm text-gray-500">Manage plot dimensions, availability, and positions.</p>
              </div>
              {formData.layoutImage && (
                <button
                  type="button"
                  onClick={() => setShowLayoutEditor(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  <Maximize2 size={16} /> Launch Editor
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {formData.layoutImage ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 group">
                  <Image src={formData.layoutImage} alt="Layout Thumbnail" fill className="object-contain opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setShowLayoutEditor(true)}
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-white/10"
                    >
                      <Settings size={32} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, layoutImage: '', plots: [] })}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={layoutImageInputRef}
                    onChange={handleLayoutImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => layoutImageInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-16 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                  >
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl group-hover:bg-primary group-hover:text-white transition-all">
                      {uploading ? <Loader2 size={32} className="animate-spin" /> : <Plus size={32} />}
                    </div>
                    <div className="text-center">
                      <span className="block text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">Upload Layout Map</span>
                      <span className="text-xs text-gray-400 font-medium text-center">Required for interactive mapping</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Full-Screen Layout Editor Modal */}
          <AnimatePresence>
            {showLayoutEditor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[150] flex flex-col"
              >
                {/* Header */}
                <div className="px-10 py-6 border-b border-white/10 flex items-center justify-between bg-black/50">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setShowLayoutEditor(false)}
                      className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">Spatial Layout Editor</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">Property Media Suite Configuration</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Active Editor Mode</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowLayoutEditor(false)}
                      className="px-10 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Save & Exit
                    </button>
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex-grow flex gap-10 p-10 overflow-hidden">
                  <div className="flex-grow flex flex-col gap-10 overflow-hidden">
                    {/* Map Canvas */}
                    <div className="flex-grow bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center group">
                      <div 
                        ref={imageContainerRef}
                        className={`relative max-w-full max-h-full ${newPlotNumber.trim() ? 'cursor-cell' : 'cursor-crosshair'}`}
                        onClick={handleImageClick}
                      >
                        <Image 
                          src={formData.layoutImage} 
                          alt="Layout Map" 
                          width={4000} 
                          height={3000} 
                          className="w-auto h-auto max-w-full max-h-[75vh] select-none object-contain rounded-2xl" 
                        />
                        
                        {/* Plot Markers — pointer-event drag */}
                        {formData.plots?.filter((p: any) => p.x > 0 && p.y > 0).map((plot: any, idx: number) => {
                          const originalIdx = formData.plots.indexOf(plot);
                          return (
                            <div
                              key={originalIdx}
                              onPointerDown={(e) => handlePlotPointerDown(e, originalIdx)}
                              onPointerMove={handlePlotPointerMove}
                              onPointerUp={handlePlotPointerUp}
                              onPointerCancel={handlePlotPointerUp}
                              onClick={(e) => { e.stopPropagation(); setSelectedPlotIndex(originalIdx); }}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && document.activeElement === e.currentTarget) {
                                  e.preventDefault();
                                  removePlot(originalIdx);
                                }
                              }}
                              style={{
                                position: 'absolute',
                                left: `${plot.x}%`,
                                top: `${plot.y}%`,
                                width: `${plot.width || 5}%`,
                                height: `${plot.height || 3}%`,
                                transform: 'translate(-50%, -50%)',
                                touchAction: 'none',
                                userSelect: 'none',
                              }}
                              className={`plot-marker rounded-md border shadow-2xl flex items-center justify-center text-[10px] font-black cursor-move z-30 group/marker focus:outline-none ${
                                selectedPlotIndex === originalIdx ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''
                              } ${
                                plot.status === 'sold'   ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)]' :
                                plot.status === 'booked' ? 'bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
                                                           'bg-white text-black border-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                              }`}
                            >
                              <input
                                type="text"
                                value={plot.number}
                                onChange={(e) => updatePlotField(originalIdx, 'number', e.target.value)}
                                className="w-full bg-transparent border-none text-center focus:ring-0 p-0 font-black cursor-text"
                                onClick={(e) => e.stopPropagation()}
                              />
                              {/* Hover toolbar */}
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-full p-1.5 flex items-center gap-2 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-auto z-[60] shadow-2xl">
                                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updatePlotField(originalIdx, 'status', 'available'); }} className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === 'available' ? 'bg-white scale-110' : 'bg-white/20'}`} />
                                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updatePlotField(originalIdx, 'status', 'booked');    }} className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === 'booked'    ? 'bg-green-500 scale-110' : 'bg-green-500/20'}`} />
                                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updatePlotField(originalIdx, 'status', 'sold');      }} className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === 'sold'      ? 'bg-yellow-400 scale-110'    : 'bg-yellow-400/20'}`} />
                                <div className="w-px h-3 bg-white/20 mx-1" />
                                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setEditingPlotIndex(originalIdx); }} className="text-gray-400 hover:text-white transition-colors"><Settings size={12} /></button>
                                <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removePlot(originalIdx); }} className="text-red-500 hover:text-red-400 transition-colors ml-2 p-1 hover:bg-red-500/10 rounded-lg"><Trash size={16} /></button>
                              </div>
                            </div>
                          );
                        })}

                        {/* Canvas hint — changes based on Quick Add state */}
                        <div className="absolute inset-0 pointer-events-none flex items-end justify-center z-10 pb-4">
                          {newPlotNumber.trim() ? (
                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-pulse ${
                              newPlotStatus === 'sold'   ? 'bg-yellow-400 text-black'
                              : newPlotStatus === 'booked' ? 'bg-green-500 text-white'
                              :                              'bg-white text-black'
                            }`}>
                              <span>Click to place "{newPlotNumber}"</span>
                            </div>
                          ) : (!formData.plots || formData.plots.length === 0) ? (
                            <div className="flex flex-col items-center gap-2">
                              <Target size={36} className="text-primary animate-pulse" />
                              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Click to add plot</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Unpositioned Plots Tray */}
                    <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 shadow-2xl mt-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Target size={16} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Unpositioned Inventory</h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Drag these markers onto the layout map above</p>
                        </div>
                        <div className="ml-auto bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{formData.plots?.filter((p: any) => !p.x || !p.y || (p.x === 0 && p.y === 0)).length} Pending</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {formData.plots?.filter((p: any) => !p.x || !p.y || (p.x === 0 && p.y === 0)).map((plot: any, idx: number) => {
                          const originalIdx = formData.plots.indexOf(plot);
                          return (
                            <div 
                              key={originalIdx}
                              onPointerDown={(e) => handlePlotPointerDown(e, originalIdx)}
                              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-move transition-all border group flex items-center gap-3 ${
                                plot.status === 'sold' ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-black' :
                                plot.status === 'booked' ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' :
                                'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                plot.status === 'sold' ? 'bg-yellow-400' :
                                plot.status === 'booked' ? 'bg-green-500' :
                                'bg-white'
                              } group-hover:scale-150 transition-transform`}></div>
                              {plot.number || `Plot ${originalIdx + 1}`}
                            </div>
                          );
                        })}
                        {formData.plots?.filter((p: any) => !p.x || !p.y || (p.x === 0 && p.y === 0)).length === 0 && (
                          <div className="w-full py-10 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-2 opacity-30">
                            <Zap size={24} />
                            <p className="text-[10px] font-black uppercase tracking-widest">All plots are surgically positioned</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar: Quick Add + Live Plot List */}
                  <div className="w-[320px] flex flex-col gap-4 overflow-hidden">

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500">Total</span>
                        <span className="text-xl font-black text-white">{formData.plots?.length || 0}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-white/50">Avail</span>
                        <span className="text-xl font-black text-white">{formData.plots?.filter((p: any) => p.status === 'available' || p.status === 'unsold').length || 0}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/10 text-center">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-yellow-400">Sold</span>
                        <span className="text-xl font-black text-yellow-400">{formData.plots?.filter((p: any) => p.status === 'sold').length || 0}</span>
                      </div>
                    </div>

                    {/* Quick Add Panel */}
                    <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Quick Add Plot</h3>
                      </div>

                      {/* Plot Number Input — color preview updates as you type */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Plot Number e.g. A-101"
                          value={newPlotNumber}
                          onChange={(e) => setNewPlotNumber(e.target.value)}
                          className="w-full bg-black/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm font-bold border border-white/10 focus:border-primary/60 focus:ring-0 focus:outline-none transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setNewPlotNumber('');
                          }}
                        />
                        {/* Live color preview */}
                        {newPlotNumber.trim() && (
                          <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md border border-white/20 ${
                            newPlotStatus === 'sold' ? 'bg-yellow-400' : newPlotStatus === 'booked' ? 'bg-green-500' : 'bg-white'
                          }`} />
                        )}
                      </div>

                      {/* Status Picker — instantly changes what color will be used */}
                      <div className="flex gap-2">
                        {(['available', 'booked', 'sold'] as const).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewPlotStatus(s)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                              newPlotStatus === s
                                ? s === 'sold'   ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                                : s === 'booked' ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20'
                                :                  'bg-white text-black border-gray-200 shadow-lg shadow-white/20'
                                : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      {/* "Now click on map" instruction — appears when plot number is typed */}
                      {newPlotNumber.trim() ? (
                        <div className={`w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-pulse border-2 border-dashed ${
                          newPlotStatus === 'sold'   ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                          : newPlotStatus === 'booked' ? 'border-green-500 text-green-400 bg-green-500/10'
                          :                              'border-white text-white bg-white/10'
                        }`}>
                          ↓ Now click the plot on the map
                        </div>
                      ) : (
                        <div className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center text-gray-600 bg-white/3 border border-white/5">
                          Type a number → click on map
                        </div>
                      )}

                      <p className="text-[9px] text-gray-600 text-center">Drag markers on map to reposition • ESC to cancel</p>
                    </div>

                    {/* Live Plot List — change status → color changes instantly on map */}
                    <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-5 space-y-3 flex-grow overflow-hidden flex flex-col">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <List size={14} className="text-gray-400" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Plot List</h3>
                        <span className="ml-auto text-[9px] text-gray-500">{formData.plots?.length || 0} plots</span>
                      </div>
                      <div className="overflow-y-auto space-y-2 flex-grow pr-1" style={{ maxHeight: '280px' }}>
                        {(!formData.plots || formData.plots.length === 0) && (
                          <p className="text-[10px] text-gray-600 text-center py-4">No plots yet. Click map or use Quick Add.</p>
                        )}
                        {formData.plots?.map((plot: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedPlotIndex(idx)}
                            className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border ${
                              selectedPlotIndex === idx ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/3 hover:bg-white/8'
                            }`}
                          >
                            {/* Color dot — instantly reflects status */}
                            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${
                              plot.status === 'sold' ? 'bg-yellow-400' : plot.status === 'booked' ? 'bg-green-500' : 'bg-white'
                            }`} />

                            {/* Editable plot number — as you type, marker on map updates live */}
                            <input
                              type="text"
                              value={plot.number}
                              onChange={(e) => updatePlotField(idx, 'number', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-transparent text-white text-[10px] font-bold flex-grow border-none focus:ring-0 p-0 min-w-0"
                              placeholder="Plot #"
                            />

                            {/* Status cycle button — click to cycle Available → Booked → Sold → Available */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = plot.status === 'available' ? 'booked' : plot.status === 'booked' ? 'sold' : 'available';
                                updatePlotField(idx, 'status', next);
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                                plot.status === 'sold'   ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                                : plot.status === 'booked' ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'
                                :                            'bg-white/20 text-white hover:bg-white hover:text-black'
                              }`}
                              title="Click to cycle status"
                            >
                              {plot.status === 'available' ? 'Avail' : plot.status === 'booked' ? 'Booked' : 'Sold'}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removePlot(idx); }}
                              className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0 p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Modal: Advanced Individual Configuration */}
                <AnimatePresence>
                  {editingPlotIndex !== null && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-6"
                    >
                      <motion.div 
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl space-y-10 border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Configure Plot</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Spatial & Availability Settings</p>
                          </div>
                          <button 
                            onClick={() => setEditingPlotIndex(null)}
                            className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                          >
                            <X size={24} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Plot Identity</label>
                              <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                  type="text"
                                  value={formData.plots[editingPlotIndex].number}
                                  onChange={(e) => updatePlotField(editingPlotIndex, 'number', e.target.value)}
                                  className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 font-black text-lg"
                                  placeholder="Plot #"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Market Status</label>
                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => updatePlotField(editingPlotIndex, 'status', 'available')}
                                  className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                                    formData.plots[editingPlotIndex].status === 'available' || formData.plots[editingPlotIndex].status === 'unsold'
                                    ? 'bg-white text-black border-gray-200 shadow-xl shadow-white/20' 
                                    : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'
                                  }`}
                                >
                                  Available
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updatePlotField(editingPlotIndex, 'status', 'booked')}
                                  className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                                    formData.plots[editingPlotIndex].status === 'booked' 
                                    ? 'bg-green-500 text-white border-green-500 shadow-xl shadow-green-500/20' 
                                    : 'bg-green-500/5 text-gray-500 border-green-500/10 hover:bg-green-500/10'
                                  }`}
                                >
                                  Booked
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updatePlotField(editingPlotIndex, 'status', 'sold')}
                                  className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${
                                    formData.plots[editingPlotIndex].status === 'sold' 
                                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-xl shadow-yellow-400/20' 
                                    : 'bg-yellow-400/5 text-gray-500 border-yellow-400/10 hover:bg-yellow-400/10'
                                  }`}
                                >
                                  Sold
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-8 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-2">
                              <Sliders size={20} className="text-primary" />
                              <h5 className="text-xs font-black uppercase tracking-widest">Dimension Surgery</h5>
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Width (%)</label>
                                <span className="text-xs font-black text-primary">{formData.plots[editingPlotIndex].width || 5}%</span>
                              </div>
                              <input 
                                type="range" min="1" max="20" step="0.1"
                                value={formData.plots[editingPlotIndex].width || 5}
                                onChange={(e) => updatePlotField(editingPlotIndex, 'width', parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Height (%)</label>
                                <span className="text-xs font-black text-primary">{formData.plots[editingPlotIndex].height || 3}%</span>
                              </div>
                              <input 
                                type="range" min="1" max="20" step="0.1"
                                value={formData.plots[editingPlotIndex].height || 3}
                                onChange={(e) => updatePlotField(editingPlotIndex, 'height', parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                          <button 
                            type="button"
                            onClick={() => {
                              removePlot(editingPlotIndex);
                              setEditingPlotIndex(null);
                            }}
                            className="flex items-center justify-center gap-2 px-8 py-5 bg-red-500/10 text-red-500 font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all group"
                          >
                            <Trash size={18} className="group-hover:scale-110 transition-all" />
                            <span>Delete Plot</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingPlotIndex(null)}
                            className="flex-grow py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            Confirm Changes
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Land Brochure Section */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
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
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <input
                  type="file"
                  accept=".pdf,image/*"
                  multiple
                  className="hidden"
                  ref={brochureInputRef}
                  onChange={handleBrochureUpload}
                />
                <button
                  type="button"
                  onClick={() => brochureInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map View Section */}
          <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
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
              <p className="text-[10px] text-gray-400 px-1 mt-1">Go to Google Maps → Share → Embed a map → Copy the 'src' URL from the iframe tag.</p>
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
          className="px-10 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          <span>{initialData ? 'Update Property' : 'Publish Property'}</span>
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
