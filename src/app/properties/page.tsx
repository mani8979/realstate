'use client';

import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/main/PropertyCard';
import { Search, MapPin, Home, DollarSign, SlidersHorizontal, Star } from 'lucide-react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const PropertiesPage = () => {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    subType: searchParams.get('subType') || '',
    budget: searchParams.get('budget') || '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBudgetSuggestions, setShowBudgetSuggestions] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type') || '';
    const subType = searchParams.get('subType') || '';
    const location = searchParams.get('location') || '';
    const budget = searchParams.get('budget') || '';
    
    // Try to match the type with existing categories
    let matchedType = type;
    if (type && categories.length > 0) {
      const normalizedType = type.toLowerCase().replace(/\s*lands?$/i, '').trim();
      const category = categories.find(c => 
        c.name.toLowerCase() === type.toLowerCase() || 
        c.name.toLowerCase().replace(/\s*lands?$/i, '').trim() === normalizedType ||
        (c.href && c.href.toLowerCase().includes(normalizedType))
      );
      if (category) {
        matchedType = category.name;
      }
    }

    setFilters({
      location: location,
      type: matchedType,
      subType: subType,
      budget: budget,
    });
  }, [searchParams, categories]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.propertyCategories) {
          setCategories(data.data.propertyCategories);
        }
      });
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/properties?${query}`);
      setProperties(res.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]); // Refetch when filters change with debounce

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-black dark:text-white mb-4">Search Properties</h1>
          <p className="text-gray-500">Discover your perfect match from our extensive listings.</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mb-12">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-1">Search Property</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <input
                  type="text"
                  placeholder="Enter property name, location, etc..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all border-none"
                  value={filters.location}
                  onChange={(e) => {
                    setFilters({ ...filters, location: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && properties.length > 0 && filters.location.length > 0 && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-gray-700 z-50 overflow-x-hidden max-h-60 overflow-y-auto overscroll-contain"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {properties.map((p: any) => (
                      <div 
                        key={p._id}
                        onClick={() => {
                          setFilters({ ...filters, location: p.title });
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-primary/10 cursor-pointer flex flex-col border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                      >
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{p.title}</span>
                        <div className="flex items-center justify-between mt-1">
                           <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {p.location}</span>
                           <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                             {p.price.includes('/') ? p.price : `₹${p.price}`}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-1">Property Type</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <select
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all border-none appearance-none cursor-pointer font-bold"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value, subType: '' })}
                >
                  <option value="">All Types</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {filters.type && categories.find(c => c.name === filters.type)?.subCategories?.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-left duration-300">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-1">Sub-Division</label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <select
                    className="w-full pl-11 pr-4 py-3 bg-primary/5 dark:bg-primary/10 text-primary font-bold rounded-xl focus:ring-2 focus:ring-primary/50 transition-all border-2 border-primary/20 appearance-none cursor-pointer"
                    value={filters.subType}
                    onChange={(e) => setFilters({ ...filters, subType: e.target.value })}
                  >
                    <option value="">All Sub-Types</option>
                    {categories.find(c => c.name === filters.type).subCategories.map((sub: string) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-1">Max Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</span>
                <input
                  type="text"
                  placeholder="Budget (e.g. 50L, 1Cr, 5000)..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all border-none"
                  value={filters.budget}
                  onChange={(e) => {
                    setFilters({ ...filters, budget: e.target.value });
                  }}
                />


              </div>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-black dark:text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Search size={18} />
              <span>Apply Filters</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-[400px] rounded-3xl"></div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom duration-500">
            {properties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem]">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600 dark:text-gray-400">
              <SlidersHorizontal size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-black dark:text-white mb-2">No Properties Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search for a different location.</p>
            <button 
              onClick={() => {
                setFilters({ location: '', type: '', subType: '', budget: '' });
                fetchProperties();
              }}
              className="mt-6 text-primary font-bold underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
