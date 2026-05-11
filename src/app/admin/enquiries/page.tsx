'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Phone, Trash2, Search } from 'lucide-react';
import axios from 'axios';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('/api/enquiries');
      setEnquiries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((enquiry: any) => 
    (enquiry?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (enquiry?.phone || '').includes(searchTerm) ||
    (enquiry?.message?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="animate-pulse">Loading enquiries...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Leads & Enquiries</h1>
          <p className="text-gray-500">Manage your potential customers and their messages.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredEnquiries.length > 0 ? (
          filteredEnquiries.map((enquiry: any) => (
            <div key={enquiry?._id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{enquiry?.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Phone size={14} className="text-primary" />
                          <span>{enquiry?.phone || 'No Phone'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar size={14} className="text-primary" />
                          <span>{enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      "{enquiry?.message || 'No message provided'}"
                    </p>
                  </div>
                  
                  {enquiry?.propertyTitle && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Interested In:</span>
                      <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-sm">
                        {enquiry.propertyTitle}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col gap-2">
                  <a 
                    href={`tel:${enquiry?.phone}`}
                    className="flex-grow flex items-center justify-center gap-2 bg-primary text-black dark:text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-all"
                  >
                    <Phone size={18} />
                    <span>Call Lead</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 font-bold">No enquiries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;
