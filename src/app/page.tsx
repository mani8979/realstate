import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import SiteContent from '@/lib/models/SiteContent';
import SmoothSlider from '@/components/main/SmoothSlider';
import PremiumHome from '@/components/main/PremiumHome';
import Hero from '@/components/main/Hero';
import FeaturedProperties from '@/components/main/FeaturedProperties';
import CTA from '@/components/main/CTA';
import BrandValues from '@/components/main/BrandValues';
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
    <div className="flex flex-col bg-black">
      <Hero />
      
      <MotivationBanner content={serializedContent} />

      <div className="relative z-10">
        <FeaturedProperties properties={serializedLands.slice(0, 3)} />
      </div>

      <div className="relative z-10">
        <BrandValues />
      </div>

      <div className="relative z-10 py-20 bg-slate-950">
         <div className="container mx-auto px-6 mb-16 text-center">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">{serializedContent.galleryBadge || 'Cinematic Showcase'}</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">{serializedContent.galleryTitle || 'Premium Land Gallery'}</h3>
         </div>
         <SmoothSlider lands={serializedLands} />
      </div>

      <div className="relative z-10">
        <Founder content={serializedContent} />
      </div>

      <div className="relative z-20">
        <PremiumHome properties={serializedLands} content={serializedContent} />
      </div>

      <div className="relative z-10">
        <CTA content={serializedContent} />
      </div>
    </div>
  );
}
