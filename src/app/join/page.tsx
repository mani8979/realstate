import React from 'react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import JoinPageClient from '@/components/main/JoinPageClient';

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

const JoinPage = async () => {
  const content = await getContent();
  const serializedContent = JSON.parse(JSON.stringify(content));

  const rules = serializedContent.joinRules ? serializedContent.joinRules.split('\n') : [];
  const qualifications = serializedContent.joinQualifications ? serializedContent.joinQualifications.split('\n') : [];

  return (
    <JoinPageClient 
      serializedContent={serializedContent}
      rules={rules}
      qualifications={qualifications}
    />
  );
};

export default JoinPage;
