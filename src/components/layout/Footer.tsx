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
                  {link.href === '/properties' ? (
                    <a 
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Portfolio Sections */}
          <div className="text-center md:text-left">
            <h3 className="text-black dark:text-white font-black uppercase tracking-widest text-xs mb-4 md:mb-8">{content.footerCol2Title || 'Portfolio'}</h3>
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
        <div className="border-t border-white/5 pt-12 text-center space-y-3">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">
              {content.globalFooterCopyright || `© ${new Date().getFullYear()} STAR LANDS DEVELOPERS. Crafted with excellence.`}
            </p>
            {/* WhatsApp Icon */}
            <a
              href={`https://wa.me/${(content.contactPhone || '+919581108448').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat with us on WhatsApp"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-[#25D366]/30 hover:shadow-lg shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
          {/* Developer Credit */}
          <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 tracking-widest uppercase">
            Developed by{' '}
            <span className="text-primary/70 font-black">Kalla Manibabu</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
