'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Home, Building2, Landmark, Warehouse, ShoppingBag, TreePine, MapPin } from 'lucide-react';

const ICON_OPTIONS: Record<string, any> = {
  Home,
  Building2,
  Landmark,
  Warehouse,
  ShoppingBag,
  TreePine,
  MapPin
};

const COLOR_OPTIONS = [
  { name: 'Blue', value: 'bg-blue-50 text-blue-600' },
  { name: 'Emerald', value: 'bg-emerald-50 text-emerald-600' },
  { name: 'Amber', value: 'bg-amber-50 text-amber-600' },
  { name: 'Green', value: 'bg-green-50 text-green-600' },
  { name: 'Indigo', value: 'bg-indigo-50 text-indigo-600' },
  { name: 'Purple', value: 'bg-purple-50 text-purple-600' },
  { name: 'Rose', value: 'bg-rose-50 text-rose-600' },
  { name: 'Cyan', value: 'bg-cyan-50 text-cyan-600' },
];

export default function CategoriesAdmin() {
  const [content, setContent] = useState<any>({
    propertyCategories: []
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

  const handleAdd = () => {
    const newCategory = {
      name: 'New Category',
      icon: 'Home',
      color: 'bg-blue-50 text-blue-600',
      href: '/properties?type=New'
    };
    setContent({
      ...content,
      propertyCategories: [...(content.propertyCategories || []), newCategory]
    });
  };

  const handleRemove = (index: number) => {
    const newCategories = [...content.propertyCategories];
    newCategories.splice(index, 1);
    setContent({ ...content, propertyCategories: newCategories });
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newCategories = [...content.propertyCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    
    // Auto-update href if name changes and it's a simple type link
    if (field === 'name' && newCategories[index].href.startsWith('/properties?type=')) {
        newCategories[index].href = `/properties?type=${value}`;
    }
    
    setContent({ ...content, propertyCategories: newCategories });
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
        alert('Categories saved successfully!');
      }
    } catch (err) {
      alert('Failed to save categories');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tight">Property Categories</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage the categories shown on the homepage and filters.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {content.propertyCategories?.map((cat: any, index: number) => {
          const Icon = ICON_OPTIONS[cat.icon] || Home;
          return (
            <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative group">
              <button 
                onClick={() => handleRemove(index)}
                className="absolute top-6 right-6 bg-red-50 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex gap-8 items-start">
                <div className={`p-6 rounded-2xl shrink-0 ${cat.color}`}>
                  <Icon size={40} />
                </div>
                
                <div className="flex-grow space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Category Name</label>
                    <input 
                      value={cat.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Icon</label>
                      <select 
                        value={cat.icon}
                        onChange={(e) => handleChange(index, 'icon', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl font-bold text-gray-900 dark:text-white"
                      >
                        {Object.keys(ICON_OPTIONS).map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Color Theme</label>
                      <select 
                        value={cat.color}
                        onChange={(e) => handleChange(index, 'color', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl font-bold text-gray-900 dark:text-white"
                      >
                        {COLOR_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-primary">Sub-Divisions (Types)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cat.subCategories?.map((sub: string, sIndex: number) => (
                        <div key={sIndex} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                          {sub}
                          <button 
                            onClick={() => {
                              const newSubs = [...cat.subCategories];
                              newSubs.splice(sIndex, 1);
                              handleChange(index, 'subCategories', newSubs as any);
                            }}
                            className="hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        placeholder="Add sub-type..."
                        className="flex-grow bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-2 rounded-xl text-xs font-medium"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              handleChange(index, 'subCategories', [...(cat.subCategories || []), val] as any);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Filter Link (Href)</label>
                    <input 
                      value={cat.href}
                      onChange={(e) => handleChange(index, 'href', e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl font-medium text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button 
          onClick={handleAdd}
          className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-gray-800 text-gray-300 hover:border-primary/50 hover:text-primary transition-all group"
        >
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full group-hover:bg-primary/10 transition-all mb-4">
             <Plus size={40} />
          </div>
          <span className="font-black uppercase tracking-widest text-sm">Add New Category</span>
        </button>
      </div>
    </div>
  );
}
