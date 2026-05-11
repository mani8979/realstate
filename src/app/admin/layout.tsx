'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Home, MessageSquare, LogOut, PlusCircle, Building, Menu, Star, ShieldCheck, Users, Image, Phone, MapPin } from 'lucide-react';

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
    router.push('/admin/login');
    setIsLoggedIn(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center text-black dark:text-white bg-white dark:bg-black font-bold uppercase tracking-widest text-xs">
          Loading Admin...
        </div>
      ) : pathname === '/admin/login' ? (
        <div className="w-full">{children}</div>
      ) : !isLoggedIn ? (
        <div className="h-screen w-full flex items-center justify-center">Redirecting...</div>
      ) : (
        <>
          {/* Sidebar */}
          <aside className={`
            ${isSidebarOpen ? 'w-72' : 'w-20'} 
            bg-white dark:bg-black border-r border-gray-100 dark:border-gray-900 
            transition-all duration-300 flex flex-col sticky top-0 h-screen z-50
            hidden lg:flex
          `}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 overflow-hidden">
                <div className="bg-primary p-2 rounded-lg text-black dark:text-white shrink-0">
                  <Building size={24} />
                </div>
                {isSidebarOpen && (
                  <span className="text-xl font-bold tracking-tight dark:text-white whitespace-nowrap">
                    ADMIN<span className="text-primary">PANEL</span>
                  </span>
                )}
              </Link>
            </div>

            <nav className="flex-grow py-6 overflow-y-auto scrollbar-hide px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    pathname === item.href 
                      ? 'bg-primary text-black dark:text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <item.icon size={20} className="shrink-0" />
                  {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-900">
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-3 rounded-xl transition-all w-full ${!isSidebarOpen && 'justify-center'}`}
              >
                <LogOut size={20} />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </aside>

          {/* Mobile Layout Wrapper */}
          <div className="flex flex-col flex-grow w-full min-w-0">
            {/* Mobile Top Header */}
            <header className="lg:hidden bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 sticky top-0 z-[60] p-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg text-black dark:text-white">
                  <Building size={20} />
                </div>
                <span className="text-lg font-bold tracking-tight dark:text-white">
                  ADMIN<span className="text-primary">PANEL</span>
                </span>
              </Link>
              <div className="flex items-center gap-4">
                 <button onClick={handleLogout} className="text-red-500 p-2"><LogOut size={20} /></button>
              </div>
            </header>

            {/* Mobile Nav (Horizontal Scroll) */}
            <div className="lg:hidden w-full overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-900 bg-white dark:bg-black sticky top-[65px] z-50">
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
                    <span className="text-xs">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow p-6 md:p-10 w-full overflow-x-hidden">
              <div className="max-w-7xl mx-auto">
                 {children}
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
