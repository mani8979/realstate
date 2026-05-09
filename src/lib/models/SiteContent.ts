import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISiteContent extends Document {
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroBgImage: string;
  featuredBadgeText: string;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredCtaText: string;
  featuredBannerTitle: string;
  featuredBannerText: string;
  brandBadge: string;
  brandTitle1: string;
  brandTitle2: string;
  brandP1Side: string;
  brandP1Title: string;
  brandP1Desc: string;
  brandP2Side: string;
  brandP2Title: string;
  brandP2Desc: string;
  brandP3Side: string;
  brandP3Title: string;
  brandP3Desc: string;
  galleryBadge: string;
  galleryTitle: string;
  legacyBadge: string;
  legacyTitle1: string;
  legacyHeading1: string;
  legacyDesc1: string;
  legacyTitle2: string;
  legacyList1: string;
  legacyList2: string;
  marqueeText: string;
  scrollStackDesc: string;
  aboutMission: string;
  aboutVision: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  logoTitle: string;
  logoSubtitle: string;
  navHome: string;
  navProperties: string;
  navAbout: string;
  navContact: string;
  btnCall: string;
  btnCallLink: string;
  btnEnquire: string;
  btnEnquireLink: string;
  footerTitle: string;
  footerInquiriesLabel: string;
  footerPhone: string;
  footerPhoneSub: string;
  footerOfficeLabel: string;
  footerAddress: string;
  footerAddressSub: string;
  footerCopyright: string;
  privacyPolicyContent: string;
  termsOfServiceContent: string;
  footerService1: string;
  footerService2: string;
  service1Content: string;
  service2Content: string;
  ctaSectionTitle: string;
  ctaSectionDesc: string;
  ctaSectionBtn1: string;
  ctaSectionBtn2: string;
  globalFooterDesc: string;
  globalFooterCopyright: string;
  headerLogoImage: string;
  footerLogoImage: string;
  globalThreeDModel: string;
  globalPopupTitle: string;
  globalPopupContent: string;
  faviconImage: string;
  motivationLine: string;
  founderName: string;
  founderRole: string;
  founderBio: string;
  founderVision: string;
  founderExp: string;
  founderImage: string;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    heroBadgeText: { type: String, default: "World-Class Real Estate" },
    heroTitle: { type: String, default: "Find Your Perfect Property" },
    heroSubtitle: { type: String, default: "Invest in a lifestyle defined by luxury, comfort, and exceptional value." },
    heroCtaText: { type: String, default: "Explore Properties" },
    heroCta1Link: { type: String, default: "/properties" },
    heroCta2Text: { type: String, default: "Book Site Visit" },
    heroCta2Link: { type: String, default: "https://wa.me/1234567890" },
    heroBgImage: { type: String, default: "/luxury_villa_hero_1777953581914.png" },
    featuredBadgeText: { type: String, default: "Investment Opportunities" },
    featuredTitle: { type: String, default: "Featured" },
    featuredSubtitle: { type: String, default: "Collections" },
    featuredCtaText: { type: String, default: "Explore All Listings" },
    featuredBannerTitle: { type: String, default: "High Demand Area" },
    featuredBannerText: { type: String, default: "Limited Lands Available: Only 5 Left!" },
    brandBadge: { type: String, default: "Our Core Pillars" },
    brandTitle1: { type: String, default: "Why" },
    brandTitle2: { type: String, default: "Choose Us" },
    brandP1Side: { type: String, default: "Quality First" },
    brandP1Title: { type: String, default: "Verified Properties" },
    brandP1Desc: { type: String, default: "Every listing is manually verified by our team." },
    brandP2Side: { type: String, default: "Legally Secure" },
    brandP2Title: { type: String, default: "Clear Documentation" },
    brandP2Desc: { type: String, default: "100% legal transparency and title clarity." },
    brandP3Side: { type: String, default: "Honest Deals" },
    brandP3Title: { type: String, default: "100% Transparency" },
    brandP3Desc: { type: String, default: "No hidden costs. Direct registration." },
    galleryBadge: { type: String, default: "Cinematic Showcase" },
    galleryTitle: { type: String, default: "Premium Land Gallery" },
    legacyBadge: { type: String, default: "Our Legacy & Values" },
    legacyTitle1: { type: String, default: "01. The Mission" },
    legacyHeading1: { type: String, default: "Transforming Vizag's Landscape" },
    legacyDesc1: { type: String, default: "We believe in creating sustainable, premium living environments that harmonize with nature while providing modern connectivity." },
    legacyTitle2: { type: String, default: "02. The Vision" },
    legacyList1: { type: String, default: "Architectural Innovation" },
    legacyList2: { type: String, default: "Smart Community Living" },
    marqueeText: { type: String, default: "Featured Lands" },
    scrollStackDesc: { type: String, default: "Premium residential lands situated in the most sought-after locations, offering the perfect blend of tranquility and urban connectivity." },
    aboutMission: { type: String, default: "Transforming Vizag's Landscape" },
    aboutVision: { type: String, default: "Architectural Innovation" },
    contactEmail: { type: String, default: "hello@reals.com" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    contactAddress: { type: String, default: "MVP Colony, Visakhapatnam" },
    logoTitle: { type: String, default: "REALS" },
    logoSubtitle: { type: String, default: "ESTATES" },
    navHome: { type: String, default: "Home" },
    navProperties: { type: String, default: "Properties" },
    navAbout: { type: String, default: "About" },
    navContact: { type: String, default: "Contact" },
    btnCall: { type: String, default: "Call" },
    btnCallLink: { type: String, default: "tel:+919876543210" },
    btnEnquire: { type: String, default: "Enquire" },
    btnEnquireLink: { type: String, default: "https://wa.me/1234567890" },
    footerTitle: { type: String, default: "GET IN TOUCH" },
    footerInquiriesLabel: { type: String, default: "Inquiries" },
    footerPhone: { type: String, default: "+91 91234 56789" },
    footerPhoneSub: { type: String, default: "Available Mon-Sat, 9AM-7PM" },
    footerOfficeLabel: { type: String, default: "Main Office" },
    footerAddress: { type: String, default: "Beach Road, MVP Colony,\nVisakhapatnam, AP" },
    footerAddressSub: { type: String, default: "Visit us for a coffee and a chat." },
    footerCopyright: { type: String, default: "© 2026 REALS ESTATE GROUP" },
    privacyPolicyContent: { type: String, default: "Privacy Policy Content goes here..." },
    termsOfServiceContent: { type: String, default: "Terms of Service Content goes here..." },
    footerService1: { type: String, default: "Luxury Interior" },
    footerService2: { type: String, default: "Exclusive Consultation" },
    service1Content: { type: String, default: "Luxury Interior Services Content..." },
    service2Content: { type: String, default: "Exclusive Consultation Services Content..." },
    ctaSectionTitle: { type: String, default: "Ready to claim\nyour Signature land?" },
    ctaSectionDesc: { type: String, default: "Join 1,000+ happy homeowners in Vizag's most prestigious communities. Limited units available for immediate registration." },
    ctaSectionBtn1: { type: String, default: "Schedule a Site Visit" },
    ctaSectionBtn2: { type: String, default: "+91 91234 56789" },
    globalFooterDesc: { type: String, default: "Find your dream property with our expert real estate services. We specialize in buying, selling, and renting premium properties." },
    globalFooterCopyright: { type: String, default: "© 2026 REAL ESTATE. All rights reserved." },
    headerLogoImage: { type: String, default: "/branding/header-logo.png" },
    footerLogoImage: { type: String, default: "/branding/footer-logo.png" },
    globalThreeDModel: { type: String, default: "/models/untitled.glb" },
    globalPopupTitle: { type: String, default: "Cultivation Model" },
    globalPopupContent: { type: String, default: "Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.\n\n*Plantation Details (Per 100 Sq. Yards):*\n\n* 40 dragon fruit plants\n* 4 plants per pole\n* 10 poles in each 100 sq. yards\n\n*Plantation Period:*\n\n* Ideal season: May to November (approx.)\n\n*Yield Duration:*\n\n* Dragon fruit plants can yield fruits for up to 30 years\n\n*Profit Sharing (from the yield of dragon fruits crop):*\n\n* 50% to the company\n* 50% to the client\n\nThis model ensures:\n\n* Land ownership\n* Continuous agricultural income\n* Long-term asset appreciation\n\nAdditionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes." },
    faviconImage: { type: String, default: "/favicon.ico" },
    motivationLine: { type: String, default: "Success in real estate begins with trust and ends with customer satisfaction." },
    founderName: { type: String, default: "Muhammad Yaseen" },
    founderRole: { type: String, default: "Co-Founder & Director" },
    founderBio: { type: String, default: "Muhammad Yaseen is a dynamic real estate professional with 1.5 years of industry experience and a proven track record of achieving exceptional sales in a short span of time. Known for his strong communication skills and customer-first approach, he quickly builds trust and long-term relationships with clients. His expertise spans VMRDA-approved layouts, farm lands, and residential properties, helping customers make confident and profitable investment decisions." },
    founderVision: { type: String, default: "Our vision is to provide trustworthy, legally verified, and high-growth real estate opportunities while building lasting relationships through transparency and commitment." },
    founderExp: { type: String, default: "1.5 Years of Experience in Real Estate\nWorked as Director in Various Real Estate Ventures\nExpertise in VMRDA, Farm Lands & Residential Properties\nAchieved High Property Sales in a Short Time\nStrong Customer Relationship & Communication Skills\nSkilled in Client Handling and Property Consultation" },
    founderImage: { type: String, default: "/founder.png" }
  },
  { timestamps: true }
);

export default models.SiteContent || model<ISiteContent>('SiteContent', SiteContentSchema);
