'use client';

import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X, Plus, Save, Loader2, ChevronUp, ChevronDown, Play } from 'lucide-react';
import Image from 'next/image';

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
    fruitImage: initialData?.fruitImage || '',
    fruitInfo: initialData?.fruitInfo || '',
    landPhotos: initialData?.landPhotos || [],
    threeDElement: initialData?.threeDElement || '',
    videoUrl: initialData?.videoUrl || '',
    mapUrl: initialData?.mapUrl || '',
    landBrochure: initialData?.landBrochure || [],
    details: initialData?.details || []
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingFruit, setUploadingFruit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const landPhotosInputRef = useRef<HTMLInputElement>(null);
  const fruitInputRef = useRef<HTMLInputElement>(null);
  const threeDInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev: any) => ({ ...prev, videoUrl: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
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
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
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
