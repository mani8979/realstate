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
  motivationBgImage: string;
  officeMapUrl: string;
  officeMapEmbedUrl: string;
  // Founder (Main)
  mainFounderName: string;
  mainFounderRole: string;
  mainFounderBio: string;
  mainFounderVision: string;
  mainFounderExp: string;
  mainFounderImage: string;
  // Co-Founder
  cofounderName: string;
  cofounderRole: string;
  cofounderBio: string;
  cofounderVision: string;
  cofounderExp: string;
  cofounderImage: string;
  officeAddress: string;
  officeDescription: string;
  officeShopNo: string;
  officeFloor: string;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    heroBadgeText: { type: String, default: "Luxury Real Estate" },
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
    contactEmail: { type: String, default: "hello@starlands.com" },
    contactPhone: { type: String, default: "+91 98765 43210" },
    contactAddress: { type: String, default: "MVP Colony, Visakhapatnam" },
    logoTitle: { type: String, default: "STAR LANDS" },
    logoSubtitle: { type: String, default: "DEVELOPERS" },
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
    footerCopyright: { type: String, default: "© 2026 STAR LANDS DEVELOPERS GROUP" },
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
    // Main Founder
    mainFounderName: { type: String, default: "Mahaboob shariff" },
    mainFounderRole: { type: String, default: "Founder, Managing Director" },
    mainFounderBio: { type: String, default: "With over 18 years of experience in the real estate industry since 2007, he has built strong expertise across multiple sectors including plots, flats, farm lands, panchayat layouts, apartments, VUDA, and VMRDA projects. He previously worked as a General Manager at Sri Sai Infra for 11 years, where he played a key role in marketing leadership and customer development. Known for his deep market knowledge and professional approach, he has earned the trust and respect of both customers and industry professionals." },
    mainFounderVision: { type: String, default: "Our vision is to provide trusted, legally verified, and value-driven real estate opportunities while building long-term relationships through transparency and commitment." },
    mainFounderExp: { type: String, default: "18+ Years of Experience in Real Estate\nWorked as General Manager at Sri Sai Infra for 11 Years\nExpertise in Plots, Flats, Farm Lands & Apartments\nSpecialized Knowledge in Panchayat Layouts, VUDA & VMRDA Projects\nStrong Leadership in Real Estate Marketing\nExcellent Customer Relationship & Property Consultation Skills" },
    mainFounderImage: { type: String, default: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800" },
    // Co-Founder
    cofounderName: { type: String, default: "Muhammad Yaseen" },
    cofounderRole: { type: String, default: "Co-Founder & Director" },
    cofounderBio: { type: String, default: "Muhammad Yaseen is a dynamic real estate professional with 1.5 years of industry experience and a proven track record of achieving exceptional sales in a short span of time. Known for his strong communication skills and customer-first approach, he quickly builds trust and long-term relationships with clients. His expertise spans VMRDA-approved layouts, farm lands, and residential properties, helping customers make confident and profitable investment decisions." },
    cofounderVision: { type: String, default: "Our vision is to provide trustworthy, legally verified, and high-growth real estate opportunities while building lasting relationships through transparency and commitment." },
    cofounderExp: { type: String, default: "1.5 Years of Experience in Real Estate\nWorked as Director in Various Real Estate Ventures\nExpertise in VMRDA, Farm Lands & Residential Properties\nAchieved High Property Sales in a Short Time\nStrong Customer Relationship & Communication Skills\nSkilled in Client Handling and Property Consultation" },
    cofounderImage: { type: String, default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800" },
    motivationLine: { type: String, default: "Real estate is built not only on land, but on trust, relationships, and long-term value." },
    officeAddress: { type: String, default: "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026." },
    officeDescription: { type: String, default: "Look bro, this is the building. Shop No. 202 is located on the second floor, above Tumble Dry on the first floor." },
    officeShopNo: { type: String, default: "SHOP NO. 202" },
    officeFloor: { type: String, default: "SECOND FLOOR" },
    officeMapUrl: { type: String, default: "https://maps.app.goo.gl/dvqvbugWe8XHJAnt7?g_st=aw" },
    officeMapEmbedUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3799.3510526367375!2d83.2109083!3d17.6820589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDQwJzU1LjQiTiA4M8KwMTInMzkuMyJF!5e0!3m2!1sen!2sin!4v1715310000000!5m2!1sen!2sin" }
  },
  { timestamps: true }
);

export default models.SiteContent || model<ISiteContent>('SiteContent', SiteContentSchema);
