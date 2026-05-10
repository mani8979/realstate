import React from 'react';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import { MessageSquare, Users, Shield, GraduationCap, MapPin, Sparkles } from 'lucide-react';

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
  
  // Parse team members: "Name - Phone"
  const teamMembers = (serializedContent.joinTeamMembers || "").split('\n').filter((l: string) => l.includes('-')).map((line: string) => {
    const [name, phone] = line.split('-').map(s => s.trim());
    return { name, phone };
  });

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[140px] rounded-full opacity-60" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} />
              {serializedContent.joinBadge || 'Career Opportunities'}
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            {serializedContent.joinTitle || 'Join With Us'}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium italic">
            {serializedContent.joinDesc || 'Become a part of our elite real estate network and build your future with the best in the industry.'}
          </p>
        </div>
      </section>

      {/* Office & Requirements */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Location */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                <MapPin size={28} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Office Location</h2>
              <p className="text-gray-400 leading-relaxed">
                {serializedContent.officeAddress || 'Flat No. 202, Backside Complex, Opposite D-Mart, Srinagar, Gajuwaka, Visakhapatnam – 530026.'}
              </p>
            </div>

            {/* Rules */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                <Shield size={28} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Rules & Regulations</h2>
              <ul className="space-y-3">
                {rules.map((rule: string, i: number) => (
                  <li key={i} className="flex gap-3 text-gray-400 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Qualifications</h2>
              <ul className="space-y-3">
                {qualifications.map((q: string, i: number) => (
                  <li key={i} className="flex gap-3 text-gray-400 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Office Gallery */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-12">
            <div className="text-center space-y-4">
               <h2 className="text-4xl font-black uppercase tracking-tighter">Our Professional Workspace</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">Take a look at where the magic happens. We provide a state-of-the-art environment for our teams to excel.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 group">
                  <img src={serializedContent.joinOfficeImage1 || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000"} alt="Office 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 group">
                  <img src={serializedContent.joinOfficeImage2 || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000"} alt="Office 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Options */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Join Individual */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Join as <br/><span className="text-primary">Individual</span></h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  Looking to start your journey solo? We provide the platform and mentorship you need to succeed.
                </p>
              </div>
              <a 
                href={`https://wa.me/${(serializedContent.joinIndividualPhone || '919666080645').replace(/\D/g, '')}?text=${encodeURIComponent("Hi, I want to join as an individual professional.")}`}
                target="_blank"
                className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all transform hover:scale-105 shadow-2xl shadow-primary/20"
              >
                <MessageSquare size={20} />
                {serializedContent.joinIndividualBtnText || 'Join as Individual'}
              </a>
            </div>

            {/* Join Team */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{serializedContent.joinTeamTitle || 'Join as a Team'}</h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  Connect with our team leads directly to discuss collaboration opportunities.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamMembers.map((member: any, i: number) => (
                  <a 
                    key={i}
                    href={`https://wa.me/${member.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${member.name}, I'm interested in joining the team.`)}`}
                    target="_blank"
                    className="flex flex-col p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Users size={20} />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                         <MessageSquare size={12} />
                         {serializedContent.chatWithUsText || 'Chat'}
                      </div>
                    </div>
                    <span className="text-xl font-black uppercase tracking-tight">{member.name}</span>
                    <span className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">{member.phone}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Chat Icon (Mobile/Global) */}
      <a 
        href={`https://wa.me/${(serializedContent.contactPhone || '919666080645').replace(/\D/g, '')}`}
        target="_blank"
        className="fixed bottom-10 right-10 z-[100] bg-primary text-white p-5 rounded-full shadow-2xl shadow-primary/50 hover:scale-110 transition-transform group"
      >
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
           {serializedContent.chatWithUsText || 'Chat With Us'}
        </div>
        <MessageSquare size={28} />
      </a>

    </div>
  );
};

export default JoinPage;
