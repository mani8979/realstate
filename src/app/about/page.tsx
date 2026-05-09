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
      
      <div className="pb-24">
        <Founder content={serializedContent} />
      </div>

      <CTA content={serializedContent} />
    </div>
  );
};

export default AboutPage;
