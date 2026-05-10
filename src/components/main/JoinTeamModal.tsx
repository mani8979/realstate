'use client';

import React, { useEffect } from 'react';
import { X, MessageSquare, Phone } from 'lucide-react';
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent shrink-0">
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Join as a Team</h2>
                <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">Connect with our leadership to start your journey.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Members List */}
            <div className="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
              {members.map((member, i) => (
                <div 
                  key={i}
                  className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-primary transition-all">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow text-center md:text-left space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">{member.name}</h3>
                    <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">{member.phone}</p>
                  </div>

                  <a 
                    href={`https://wa.me/${member.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${member.name}, I'm interested in joining the team collaboration.`)}`}
                    target="_blank"
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap shadow-xl shadow-primary/20"
                  >
                    <MessageSquare size={16} />
                    {chatLabel || 'Chat With Us'}
                  </a>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/40 text-center border-t border-white/5 shrink-0">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Professional Real Estate Network</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinTeamModal;
