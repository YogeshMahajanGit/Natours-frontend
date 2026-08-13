import React from 'react';

const PassportStamp = ({ duration, difficulty, className = '' }) => {
  const isGreen = difficulty === 'easy';
  const isClay = difficulty === 'difficult';

  return (
    <div
      className={`passport-stamp ${
        isGreen ? 'passport-stamp-green' : isClay ? 'border-[#A8541F] text-[#A8541F]' : 'border-[#2E5940] text-[#2E5940]'
      } ${className}`}
    >
      <span className="text-[10px] tracking-widest uppercase opacity-80 leading-none">PASSPORT</span>
      <span className="text-xs font-bold uppercase leading-tight my-0.5">{difficulty}</span>
      <span className="text-[11px] font-semibold leading-none">{duration} DAYS</span>
    </div>
  );
};

export default PassportStamp;
