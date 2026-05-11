import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';

async function getContent() {
  try {
    await dbConnect();
    const content = await SiteContent.findOne().lean();
    return content || {};
  } catch (error) {
    return {};
  }
}

export default async function TermsOfService() {
  const content = await getContent();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 text-primary">Terms of Service</h1>
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-black dark:text-white/70 prose-headings:text-black dark:text-white">
          {content?.termsOfServiceContent?.split('\n').map((line: string, i: number) => (
            <p key={i} className="mb-4">{line}</p>
          )) || <p>Terms of Service Content goes here...</p>}
        </div>
      </div>
    </div>
  );
}
