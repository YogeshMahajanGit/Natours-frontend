import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, Flame, Sparkles } from 'lucide-react';

const TourFilters = ({ filters, onFilterChange, onReset, isTop5Active }) => {
  const { difficulty = '', minPrice = '', maxPrice = '', sort = '' } = filters;

  return (
    <div className="bg-white border-2 border-dashed border-[#D6CFBE] rounded-xl p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#F7F4EC] pb-3">
        <div className="flex items-center gap-2 text-[#1F3D2B]">
          <Filter className="w-4 h-4" />
          <h3 className="font-mono text-sm uppercase font-bold tracking-wider">Refine Expeditions</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-mono text-[#A8541F] hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Quick Filter Presets */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2">
          Curated Quick Presets
        </label>
        <button
          type="button"
          onClick={() => onFilterChange('top5', isTop5Active ? '' : 'true')}
          className={`w-full py-2.5 px-3 rounded-lg text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all ${
            isTop5Active
              ? 'bg-[#A8541F] text-white shadow-md ring-2 ring-[#A8541F]/30'
              : 'bg-[#A8541F]/10 text-[#A8541F] hover:bg-[#A8541F]/20 border border-[#A8541F]/30'
          }`}
        >
          <Flame className="w-4 h-4 fill-current" />
          <span>🔥 Top 5 Cheap Tours</span>
        </button>
      </div>

      {/* Difficulty Selector */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2">
          Difficulty Level
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F7F4EC] rounded-lg">
          {['', 'easy', 'medium', 'difficult'].map((level) => {
            const isSelected = difficulty === level;
            return (
              <button
                key={level || 'all'}
                type="button"
                onClick={() => onFilterChange('difficulty', level)}
                className={`py-1.5 px-2 rounded text-xs font-mono uppercase transition-all ${
                  isSelected
                    ? 'bg-[#1F3D2B] text-white font-bold shadow-sm'
                    : 'text-[#1B1B18]/70 hover:text-[#1F3D2B]'
                }`}
              >
                {level === '' ? 'All' : level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2">
          Price Range ($ USD)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-mono text-[#8E8A7E] block mb-1">Min Price</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 300"
              value={minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/50 focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>
          <div>
            <span className="text-[11px] font-mono text-[#8E8A7E] block mb-1">Max Price</span>
            <input
              type="number"
              min="0"
              placeholder="e.g. 3000"
              value={maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/50 focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>
        </div>
      </div>

      {/* Sort By Selector */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2 flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3 text-[#1F3D2B]" />
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 text-xs font-mono border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/50 focus:outline-none focus:border-[#1F3D2B] text-[#1B1B18]"
        >
          <option value="">Default Catalog Order</option>
          <option value="price">Price: Low to High (Cheap First)</option>
          <option value="-price">Price: High to Low</option>
          <option value="-ratingsAverage">Highest Rated</option>
          <option value="duration">Duration: Shortest First</option>
          <option value="-duration">Duration: Longest First</option>
        </select>
      </div>
    </div>
  );
};

export default TourFilters;
