import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, Flame, DollarSign } from 'lucide-react';

const TourFilters = ({ filters, onFilterChange, onReset, isTop5Active }) => {
  const { difficulty = '', minPrice = '', maxPrice = '', sort = '' } = filters;

  // Calculate active filter count
  const activeCount = [
    difficulty,
    minPrice,
    maxPrice,
    sort,
    isTop5Active ? 'top5' : ''
  ].filter(Boolean).length;

  return (
    <div className="glass-card-accent rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Filter Header & Active Count */}
      <div className="flex items-center justify-between border-b border-[#D6CFBE]/60 pb-4">
        <div className="flex items-center gap-2.5 text-[#1F3D2B]">
          <div className="p-1.5 rounded-lg bg-[#1F3D2B]/10">
            <Filter className="w-4 h-4 text-[#1F3D2B]" />
          </div>
          <div>
            <h3 className="font-mono text-sm uppercase font-bold tracking-wider text-[#1F3D2B]">
              Refine Expeditions
            </h3>
            {activeCount > 0 && (
              <span className="text-[11px] font-mono text-[#A8541F] font-semibold">
                {activeCount} active {activeCount === 1 ? 'filter' : 'filters'}
              </span>
            )}
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-mono text-[#A8541F] hover:text-[#8C4318] flex items-center gap-1 px-2 py-1 rounded-md bg-[#A8541F]/10 hover:bg-[#A8541F]/20 transition-colors font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Quick Filter Presets */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2 tracking-wide">
          Curated Quick Presets
        </label>
        <button
          type="button"
          onClick={() => onFilterChange('top5', isTop5Active ? '' : 'true')}
          className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            isTop5Active
              ? 'bg-[#A8541F] text-white shadow-md shadow-[#A8541F]/20 ring-2 ring-[#A8541F]/30 scale-[1.01]'
              : 'bg-[#A8541F]/10 text-[#A8541F] hover:bg-[#A8541F]/20 border border-[#A8541F]/30'
          }`}
        >
          <Flame className={`w-4 h-4 ${isTop5Active ? 'fill-current animate-pulse' : ''}`} />
          <span>🔥 Top 5 Cheap Tours</span>
        </button>
      </div>

      {/* Difficulty Selector */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2 tracking-wide">
          Difficulty Level
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-[#F7F4EC] rounded-xl border border-[#D6CFBE]/50">
          {[
            { value: '', label: 'All' },
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'difficult', label: 'Hard' },
          ].map(({ value, label }) => {
            const isSelected = difficulty === value;
            return (
              <button
                key={value || 'all'}
                type="button"
                onClick={() => onFilterChange('difficulty', value)}
                className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-150 text-center truncate cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F3D2B] text-white shadow-sm ring-1 ring-[#1F3D2B]'
                    : 'text-[#1B1B18]/70 hover:text-[#1F3D2B] hover:bg-white/60'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2 tracking-wide">
          Price Range ($ USD)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-mono text-[#8E8A7E] block mb-1">Min Price</span>
            <div className="relative flex items-center">
              <DollarSign className="w-3.5 h-3.5 text-[#8E8A7E] absolute left-2.5 pointer-events-none" />
              <input
                type="number"
                min="0"
                placeholder="300"
                value={minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-xs font-mono border border-[#D6CFBE] rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:border-[#1F3D2B] focus:ring-2 focus:ring-[#1F3D2B]/15 transition-all"
              />
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono text-[#8E8A7E] block mb-1">Max Price</span>
            <div className="relative flex items-center">
              <DollarSign className="w-3.5 h-3.5 text-[#8E8A7E] absolute left-2.5 pointer-events-none" />
              <input
                type="number"
                min="0"
                placeholder="3000"
                value={maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-xs font-mono border border-[#D6CFBE] rounded-xl bg-white/80 focus:bg-white focus:outline-none focus:border-[#1F3D2B] focus:ring-2 focus:ring-[#1F3D2B]/15 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sort By Selector */}
      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-2 tracking-wide flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#1F3D2B]" />
          Sort By
        </label>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#D6CFBE] rounded-xl bg-white/90 focus:bg-white focus:outline-none focus:border-[#1F3D2B] focus:ring-2 focus:ring-[#1F3D2B]/15 text-[#1B1B18] appearance-none cursor-pointer transition-all pr-8"
          >
            <option value="">Default Catalog Order</option>
            <option value="price">Price: Low to High (Cheap First)</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratingsAverage">Highest Rated</option>
            <option value="duration">Duration: Shortest First</option>
            <option value="-duration">Duration: Longest First</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E8A7E]">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourFilters;

