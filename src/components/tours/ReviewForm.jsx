import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Send, Loader2 } from 'lucide-react';
import { reviewsApi } from '../../api/reviewsApi';

const ReviewForm = ({ tourId, initialData = null, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      review: initialData?.review || '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (initialData) {
        await reviewsApi.updateReview(initialData._id || initialData.id, {
          review: data.review,
          rating,
        });
      } else {
        await reviewsApi.createReview(tourId, {
          review: data.review,
          rating,
          tour: tourId,
        });
      }

      reset();
      onSuccess?.(initialData ? 'Review updated!' : 'Review posted!');
    } catch (err) {
      console.error('Failed to submit review:', err);
      const msg = err.response?.data?.message || 'Failed to submit review. You must have booked this tour to review it.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border-2 border-dashed border-[#D6CFBE] rounded-xl p-6 shadow-sm space-y-4 my-6"
    >
      <h4 className="font-serif font-bold text-lg text-[#1F3D2B]">
        {initialData ? 'Update Your Review' : 'Write an Expedition Review'}
      </h4>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-mono text-red-700">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
          Your Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="font-mono text-sm font-bold text-[#1F3D2B] ml-2">{rating} / 5 Stars</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase text-[#8E8A7E] font-semibold mb-1">
          Your Review
        </label>
        <textarea
          rows="4"
          placeholder="Describe the trail, your guide, scenery, and overall experience..."
          {...register('review', {
            required: 'Review content is required',
            minLength: { value: 10, message: 'Review must be at least 10 characters' },
          })}
          className="w-full p-3 text-sm font-sans border border-[#D6CFBE] rounded-lg bg-[#F7F4EC]/40 focus:outline-none focus:border-[#1F3D2B]"
        />
        {errors.review && (
          <p className="text-xs font-mono text-red-600 mt-1">{errors.review.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono uppercase text-[#8E8A7E] hover:text-[#1B1B18]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#1F3D2B] text-white px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider hover:bg-[#2E5940] transition-colors disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{initialData ? 'Save Changes' : 'Post Review'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
