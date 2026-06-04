import React from 'react';
import Link from 'next/link';
import { Home, Phone, Mail, MapPin } from 'lucide-react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import ShareAction from '@/components/main/ShareAction';

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
    <footer id="footer" className="bg-zinc-50 dark:bg-zinc-950 text-gray-700 dark:text-gray-300 pt-10 pb-20 md:pt-24 md:pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 mb-10 md:mb-20">
          {/* Brand & Mission */}
          <div className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start">
            <Link href={content.logoLink || "/"} className="flex items-center gap-3 group">
              {content.footerLogoImage ? (
                <div className="relative h-14 w-40">
                  <img src={content.footerLogoImage} alt={content.logoTitle} className="h-full w-full object-contain" />
                </div>
              ) : (
                <>
                  <div className="bg-primary p-3 rounded-2xl text-black dark:text-white group-hover:rotate-[15deg] transition-all shadow-xl shadow-primary/20">
                    <Home size={28} />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-2xl font-black tracking-tighter text-black dark:text-white">
                      {content.logoTitle || 'STAR LANDS'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                      {content.logoSubtitle || 'DEVELOPERS'}
                    </span>
                  </div>
                </>
              )}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs text-sm md:text-base font-medium">
              {content.globalFooterDesc || 'Crafting prestigious living spaces and premium investment opportunities in Vizag since 2006.'}
            </p>
            <div className="flex items-center gap-4">
              <a href={content.socialFacebook || "https://www.facebook.com/people/star-land-developers/"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center hover:bg-[#1877F2] hover:text-black dark:text-white transition-all group" title="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href={content.socialInstagram || "https://www.instagram.com/star_land_developer"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-black dark:text-white transition-all group" title="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <ShareAction variant="footer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-black dark:text-white font-black uppercase tracking-widest text-xs mb-4 md:mb-8">{content.footerCol1Title || 'Navigation'}</h3>
            <ul className="space-y-5">
              {[
                { name: content.navHome || 'Home', href: '/' },
                { name: content.navProperties || 'Properties', href: '/properties' },
                { name: content.navAbout || 'About Us', href: '/about' },
                { name: content.navContact || 'Contact', href: '/contact' },
                { name: content.navJoin || 'Join', href: '/join' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portfolio Sections */}
          <div className="text-center md:text-left">
            <h3 className="text-black dark:text-white font-black uppercase tracking-widest text-xs mb-4 md:mb-8">Portfolio</h3>
            <ul className="space-y-5">
              {(content.propertyCategories || []).map((cat: any) => (
                <li key={cat.name} className="flex flex-col gap-3">
                  <Link href={cat.href} className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                    {cat.name}
                  </Link>
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <ul className="pl-3 space-y-3 border-l-2 border-primary/20 ml-1">
                      {cat.subCategories.map((sub: string) => {
                        const href = cat.href.includes('?') 
                          ? `${cat.href}&subType=${encodeURIComponent(sub)}`
                          : `${cat.href}?subType=${encodeURIComponent(sub)}`;
                        return (
                          <li key={sub}>
                            <Link href={href} className="text-gray-500 dark:text-gray-500 hover:text-primary transition-colors text-xs font-semibold uppercase tracking-widest">
                              {sub}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Terms Sections */}
          <div className="text-center md:text-left">
            <h3 className="text-black dark:text-white font-black uppercase tracking-widest text-xs mb-4 md:mb-8">Terms & Conditions</h3>
            <ul className="space-y-5">
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="text-center md:text-left">
            <h3 className="text-black dark:text-white font-black uppercase tracking-widest text-xs mb-4 md:mb-8">Contact Info</h3>
            <ul className="space-y-6">
              <li className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {content.contactAddress || 'Flat No.202, Backside Complex, Opposite of DMART, Srinagar, Gajuwaka, Visakhapatnam, AP, 530026'}
                </span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">{content.contactPhone || '+91 96660 80645'}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">{content.contactEmail || 'starlanddevelopers2@gmail.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/5 pt-12 text-center">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
            {content.globalFooterCopyright || `© ${new Date().getFullYear()} STAR LANDS DEVELOPERS. Crafted with excellence.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
