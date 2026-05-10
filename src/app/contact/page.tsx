import React from 'react';
import ContactSection from '@/components/main/ContactSection';
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
    <div className="pt-20">
      <div className="bg-primary/5 py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {serializedContent.contactDesc || "We're here to answer any questions you may have about our properties or services. Reach out to us today!"}
          </p>
        </div>
      </div>
      <ContactSection content={serializedContent} />
    </div>
  );
};

export default ContactPage;
