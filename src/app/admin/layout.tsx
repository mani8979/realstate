'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Home, MessageSquare, LogOut, PlusCircle, Building, Menu, Star, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    } else if (pathname !== '/admin/login') {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (pathname === '/admin/login') return <>{children}</>;

  if (!isLoggedIn) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hero Section', href: '/admin/hero', icon: LayoutDashboard },
    { name: 'Featured Section', href: '/admin/featured', icon: Star },
    { name: 'Home Extras', href: '/admin/brand', icon: ShieldCheck },
    { name: 'Navigation', href: '/admin/navigation', icon: Menu },
    { name: 'Footer & Legal', href: '/admin/footer', icon: LayoutDashboard },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Add Property', href: '/admin/properties/add', icon: PlusCircle },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Building size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">
              ADMIN<span className="text-primary">PANEL</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${
                pathname === item.href 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
