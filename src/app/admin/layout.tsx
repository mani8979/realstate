'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Home, MessageSquare, LogOut, PlusCircle, Building, Menu, Star, ShieldCheck, Users, Image, Phone, MapPin } from 'lucide-react';

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
    { name: 'Header', href: '/admin/navigation', icon: Menu },
    { name: 'Leader Profile', href: '/admin/founder', icon: Users },
    { name: 'Collection', href: '/admin/featured', icon: Star },
    { name: 'Why Choose Us', href: '/admin/brand#why-choose-us', icon: ShieldCheck },
    { name: 'Premium Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Vision & Legacy', href: '/admin/brand#vision', icon: LayoutDashboard },
    { name: 'Featured Lands', href: '/admin/brand#featured-lands', icon: Star },
    { name: 'Get In Touch', href: '/admin/footer#get-in-touch', icon: Phone },
    { name: 'Ready To Claim', href: '/admin/brand#ready-to-claim', icon: LayoutDashboard },
    { name: 'Location', href: '/admin/footer#location', icon: MapPin },
    { name: 'About Star Lands', href: '/admin/content#about-star-lands', icon: Image },
    { name: 'Contact Info', href: '/admin/content#contact-info', icon: Phone },
    { name: 'Join', href: '/admin/join', icon: Users },
    { name: 'Properties', href: '/admin/properties', icon: Building },
    { name: 'Add Property', href: '/admin/properties/add', icon: PlusCircle },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Top Header */}
      <header className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 px-6 border-b border-gray-100 dark:border-gray-900">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-black dark:text-white">
              <Building size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-black dark:text-white hidden sm:block">
              ADMIN<span className="text-primary">PANEL</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>

        {/* Horizontal Navigation */}
        <div className="w-full overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-900">
          <nav className="flex items-center gap-2 p-3 px-6 min-w-max">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
                  pathname === item.href 
                    ? 'bg-primary text-black dark:text-white shadow-md shadow-primary/20' 
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <item.icon size={16} />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
