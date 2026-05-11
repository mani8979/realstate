'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[34px] h-[34px]"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-black/5 dark:bg-white/5 dark:bg-black/5 dark:bg-white/5 bg-white dark:bg-black/5 rounded-lg border border-black/10 dark:border-black/10 dark:border-white/10 hover:bg-primary/20 text-black dark:text-black dark:text-white transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
