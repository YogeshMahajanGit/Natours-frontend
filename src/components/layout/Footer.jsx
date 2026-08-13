import React from 'react';
import { Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1F3D2B] text-[#F7F4EC] pt-12 pb-8 border-t border-[#2E5940] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-[#2E5940]">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#A8541F] flex items-center justify-center bg-[#2E5940]">
              <Compass className="w-6 h-6 text-[#F7F4EC]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#F7F4EC]">
                NATOURS
              </span>
              <p className="text-xs text-[#8E8A7E] font-mono mt-0.5">Exciting tours for adventurous people</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-wider">
            <Link to="/tours" className="hover:text-amber-300 transition-colors">All Tours</Link>
            <Link to="/tours?difficulty=easy" className="hover:text-amber-300 transition-colors">Easy Hikes</Link>
            <Link to="/tours?difficulty=medium" className="hover:text-amber-300 transition-colors">Medium Trails</Link>
            <Link to="/tours?difficulty=difficult" className="hover:text-amber-300 transition-colors">Extreme Expeditions</Link>
          </div>
        </div>

        {/* Bottom copyright & details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E8A7E]">
          <p>© {new Date().getFullYear()} Natours Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for true explorers</span>
            <Heart className="w-3.5 h-3.5 text-[#A8541F] fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
