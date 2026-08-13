import React from 'react';
import { Star, User, Quote, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ENV } from '../../config/env';

const ReviewList = ({ reviews = [], onEditReview, onDeleteReview }) => {
  const { user } = useAuth();

  if (!reviews.length) {
    return (
      <div className="ticket-stub rounded-xl p-8 text-center text-[#8E8A7E]">
        <p className="font-mono text-sm">No reviews yet for this expedition. Be the first adventurer to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => {
        const isOwner = user && rev.user && (rev.user._id === user._id || rev.user.id === user._id);
        const reviewerName = rev.user?.name || 'Explorer';
        const reviewerPhoto = rev.user?.photo ? `${ENV.API_SERVER_URL}/img/users/${rev.user.photo}` : null;

        return (
          <div
            key={rev._id || rev.id}
            className="ticket-stub rounded-xl p-5 bg-white space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-mono font-bold text-xs uppercase overflow-hidden border border-[#A8541F]">
                  {reviewerPhoto ? (
                    <img
                      src={reviewerPhoto}
                      alt={reviewerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span>{reviewerName.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F3D2B]">{reviewerName}</h4>
                  <p className="text-[10px] font-mono text-[#8E8A7E]">Verified Explorer</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (rev.rating || 5)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-[#1B1B18]/80 leading-relaxed italic">
              "{rev.review}"
            </p>

            {isOwner && (
              <div className="pt-2 flex justify-end gap-2 text-xs font-mono">
                {onEditReview && (
                  <button
                    onClick={() => onEditReview(rev)}
                    className="flex items-center gap-1 text-[#1F3D2B] hover:underline"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                {onDeleteReview && (
                  <button
                    onClick={() => onDeleteReview(rev._id || rev.id)}
                    className="flex items-center gap-1 text-red-600 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
