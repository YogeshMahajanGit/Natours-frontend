import React from 'react';
import { Compass } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading exciting adventures...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <Compass className="w-12 h-12 text-[#1F3D2B] animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-0 rounded-full border-2 border-[#A8541F] border-t-transparent animate-ping opacity-30"></div>
      </div>
      <p className="font-mono text-sm tracking-wide text-[#8E8A7E] font-medium uppercase">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
