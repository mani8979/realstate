'use client';

import React, { useState, useEffect } from 'react';
import PropertyForm from '@/components/admin/PropertyForm';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import AdminPreviewModal from '@/components/admin/AdminPreviewModal';
import { Globe } from 'lucide-react';

const EditProperty = () => {
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios.put(`/api/properties/${id}`, data);
      alert('Property updated successfully!');
      // router.push('/admin/properties'); // Stay on the page
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {!property ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Property Data...</p>
          </div>
        </div>
      ) : (
        <>
          <AdminPreviewModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            url={`/properties/${id}`} 
            title={`Preview: ${property?.title}`}
          />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Edit Property</h1>
              <p className="text-gray-500">Update the details for "{property?.title}".</p>
            </div>
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2"
            >
              <Globe size={18} />
              Live Preview
            </button>
          </div>

          <PropertyForm initialData={property} onSubmit={handleSubmit} loading={loading} />
        </>
      )}
    </div>
  );
};

export default EditProperty;
