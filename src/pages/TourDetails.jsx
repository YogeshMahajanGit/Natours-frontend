import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Calendar,
  Flag,
  User,
  Star,
  Clock,
  Shield,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
} from 'lucide-react';

import { toursApi } from '../api/toursApi';
import { bookingApi } from '../api/bookingApi';
import { reviewsApi } from '../api/reviewsApi';
import { useAuth } from '../hooks/useAuth';
import { useBookTour } from '../hooks/useBookTour';
import { ENV } from '../config/env';
import PassportStamp from '../components/tours/PassportStamp';
import { getTourImage } from '../components/tours/TourCard';
import TourMap from '../components/tours/TourMap';
import ReviewList from '../components/tours/ReviewList';
import ReviewForm from '../components/tours/ReviewForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ToastNotification from '../components/common/ToastNotification';

const TOUR_IMAGES = {
  'the-sea-explorer': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-park-camper': [
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-city-wanderer': [
    'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-sports-lover': [
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-star-gazer': [
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-northern-lights': [
    'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-forest-hiker': [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-snow-adventurer': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1000&q=80',
  ],
  'the-wine-taster': [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1528823872057-9c018a7a7063?auto=format&fit=crop&w=1000&q=80',
  ],
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: null, type: 'info' });
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { bookTour, loading: booking, error: bookingError } = useBookTour();

  const fetchTourData = async () => {
    setLoading(true);
    try {
      const tourData = await toursApi.getTour(id);
      setTour(tourData);

      try {
        const reviewsData = await toursApi.getTourReviews(tourData._id || tourData.id || id);
        setReviews(reviewsData);
      } catch (revErr) {
        console.warn('Could not fetch reviews:', revErr);
        setReviews(tourData.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load tour details:', err);
      setToast({
        message: 'Failed to load tour details. Please return to catalog.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourData();
  }, [id]);



  const handleReviewSuccess = (msg) => {
    setToast({ message: msg, type: 'success' });
    setShowReviewForm(false);
    setEditingReview(null);
    fetchTourData();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Preparing expedition map and details..." />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#1F3D2B] font-bold">Expedition Not Found</h2>
        <p className="text-sm font-mono text-[#8E8A7E]">The requested tour could not be loaded or does not exist.</p>
        <button
          onClick={() => navigate('/tours')}
          className="px-6 py-2.5 bg-[#1F3D2B] text-white font-mono text-xs uppercase rounded-lg shadow"
        >
          Return to All Tours
        </button>
      </div>
    );
  }

  const primaryImage = getTourImage(tour);
  const images = TOUR_IMAGES[tour.slug] || [
    primaryImage,
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
  ];

  const startDateFormatted = tour.startDates?.[0]
    ? new Date(tour.startDates[0]).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Upcoming Season';

  return (
    <div className="space-y-12 pb-16">
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'info' })}
      />

      {/* Hero Header */}
      <section className="relative h-[65vh] bg-[#1F3D2B] text-white flex items-center justify-center overflow-hidden">
        <img
          src={images[0]}
          alt={tour.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B] via-[#1F3D2B]/40 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-4">
          <PassportStamp duration={tour.duration} difficulty={tour.difficulty} className="mb-2" />
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight drop-shadow-lg text-[#F7F4EC]">
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-amber-200 uppercase tracking-widest pt-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#A8541F]" />
              {tour.duration} Days
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#A8541F]" />
              {tour.startLocation?.description || 'Wilderness Trail'}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Facts Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ticket-stub rounded-xl p-6 bg-white grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#D6CFBE]">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-[#8E8A7E] uppercase block">NEXT START DATE</span>
            <span className="font-serif font-bold text-lg text-[#1F3D2B]">{startDateFormatted}</span>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-[11px] font-mono text-[#8E8A7E] uppercase block">DIFFICULTY</span>
            <span className="font-serif font-bold text-lg text-[#A8541F] capitalize">{tour.difficulty}</span>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-[11px] font-mono text-[#8E8A7E] uppercase block">MAX GROUP SIZE</span>
            <span className="font-serif font-bold text-lg text-[#1F3D2B]">{tour.maxGroupSize} People</span>
          </div>
          <div className="space-y-1 pt-4 md:pt-0">
            <span className="text-[11px] font-mono text-[#8E8A7E] uppercase block">RATING</span>
            <span className="font-serif font-bold text-lg text-amber-600 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {tour.ratingsAverage} / 5 ({tour.ratingsQuantity})
            </span>
          </div>
        </div>
      </section>

      {/* Main Details & Guides Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Description & Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#1F3D2B] mb-4">About {tour.name}</h2>
            <p className="text-base text-[#1B1B18]/80 leading-relaxed space-y-4 whitespace-pre-line">
              {tour.description || tour.summary}
            </p>
          </div>

          {/* Interactive Expedition Route Map */}
          {tour.locations && tour.locations.length > 0 && (
            <div className="pt-4 border-t border-[#D6CFBE]">
              <TourMap locations={tour.locations} startLocation={tour.startLocation} />
            </div>
          )}

          {/* Image Gallery */}
          <div className="space-y-4 pt-4 border-t border-[#D6CFBE]">
            <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">Expedition Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="h-48 rounded-xl overflow-hidden shadow-sm border border-[#D6CFBE]">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Booking Card & Guides */}
        <div className="space-y-6">
          {/* Booking Ticket Stub Card */}
          <div className="ticket-stub rounded-2xl p-6 bg-white shadow-md space-y-6 sticky top-24">
            <div className="border-b border-[#F7F4EC] pb-4 text-center">
              <span className="text-xs font-mono uppercase text-[#8E8A7E]">EXPEDITION PRICING</span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="font-mono text-4xl font-bold text-[#1F3D2B]">${tour.price}</span>
                <span className="text-xs font-mono text-[#8E8A7E]">/ adventurer</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs font-mono text-[#1B1B18]/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3D2B]" />
                All meals & trail snacks included
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3D2B]" />
                Certified Wilderness Guides
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1F3D2B]" />
                Emergency evacuation insurance
              </li>
            </ul>

            <button
              onClick={() => bookTour(tour)}
              disabled={booking}
              className="w-full py-4 bg-[#A8541F] hover:bg-[#8C4318] text-white font-mono text-sm uppercase tracking-wider font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {booking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Razorpay...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Book Now — ${tour.price}</span>
                </>
              )}
            </button>

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            <p className="text-[11px] font-mono text-center text-[#8E8A7E]">
              Protected by 256-bit SSL Razorpay payment gateway
            </p>
          </div>

          {/* Guides Card */}
          {tour.guides && tour.guides.length > 0 && (
            <div className="ticket-stub rounded-xl p-5 bg-white space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#1F3D2B] border-b border-[#F7F4EC] pb-2">
                Your Expedition Guides
              </h4>
              <div className="space-y-3">
                {tour.guides.map((guide, idx) => (
                  <div key={guide._id || idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1F3D2B] text-amber-200 font-mono font-bold text-xs flex items-center justify-center overflow-hidden border border-[#A8541F]">
                      {guide.name ? guide.name.charAt(0) : 'G'}
                    </div>
                    <div>
                      <h5 className="font-serif font-bold text-sm text-[#1F3D2B]">{guide.name}</h5>
                      <span className="text-[10px] font-mono uppercase bg-[#F7F4EC] px-2 py-0.5 rounded text-[#A8541F] font-semibold">
                        {guide.role === 'lead-guide' ? 'Lead Guide' : 'Tour Guide'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#D6CFBE]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono text-[#A8541F] uppercase font-bold tracking-widest block mb-1">
              ADVENTURER FEEDBACK
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F3D2B]">
              Reviews & Experiences ({reviews.length})
            </h2>
          </div>

          {isAuthenticated && !showReviewForm && (
            <button
              onClick={() => {
                setEditingReview(null);
                setShowReviewForm(true);
              }}
              className="px-4 py-2 bg-[#1F3D2B] text-white font-mono text-xs uppercase rounded-lg hover:bg-[#2E5940] transition-colors"
            >
              Write Review
            </button>
          )}
        </div>

        {/* Review Form Drawer/Section */}
        {showReviewForm && (
          <ReviewForm
            tourId={tour._id || tour.id || id}
            initialData={editingReview}
            onSuccess={handleReviewSuccess}
            onCancel={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}
          />
        )}

        <ReviewList
          reviews={reviews}
          onEditReview={(rev) => {
            setEditingReview(rev);
            setShowReviewForm(true);
          }}
          onDeleteReview={async (revId) => {
            if (window.confirm('Are you sure you want to delete your review?')) {
              try {
                await reviewsApi.deleteReview(revId);
                handleReviewSuccess('Review deleted successfully.');
              } catch (err) {
                setToast({ message: 'Failed to delete review.', type: 'error' });
              }
            }
          }}
        />
      </section>
    </div>
  );
};

export default TourDetails;
