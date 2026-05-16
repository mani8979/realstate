import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISiteContent extends Document {
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroCta3Text: string;
  heroCta3Link: string;
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
  brandDesc: string;
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
  logoLink: string;
  navHome: string;
  navProperties: string;
  navAbout: string;
  navContact: string;
  navJoin: string;
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
  footerCol1Title: string;
  footerCol2Title: string;
  footerCol3Title: string;
  footerCol2Links: string;
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
  socialFacebook: string;
  socialInstagram: string;
  // Founder (Main)
  mainFounderName: string;
  mainFounderRole: string;
  mainFounderBio: string;
  mainFounderVision: string;
  mainFounderExp: string;
  mainFounderImage: string;
  mainFounderPhone: string;
  // Co-Founder
  cofounderName: string;
  cofounderRole: string;
  cofounderBio: string;
  cofounderVision: string;
  cofounderExp: string;
  cofounderImage: string;
  cofounderPhone: string;
  officeAddress: string;
  officeDescription: string;
  locationBadge: string;
  locationTitle1: string;
  locationTitle2: string;
  officeShopNo: string;
  officeFloor: string;
  // Contact Page Specific
  contactBadge: string;
  contactTitle: string;
  contactDesc: string;
  contactCallLabel: string;
  contactCallSub: string;
  contactEmailLabel: string;
  contactEmailSub: string;
  contactVisitLabel: string;
  contactVisitSub: string;
  contactFormNameLabel: string;
  contactFormPhoneLabel: string;
  contactFormMsgLabel: string;
  contactFormBtnText: string;
  // Join Page Specific
  joinBadge: string;
  joinTitle: string;
  joinDesc: string;
  joinRules: string;
  joinQualifications: string;
  joinIndividualBtnText: string;
  joinIndividualPhone: string;
  joinTeamTitle: string;
  joinTeamMembers: string; 
  chatWithUsText: string;
  joinOfficeImage1: string;
  joinOfficeImage2: string;
  joinBgImage: string;
  joinWorkspaceTitle: string;
  joinWorkspaceDesc: string;
  joinIndividualTitle: string;
  joinIndividualDesc: string;
  joinTeamDesc: string;
  joinEligibility: string;
  // Team Leads (Dynamic Array)
  joinTeamLeads: {
    name: string;
    phone: string;
    image: string;
  }[];
  // Gallery (About Page)
  aboutGallery: {
    url: string;
    caption: string;
  }[];
  // Property Categories
  propertyCategories: {
    name: string;
    icon: string;
    color: string;
    href: string;
    subCategories: string[];
  }[];

  // About Section
  aboutTitle: string;
  aboutDesc: string;
  aboutExpertTitle: string;
  aboutExpertDesc: string;
  aboutLegalTitle: string;
  aboutLegalDesc: string;
  aboutZeroTitle: string;
  aboutZeroDesc: string;
  aboutTeamTitle: string;
  aboutTeamDesc: string;
  aboutYearTitle: string;
  aboutYearDesc: string;
  aboutMissionTitle: string;
  aboutMissionDesc: string;
  aboutVisionTitle: string;
  aboutVisionDesc: string;
  aboutMissionVisionImage: string;
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
    heroCta3Text: { type: String, default: "Latest Updates" },
    heroCta3Link: { type: String, default: "https://chat.whatsapp.com/123456" },
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
    brandDesc: { type: String, default: "Dedicated to creating sustainable and premium living environments." },
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
    contactAddress: { type: String, default: "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026." },
    logoTitle: { type: String, default: "STAR LAND" },
    logoSubtitle: { type: String, default: "DEVELOPERS" },
    logoLink: { type: String, default: "/" },
    navHome: { type: String, default: "Home" },
    navProperties: { type: String, default: "Properties" },
    navAbout: { type: String, default: "About" },
    navContact: { type: String, default: "Contact" },
    navJoin: { type: String, default: "Join" },
    btnCall: { type: String, default: "Call" },
    btnCallLink: { type: String, default: "tel:+919666080645" },
    btnEnquire: { type: String, default: "Enquire" },
    btnEnquireLink: { type: String, default: "https://wa.me/919666080645" },
    footerTitle: { type: String, default: "GET IN TOUCH" },
    footerInquiriesLabel: { type: String, default: "Inquiries" },
    footerPhone: { type: String, default: "+91 96660 80645" },
    footerPhoneSub: { type: String, default: "Available Mon-Sat, 9AM-7PM" },
    footerOfficeLabel: { type: String, default: "Main Office" },
    footerAddress: { type: String, default: "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026." },
    footerAddressSub: { type: String, default: "Visit us for a coffee and a chat." },
    footerCopyright: { type: String, default: "© 2026 STAR LAND DEVELOPERS. All rights reserved." },
    privacyPolicyContent: { type: String, default: "Privacy Policy Content goes here..." },
    termsOfServiceContent: { type: String, default: "Terms of Service Content goes here..." },
    footerService1: { type: String, default: "Luxury Interior" },
    footerService2: { type: String, default: "Exclusive Consultation" },
    service1Content: { type: String, default: "Luxury Interior Services Content..." },
    service2Content: { type: String, default: "Exclusive Consultation Services Content..." },
    ctaSectionTitle: { type: String, default: "Ready to claim\nyour Signature land?" },
    ctaSectionDesc: { type: String, default: "Join 1,000+ happy homeowners in Vizag's most prestigious communities. Limited units available for immediate registration." },
    ctaSectionBtn1: { type: String, default: "Schedule a Site Visit" },
    ctaSectionBtn2: { type: String, default: "+91 96660 80645" },
    globalFooterDesc: { type: String, default: "Find your dream property with our expert real estate services. We specialize in buying, selling, and renting premium properties." },
    globalFooterCopyright: { type: String, default: "© 2026 STAR LAND DEVELOPERS. All rights reserved." },
    footerCol1Title: { type: String, default: "Navigation" },
    footerCol2Title: { type: String, default: "Portfolios" },
    footerCol3Title: { type: String, default: "Get In Touch" },
    footerCol2Links: { type: String, default: "Farm Lands, VMRDA Lands, Panchayati Lands" },
    headerLogoImage: { type: String, default: "/branding/header-logo.png" },
    footerLogoImage: { type: String, default: "/branding/footer-logo.png" },
    globalThreeDModel: { type: String, default: "/models/untitled.glb" },
    globalPopupTitle: { type: String, default: "Cultivation Model" },
    globalPopupContent: { type: String, default: "Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.\n\n*Plantation Details (Per 100 Sq. Yards):*\n\n* 40 dragon fruit plants\n* 4 plants per pole\n* 10 poles in each 100 sq. yards\n\n*Plantation Period:*\n\n* Ideal season: May to November (approx.)\n\n*Yield Duration:*\n\n* Dragon fruit plants can yield fruits for up to 30 years\n\n*Profit Sharing (from the yield of dragon fruits crop):*\n\n* 50% to the company\n* 50% to the client\n\nThis model ensures:\n\n* Land ownership\n* Continuous agricultural income\n* Long-term asset appreciation" },
    faviconImage: { type: String, default: "/favicon.ico" },
    // Main Founder
    mainFounderName: { type: String, default: "Mahaboob shariff" },
    mainFounderRole: { type: String, default: "Founder, Managing Director" },
    mainFounderBio: { type: String, default: "With over 18 years of experience in the real estate industry since 2007, he has built strong expertise across multiple sectors including plots, flats, farm lands, panchayat layouts, apartments, VUDA, and VMRDA projects. He previously worked as a General Manager at Sri Sai Infra for 11 years, where he played a key role in marketing leadership and customer development. Known for his deep market knowledge and professional approach, he has earned the trust and respect of both customers and industry professionals." },
    mainFounderVision: { type: String, default: "Our vision is to provide trusted, legally verified, and value-driven real estate opportunities while building long-term relationships through transparency and commitment." },
    mainFounderExp: { type: String, default: "18+ Years of Experience in Real Estate\nWorked as General Manager at Sri Sai Infra for 11 Years\nExpertise in Plots, Flats, Farm Lands & Apartments\nSpecialized Knowledge in Panchayat Layouts, VUDA & VMRDA Projects\nStrong Leadership in Real Estate Marketing\nExcellent Customer Relationship & Property Consultation Skills" },
    mainFounderImage: { type: String, default: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800" },
    mainFounderPhone: { type: String, default: "919666080645" },
    // Co-Founder
    cofounderName: { type: String, default: "Muhammad Yaseen" },
    cofounderRole: { type: String, default: "Co-Founder & Director" },
    cofounderBio: { type: String, default: "Muhammad Yaseen is a dynamic real estate professional with 1.5 years of industry experience and a proven track record of achieving exceptional sales in a short span of time. Known for his strong communication skills and customer-first approach, he quickly builds trust and long-term relationships with clients. His expertise spans VMRDA-approved layouts, farm lands, and residential properties, helping customers make confident and profitable investment decisions." },
    cofounderVision: { type: String, default: "Our vision is to provide trustworthy, legally verified, and high-growth real estate opportunities while building lasting relationships through transparency and commitment." },
    cofounderExp: { type: String, default: "1.5 Years of Experience in Real Estate\nWorked as Director in Various Real Estate Ventures\nExpertise in VMRDA, Farm Lands & Residential Properties\nAchieved High Property Sales in a Short Time\nStrong Customer Relationship & Communication Skills\nSkilled in Client Handling and Property Consultation" },
    cofounderImage: { type: String, default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800" },
    cofounderPhone: { type: String, default: "919573785434" },
    motivationLine: { type: String, default: "Success in real estate begins with trust and ends with customer satisfaction." },
    officeMapUrl: { type: String, default: "https://maps.app.goo.gl/dvqvbugWe8XHJAnt7?g_st=aw" },
    officeMapEmbedUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3799.3510526367375!2d83.2109083!3d17.6820589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDQwJzU1LjQiTiA4M8KwMTInMzkuMyJF!5e0!3m2!1sen!2sin!4v1715310000000!5m2!1sen!2sin" },
    locationBadge: { type: String, default: "Our Presence" },
    locationTitle1: { type: String, default: "FIND US" },
    locationTitle2: { type: String, default: "LOCALLY" },
    officeAddress: { type: String, default: "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026." },
    socialFacebook: { type: String, default: "https://www.facebook.com/people/star-land-developers/" },
    socialInstagram: { type: String, default: "https://www.instagram.com/star_land_developer" },
    contactBadge: { type: String, default: "Get In Touch" },
    contactTitle: { type: String, default: "Have Any Questions?" },
    contactDesc: { type: String, default: "Our team is ready to help you find the perfect property. Send us a message and we'll get back to you within 24 hours." },
    contactCallLabel: { type: String, default: "Call Our Leadership" },
    contactCallSub: { type: String, default: "Shariff / Mohammed" },
    contactEmailLabel: { type: String, default: "Email Us" },
    contactEmailSub: { type: String, default: "info@realestate.com" },
    contactVisitLabel: { type: String, default: "Visit Us" },
    contactVisitSub: { type: String, default: "Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026." },
    contactFormNameLabel: { type: String, default: "Your Name" },
    contactFormPhoneLabel: { type: String, default: "Phone Number" },
    contactFormMsgLabel: { type: String, default: "Message" },
    contactFormBtnText: { type: String, default: "Send Message" },
    joinBadge: { type: String, default: "Career Opportunities" },
    joinTitle: { type: String, default: "Join With Us" },
    joinDesc: { type: String, default: "Become a part of our elite real estate network and build your future with the best in the industry." },
    joinRules: { type: String, default: "Professional Ethics First\nTransparent Communication\nCommitted to Client Success\nAdherence to Legal Guidelines\nPunctual\nAttend Office Meeting(every thursday evening 4 30 pm to 6 30 pm)" },
    joinQualifications: { type: String, default: "Excellent Communication Skills\nStrong Market Knowledge\nSelf-Motivated & Driven\nCritical Thinking" },
    joinIndividualBtnText: { type: String, default: "Join as Individual" },
    joinIndividualPhone: { type: String, default: "919666080645" },
    joinTeamTitle: { type: String, default: "Join as a Team" },
    joinTeamMembers: { type: String, default: "Shariff - 919666080645\nMohammed - 919573785434" },
    chatWithUsText: { type: String, default: "Chat With Us" },
    joinOfficeImage1: { type: String, default: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000" },
    joinOfficeImage2: { type: String, default: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000" },
    joinBgImage: { type: String, default: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?q=80&w=2000" },
    joinWorkspaceTitle: { type: String, default: "Our Professional Workspace" },
    joinWorkspaceDesc: { type: String, default: "Take a look at where the magic happens. We provide a state-of-the-art environment for our teams to excel." },
    joinIndividualTitle: { type: String, default: "Join as Individual" },
    joinIndividualDesc: { type: String, default: "Looking to start your journey solo? We provide the platform and mentorship you need to succeed." },
    joinTeamDesc: { type: String, default: "Connect with our team leads directly to discuss collaboration opportunities." },
    joinEligibility: { type: String, default: "no age limit required\nno prior experience required\nanyone interested in real estate business can join" },
    joinTeamLeads: {
      type: [{
        name: String,
        phone: String,
        image: String
      }],
      default: [
        {
          name: "Mahaboob Shariff",
          phone: "919666080645",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800"
        },
        {
          name: "Muhammad Yaseen",
          phone: "919573785434",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800"
        },
        {
          name: "Professional Consultant",
          phone: "919666080645",
          image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800"
        }
      ]
    },
    aboutGallery: {
      type: [{
        url: String,
        caption: String
      }],
      default: []
    },
    propertyCategories: {
      type: [{
        name: String,
        icon: String,
        color: String,
        href: String,
        subCategories: [String]
      }],
      default: [
        { name: 'Houses', icon: 'Home', color: 'bg-blue-50 text-blue-600', href: '/properties?type=House', subCategories: [] },
        { name: 'Apartments', icon: 'Building2', color: 'bg-emerald-50 text-emerald-600', href: '/properties?type=Apartment', subCategories: [] },
        { name: 'Plots', icon: 'Landmark', color: 'bg-amber-50 text-amber-600', href: '/properties?type=Plot', subCategories: ['Residential', 'Commercial', 'Open Plots'] },
        { name: 'Farm Lands', icon: 'Warehouse', color: 'bg-green-50 text-green-600', href: '/properties?type=Plot&subType=Farm Land', subCategories: ['Cultivated', 'Organic', 'Mixed'] },
        { name: 'VMRDA Lands', icon: 'Building2', color: 'bg-indigo-50 text-indigo-600', href: '/properties?type=Plot&subType=VMRDA', subCategories: [] },
        { name: 'Panchayati Lands', icon: 'Landmark', color: 'bg-purple-50 text-purple-600', href: '/properties?type=Plot&subType=Panchayati', subCategories: [] },
      ]
    },
    // About Section
    aboutTitle: { type: String, default: 'About Star Lands' },
    aboutDesc: { type: String, default: 'We are a team of dedicated professionals committed to providing the best real estate solutions.' },
    aboutExpertTitle: { type: String, default: 'Expert Verification' },
    aboutExpertDesc: { type: String, default: 'Every listing is manually verified by our team.' },
    aboutLegalTitle: { type: String, default: '100% Legal Clarity' },
    aboutLegalDesc: { type: String, default: 'Secure your future with confidence and peace of mind.' },
    aboutZeroTitle: { type: String, default: 'Zero Hidden Costs' },
    aboutZeroDesc: { type: String, default: 'Transparent pricing with no surprises during registration.' },
    aboutTeamTitle: { type: String, default: 'Real Estate Team Excellence' },
    aboutTeamDesc: { type: String, default: 'Collaborative professionals working for your success.' },
    aboutYearTitle: { type: String, default: '15+ Years of Service' },
    aboutYearDesc: { type: String, default: 'A legacy built on results and trust since 2007.' },
    aboutMissionTitle: { type: String, default: 'Our Mission' },
    aboutMissionDesc: { type: String, default: "Transforming Vizag's Landscape" },
    aboutVisionTitle: { type: String, default: 'Our Vision' },
    aboutVisionDesc: { type: String, default: 'Architectural Innovation & Smart Community Living' },
    aboutMissionVisionImage: { type: String, default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000' },
  },
  { timestamps: true }
);

export default models.SiteContent || model<ISiteContent>('SiteContent', SiteContentSchema);
