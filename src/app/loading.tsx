import React from 'react';

const Loading = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-black dark:text-white">STAR <span className="text-primary">LANDS</span></h2>
        <p className="text-gray-500 font-medium animate-pulse">Loading your dream home...</p>
      </div>
    </div>
  );
};

export default Loading;
