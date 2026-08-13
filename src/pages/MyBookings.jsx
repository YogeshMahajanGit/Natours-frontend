import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { bookingApi } from '../api/bookingApi';
import TourCard from '../components/tours/TourCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { BookmarkCheck, CheckCircle2 } from 'lucide-react';

const MyBookings = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justBookedSuccess, setJustBookedSuccess] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      setError('Could not retrieve your booked expeditions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    if (location.state?.justBooked) {
      setJustBookedSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [location.state]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {justBookedSuccess && (
        <div className="p-4 bg-[#1F3D2B] text-white rounded-xl font-mono text-sm flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            🎉 Payment successful! Your expedition seat has been confirmed.
          </span>
          <button
            onClick={() => setJustBookedSuccess(false)}
            className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="border-b-2 border-dashed border-[#D6CFBE] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#A8541F] uppercase font-bold tracking-widest block mb-1">
            CONFIRMED ITINERARIES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F3D2B] flex items-center gap-3">
            <BookmarkCheck className="w-8 h-8 text-[#A8541F]" />
            My Booked Expeditions
          </h1>
        </div>
        <div className="font-mono text-xs text-[#8E8A7E] bg-white px-4 py-2 rounded-lg border border-[#D6CFBE]">
          Total Reserved Seats: <span className="font-bold text-[#1F3D2B]">{bookings.length}</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your booked trail passes..." />
      ) : error ? (
        <EmptyState
          title="Error Loading Bookings"
          description={error}
          actionText="Retry"
          onAction={fetchBookings}
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No Bookings Yet"
          description="You haven't reserved any expeditions yet. Explore our curated catalog and start your next journey!"
          actionText="Browse Expeditions"
          actionLink="/tours"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((item, idx) => {
            const tour = item.tour || item;
            return (
              <div key={item._id || item.id || idx} className="space-y-3">
                <div className="bg-[#1F3D2B] text-white p-3 rounded-t-xl flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-emerald-300 font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    Payment Confirmed
                  </span>
                  <span className="text-[#8E8A7E] text-[10px]">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active Pass'}
                  </span>
                </div>
                <TourCard tour={tour} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
