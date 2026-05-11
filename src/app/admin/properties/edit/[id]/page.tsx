'use client';

import React, { useState, useEffect } from 'react';
import PropertyForm from '@/components/admin/PropertyForm';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const EditProperty = () => {
  const [loading, setLoading] = useState(false);
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

  if (!property) return <div>Loading property data...</div>;

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-black dark:text-white">Edit Property</h1>
        <p className="text-gray-500">Update the details for "{property?.title}".</p>
      </div>

      <PropertyForm initialData={property} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default EditProperty;
