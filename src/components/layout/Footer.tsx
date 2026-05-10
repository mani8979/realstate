import React from 'react';
import Link from 'next/link';
import { Home, Phone, Mail, MapPin, Globe, Share2, MessageSquare, Info } from 'lucide-react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';

const Footer = async () => {
  let content: any = {};
  try {
    await dbConnect();
    const result = await SiteContent.findOne().lean();
    if (result) content = result;
  } catch (error) {
    console.error("Failed to load footer content:", error);
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              {content.footerLogoImage ? (
                <div className="relative h-12 w-32">
                  <img src={content.footerLogoImage} alt={content.logoTitle} className="h-full w-full object-contain" />
                </div>
              ) : (
                <>
                  <div className="bg-primary p-2 rounded-lg text-white">
                    <Home size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {content.logoTitle || 'STAR LANDS'}<span className="text-primary">{content.logoSubtitle || 'DEVELOPERS'}</span>
                  </span>
                </>
              )}
            </Link>
            <p className="text-gray-400 leading-relaxed">
              {content.globalFooterDesc || 'Find your dream property with our expert real estate services. We specialize in buying, selling, and renting premium properties.'}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <Share2 size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <MessageSquare size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-all">
                <Info size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-primary transition-colors">{content.navHome || 'Home'}</Link></li>
              <li><Link href="/properties" className="hover:text-primary transition-colors">{content.navProperties || 'Properties'}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{content.navAbout || 'About Us'}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{content.navContact || 'Contact'}</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Property Types</h3>
            <ul className="space-y-4">
              <li><Link href="/properties?type=House" className="hover:text-primary transition-colors">Houses</Link></li>
              <li><Link href="/properties?type=Apartment" className="hover:text-primary transition-colors">Apartments</Link></li>
              <li><Link href="/properties?type=Land" className="hover:text-primary transition-colors">Lands</Link></li>
              <li><Link href="/properties?type=Commercial" className="hover:text-primary transition-colors">Commercial</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>{content.contactAddress || 'Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026.'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary flex-shrink-0" size={20} />
                <span>{content.contactPhone || '+1 234 567 890'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary flex-shrink-0" size={20} />
                <span>{content.contactEmail || 'info@realestate.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>{content.globalFooterCopyright || `© ${new Date().getFullYear()} STAR LANDS. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
