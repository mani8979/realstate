'use client';

import React, { useState } from 'react';
import PropertyForm from '@/components/admin/PropertyForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AddProperty = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios.post('/api/properties', data);
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-black dark:text-white">Add New Property</h1>
        <p className="text-gray-500">Create a new listing for your real estate portfolio.</p>
      </div>

      <PropertyForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddProperty;
