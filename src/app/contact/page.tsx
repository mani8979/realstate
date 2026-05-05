import React from 'react';
import ContactSection from '@/components/main/ContactSection';

const ContactPage = () => {
  return (
    <div className="pt-20">
      <div className="bg-primary/5 py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-6">Contact Us</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We're here to answer any questions you may have about our properties or services. Reach out to us today!
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
};

export default ContactPage;
