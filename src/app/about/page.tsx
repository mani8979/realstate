import React from 'react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import AboutClient from '@/components/main/AboutClient';
import Founder from '@/components/main/Founder';
import CTA from '@/components/main/CTA';

async function getContent() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne().lean();
    return content || {};
  } catch (error) {
    return {};
  }
}

const AboutPage = async () => {
  const content = await getContent();
  const serializedContent = JSON.parse(JSON.stringify(content));

  return (
    <div className="bg-black">
      <AboutClient />
      
      {/* Main Founder Section */}
      <div className="py-12">
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
      </div>

      {/* Co-Founder Section */}
      <div className="pb-24">
        <Founder 
          name={serializedContent.cofounderName}
          role={serializedContent.cofounderRole}
          bio={serializedContent.cofounderBio}
          vision={serializedContent.cofounderVision}
          exp={serializedContent.cofounderExp}
          image={serializedContent.cofounderImage}
          isMain={false}
          experienceYears="1.5+"
        />
      </div>

      <CTA content={serializedContent} />
    </div>
  );
};

export default AboutPage;
