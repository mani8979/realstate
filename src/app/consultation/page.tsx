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

export default async function Consultation() {
  const content = await getContent();

  return (
    <div className="min-h-screen bg-black text-white font-sans py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 text-primary">{content?.footerService2 || 'Exclusive Consultation'}</h1>
        <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/70 prose-headings:text-white">
          {content?.service2Content?.split('\n').map((line: string, i: number) => (
            <p key={i} className="mb-4">{line}</p>
          )) || <p>Exclusive Consultation Content goes here...</p>}
        </div>
      </div>
    </div>
  );
}
