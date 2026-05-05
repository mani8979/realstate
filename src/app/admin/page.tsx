'use client';

import React, { useState, useEffect } from 'react';
import { Building, MessageSquare, PlusCircle, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalEnquiries: 0,
    recentEnquiries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, enquiriesRes] = await Promise.all([
          axios.get('/api/properties'),
          axios.get('/api/enquiries')
        ]);
        setStats({
          totalProperties: propsRes.data.length,
          totalEnquiries: enquiriesRes.data.length,
          recentEnquiries: enquiriesRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { title: 'Total Properties', value: stats.totalProperties, icon: Building, color: 'bg-blue-500', href: '/admin/properties' },
    { title: 'Total Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'bg-emerald-500', href: '/admin/enquiries' },
    { title: 'Active Listings', value: stats.totalProperties, icon: TrendingUp, color: 'bg-amber-500', href: '/admin/properties' },
    { title: 'New Leads', value: stats.recentEnquiries.length, icon: Users, color: 'bg-purple-500', href: '/admin/enquiries' },
  ];

  if (loading) return <div className="animate-pulse space-y-10">
    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    <div className="grid grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>)}
    </div>
  </div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <Link 
          href="/admin/properties/add" 
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <PlusCircle size={20} />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.href} className="group">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                  <card.icon size={24} />
                </div>
                <ArrowUpRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">{card.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Recent Enquiries</h3>
          <Link href="/admin/enquiries" className="text-primary font-bold hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest">Property</th>
                <th className="px-8 py-5 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {stats.recentEnquiries.length > 0 ? (
                stats.recentEnquiries.map((enquiry: any) => (
                  <tr key={enquiry._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-8 py-6 font-bold text-gray-900 dark:text-white">{enquiry.name}</td>
                    <td className="px-8 py-6 text-gray-600 dark:text-gray-400">{enquiry.phone}</td>
                    <td className="px-8 py-6">
                      <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-xs">
                        {enquiry.propertyTitle || 'General'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-gray-500 text-sm">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-gray-500">No enquiries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
