'use client';

import React, { useEffect } from 'react';
import { X, MessageSquare, Phone, Users, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  name: string;
  phone: string;
  image: string;
}

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  chatLabel: string;
}

const JoinTeamModal = ({ isOpen, onClose, members, chatLabel }: JoinTeamModalProps) => {
  const [step, setStep] = React.useState(0); // 0: selection, 1: form
  const [joinType, setJoinType] = React.useState<'existing' | 'own' | null>(null);
  const [formData, setFormData] = React.useState({
    leaderName: '',
    mobile: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state when closed
      setTimeout(() => {
        setStep(0);
        setJoinType(null);
        setFormData({ leaderName: '', mobile: '' });
      }, 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi, I want to join as a team.\n\nType: ${joinType === 'own' ? 'Join with my own team (I have experience)' : 'Join with a team (No experience)'}\nTeam Leader Name: ${formData.leaderName}\nMobile: ${formData.mobile}`;
    const waUrl = `https://wa.me/919666080645?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white dark:bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
                  {step === 0 ? 'Join as a Team' : joinType === 'own' ? 'Join With Your Own Team' : 'Join With a Team'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">
                  {step === 0 ? 'Select your experience level to proceed.' : 'Please provide the following details.'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black dark:text-white hover:bg-primary hover:text-black dark:text-white transition-all shadow-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 flex-grow overflow-y-auto" data-lenis-prevent>
              {step === 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {/* Join with a team (No Experience) */}
                  <button
                    onClick={() => {
                      setJoinType('existing');
                      setStep(1);
                    }}
                    className="group flex items-center gap-6 p-8 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                      <Users size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-black dark:text-white group-hover:text-primary transition-colors">Join With a Team</h3>
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1 italic">I don't have experience</p>
                    </div>
                  </button>

                  {/* Join with your own team (Has Experience) */}
                  <button
                    onClick={() => {
                      setJoinType('own');
                      setStep(2);
                    }}
                    className="group flex items-center gap-6 p-8 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-primary group-hover:text-black dark:text-white transition-all">
                      <GraduationCap size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-black dark:text-white group-hover:text-primary transition-colors">Join With Your Own Team</h3>
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1 italic">I have experience</p>
                    </div>
                  </button>
                </div>
              ) : step === 1 ? (
                /* Step 1: Team Leaders List (For Existing Team) */
                <div className="space-y-6">
                  <button 
                    onClick={() => setStep(0)}
                    className="text-xs font-black uppercase tracking-widest text-primary hover:underline mb-2 flex items-center gap-2"
                  >
                    ← Back to Choice
                  </button>
                  {members.map((member, i) => (
                    <div 
                      key={i}
                      className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-black/10 dark:border-white/10 group-hover:border-primary transition-all">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow text-center md:text-left space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tight text-black dark:text-white">{member.name}</h3>
                        <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">{member.phone}</p>
                      </div>

                      <a 
                        href={`https://wa.me/${member.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${member.name}, I want to join with a team (I don't have experience).`)}`}
                        target="_blank"
                        className="flex items-center gap-3 bg-primary text-black dark:text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                      >
                        <MessageSquare size={14} />
                        {chatLabel || 'Chat With Us'}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                /* Step 2: Form (For Own Team) */
                <form onSubmit={handleJoin} className="space-y-6">
                  <div className="mb-8">
                    <button 
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
                    >
                      ← Back to Choice
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-2">Team Leader Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="Enter full name"
                      value={formData.leaderName}
                      onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-black dark:text-white placeholder:text-gray-600 focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-2">Mobile Number</label>
                    <input 
                      required
                      type="tel"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-black dark:text-white placeholder:text-gray-600 focus:border-primary/50 outline-none transition-all"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary text-black dark:text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all transform hover:scale-[1.02] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                      <MessageSquare size={18} />
                      Join Now
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-white dark:bg-black/40 text-center border-t border-white/5">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Professional Real Estate Network</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinTeamModal;
