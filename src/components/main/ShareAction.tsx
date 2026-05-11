'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareActionProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: 'footer' | 'icon' | 'button';
  className?: string;
}

const ShareAction: React.FC<ShareActionProps> = ({ 
  title = 'Star Land Developers', 
  text = 'Explore premium properties and land investment opportunities.', 
  url, 
  variant = 'icon',
  className = ''
}) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title,
      text,
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Could not copy link.');
      }
    }
  };

  if (variant === 'footer') {
    return (
      <button 
        onClick={handleShare}
        className={`w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all group ${className}`}
        title="Share Website"
      >
        <Share2 size={20} className="group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  if (variant === 'button') {
      return (
        <button 
            onClick={handleShare}
            className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full border border-white/10 transition-all ${className}`}
        >
            <Share2 size={18} />
            <span>Share Property</span>
        </button>
      );
  }

  return (
    <button 
      onClick={handleShare}
      className={`p-3 rounded-full backdrop-blur-md border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all ${className}`}
      title="Share"
    >
      <Share2 size={20} />
    </button>
  );
};

export default ShareAction;
