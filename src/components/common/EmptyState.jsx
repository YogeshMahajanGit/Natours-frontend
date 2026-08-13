import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No Expeditions Found',
  description = 'We couldn’t find any tours matching your criteria. Try resetting your filters or exploring our full catalog.',
  actionText = 'Explore All Tours',
  actionLink = '/tours',
  onAction,
}) => {
  return (
    <div className="ticket-stub rounded-xl p-8 sm:p-12 text-center my-8 max-w-xl mx-auto shadow-sm">
      <div className="w-16 h-16 bg-[#F7F4EC] border-2 border-[#1F3D2B] rounded-full flex items-center justify-center mx-auto mb-5 text-[#1F3D2B]">
        <MapPin className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-serif text-[#1F3D2B] font-bold mb-2">{title}</h3>
      <p className="text-[#1B1B18]/70 mb-6 leading-relaxed text-sm">{description}</p>
      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-[#1F3D2B] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#2E5940] transition-colors shadow-md"
        >
          {actionText}
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 bg-[#1F3D2B] text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#2E5940] transition-colors shadow-md"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
