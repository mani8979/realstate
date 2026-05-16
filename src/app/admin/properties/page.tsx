'use client';

import React, { useState, useEffect } from 'react';
import { Building, PlusCircle, Pencil, Trash2, MapPin, DollarSign, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const AdminProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchProperties = async () => {
    try {
      const res = await axios.get('/api/properties');
      setProperties(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await axios.delete(`/api/properties/${id}`);
      setProperties(properties.filter((p: any) => p._id !== id));
    } catch (error) {
      alert('Error deleting property');
    }
  };

  const filteredProperties = properties.filter((p: any) => 
    (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Property Management</h1>
              <p className="text-gray-500">Manage your listings, prices, and availability.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="/properties" 
                target="_blank" 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              >
                <span>View All Properties</span>
              </a>
              <Link 
                href="/admin/properties/add" 
                className="bg-primary hover:bg-primary-dark text-black dark:text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-primary/20"
              >
                <PlusCircle size={20} />
                <span>Add New Property</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search properties by title or location..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/50 border-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-8 py-5 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Property</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((p: any) => (
                      <tr key={p?._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                              <Image src={p?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000'} alt={p?.title || 'Property'} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white line-clamp-1">{p?.title || 'Untitled'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-gray-500 text-sm">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary" />
                            <span>{p?.location || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold px-3 py-1 rounded-lg text-xs">
                            {p?.type || 'Other'}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-primary">
                          ₹{p?.price ? p.price.toLocaleString('en-IN') : 'N/A'}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/admin/properties/edit/${p._id}`}
                              className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-black dark:text-white transition-all"
                            >
                              <Pencil size={18} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(p._id)}
                              className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-600 hover:text-black dark:text-white transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-500">No properties found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProperties;
