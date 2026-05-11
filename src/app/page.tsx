import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import SiteContent from '@/lib/models/SiteContent';
import SmoothSlider from '@/components/main/SmoothSlider';
import PremiumHome from '@/components/main/PremiumHome';
import Hero from '@/components/main/Hero';
import FeaturedProperties from '@/components/main/FeaturedProperties';
import CTA from '@/components/main/CTA';
import BrandValues from '@/components/main/BrandValues';
import LocationSection from '@/components/main/LocationSection';
import Founder from '@/components/main/Founder';
import MotivationBanner from '@/components/main/MotivationBanner';

export const revalidate = 0; // Disable static caching for the home page


async function getLands() {
  try {
    await dbConnect();
    // Fetch up to 50 latest properties
    const lands = await Property.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return lands;
  } catch (error) {
    console.error('Error fetching lands:', error);
    return [];
  }
}

async function getContent() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne().lean();
    return content || {};
  } catch (error) {
    return {};
  }
}

export default async function Home() {
  const lands = await getLands();
  const content = await getContent();
  
  // Serialize MongoDB objects for client components
  const serializedLands = JSON.parse(JSON.stringify(lands));
  const serializedContent = JSON.parse(JSON.stringify(content));

  return (
    <div className="flex flex-col bg-white dark:bg-black">
      <Hero content={serializedContent} />
      
      <Founder 
        name={serializedContent.mainFounderName}
        role={serializedContent.mainFounderRole}
        bio={serializedContent.mainFounderBio}
        vision={serializedContent.mainFounderVision}
        exp={serializedContent.mainFounderExp}
        image={serializedContent.mainFounderImage}
        isMain={true}
        experienceYears="18+"
      />
      
      <div className="relative z-10">
        <FeaturedProperties properties={serializedLands.slice(0, 3)} content={serializedContent} />
      </div>

      {/* Cinematic Transition Divider */}
      <div className="relative z-10 py-24 bg-white dark:bg-black overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-10">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-primary" />
            <div className="p-6 rounded-full border-2 border-primary/30 bg-primary/5 backdrop-blur-md shadow-[0_0_50px_rgba(212,175,55,0.2)]">
               <div className="w-6 h-6 rotate-45 border-4 border-primary animate-pulse" />
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-primary/50 to-primary" />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <BrandValues content={serializedContent} />
      </div>

      <div className="relative z-10 py-20 bg-slate-50 dark:bg-slate-950">
         <div className="container mx-auto px-6 mb-12 md:mb-16 text-center">
            <h2 className="text-primary font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px] mb-4">{serializedContent.galleryBadge || 'Cinematic Showcase'}</h2>
            <h3 className="text-3xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">{serializedContent.galleryTitle || 'Premium Land Gallery'}</h3>
         </div>
         <SmoothSlider lands={serializedLands} />
      </div>

      <div className="relative z-20">
        <PremiumHome properties={serializedLands} content={serializedContent} />
      </div>

      <div className="relative z-10">
        <CTA content={serializedContent} />
      </div>

      <div className="relative z-10">
        <LocationSection content={serializedContent} />
      </div>
    </div>
  );
}
