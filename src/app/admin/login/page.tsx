'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Building } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/admin/login', formData);
      if (res.data.success) {
        localStorage.setItem('adminAuth', 'true');
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-primary p-4 rounded-2xl text-black dark:text-white inline-block mb-4 shadow-xl shadow-primary/20">
            <Building size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-black dark:text-white">Admin Access</h1>
          <p className="text-gray-500 mt-2">Please login to manage your properties.</p>
        </div>

        <div className="bg-white dark:bg-gray-50 dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-black dark:text-white rounded-2xl focus:ring-2 focus:ring-primary/50 border-none transition-all"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-black dark:text-white rounded-2xl focus:ring-2 focus:ring-primary/50 border-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-black dark:text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
