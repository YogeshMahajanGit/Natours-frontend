import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Flag, User, Star, ArrowRight } from 'lucide-react';
import PassportStamp from './PassportStamp';

export const getTourImage = (tour) => {
  if (!tour) return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';

  const slug = tour.slug || (tour.name ? tour.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
  const nameLower = (tour.name || '').toLowerCase();

  if (slug.includes('forest') || nameLower.includes('forest') || nameLower.includes('hiker')) {
    return 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('sea') || nameLower.includes('sea') || nameLower.includes('explorer') || nameLower.includes('ocean')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('snow') || nameLower.includes('snow') || nameLower.includes('adventurer')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('park') || nameLower.includes('park') || nameLower.includes('camper')) {
    return 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('city') || nameLower.includes('city') || nameLower.includes('wanderer')) {
    return 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('sports') || nameLower.includes('sports') || nameLower.includes('lover')) {
    return 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('star') || nameLower.includes('star') || nameLower.includes('gazer')) {
    return 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('northern') || nameLower.includes('northern') || nameLower.includes('lights')) {
    return 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=80';
  }
  if (slug.includes('wine') || nameLower.includes('wine') || nameLower.includes('taster')) {
    return 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80';
  }

  if (tour.imageCover && (tour.imageCover.startsWith('http://') || tour.imageCover.startsWith('https://'))) {
    return tour.imageCover;
  }

  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
};

const TourCard = ({ tour }) => {
  const {
    _id,
    id,
    name,
    duration,
    maxGroupSize,
    difficulty,
    ratingsAverage = 4.5,
    ratingsQuantity = 0,
    price,
    summary,
    startLocation,
    startDates = [],
    locations = [],
  } = tour;

  const tourId = id || _id;
  const imageUrl = getTourImage(tour);

  const startDateFormatted = startDates[0]
    ? new Date(startDates[0]).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Upcoming Season';

  return (
    <div className="ticket-stub rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group bg-white border-2 border-dashed border-[#D6CFBE]">
      <div className="relative h-60 sm:h-64 overflow-hidden bg-[#1F3D2B]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/90 via-[#1F3D2B]/20 to-transparent"></div>

        <div className="absolute top-4 right-4 z-10">
          <PassportStamp duration={duration} difficulty={difficulty} />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-serif text-2xl text-white font-bold tracking-tight drop-shadow-md">
            {name}
          </h3>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <p className="text-xs font-mono text-[#A8541F] uppercase font-bold tracking-wider mb-2">
            {difficulty} • {duration}-Day Expedition
          </p>
          <p className="text-sm text-[#1B1B18]/80 line-clamp-2 leading-relaxed italic mb-6">
            "{summary}"
          </p>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-mono text-[#1B1B18]/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1F3D2B] shrink-0" />
              <span className="truncate">{startLocation?.description || 'Multiple Locations'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1F3D2B] shrink-0" />
              <span>{startDateFormatted}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#1F3D2B] shrink-0" />
              <span>{locations.length || 3} Stops</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#1F3D2B] shrink-0" />
              <span>Max {maxGroupSize} People</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F7F4EC] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-[#1F3D2B]">${price}</span>
              <span className="text-xs text-[#8E8A7E] font-mono">/ person</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold font-mono text-[#1B1B18]">{ratingsAverage}</span>
              <span className="text-[11px] text-[#8E8A7E] font-mono">({ratingsQuantity})</span>
            </div>
          </div>

          <Link
            to={`/tours/${tourId}`}
            className="inline-flex items-center gap-1.5 bg-[#1F3D2B] text-white px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-[#2E5940] transition-colors shadow-xs group-hover:bg-[#A8541F] font-bold"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
