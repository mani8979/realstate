import React from 'react';
import ContactSection from '@/components/main/ContactSection';
import GetInTouch from '@/components/main/GetInTouch';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';

export const revalidate = 0;

async function getContent() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne().lean();
    return content || {};
  } catch (error) {
    return {};
  }
}

const ContactPage = async () => {
  const content = await getContent();
  const serializedContent = JSON.parse(JSON.stringify(content));

  return (
    <div className="bg-black">
      <GetInTouch content={serializedContent} />
      <ContactSection content={serializedContent} />
    </div>
  );
};

export default ContactPage;
