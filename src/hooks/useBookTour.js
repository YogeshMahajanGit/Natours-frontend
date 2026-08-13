import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';

export function useBookTour() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const bookTour = async (tour) => {
    setError(null);

    const tourId = tour._id || tour.id;

    if (!user) {
      navigate('/login', { state: { from: `/tours/${tourId}` } });
      return;
    }

    setLoading(true);
    try {
      const { order, key_id } = await bookingApi.createCheckoutSession(tourId);

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Natours',
        description: `Booking: ${tour.name}`,
        order_id: order.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#1F3D2B' },
        handler: async (response) => {
          try {
            await bookingApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tourId: tourId,
            });
            navigate('/my-bookings', { state: { justBooked: true } });
          } catch (err) {
            setError(
              'Payment succeeded but booking confirmation failed. Please contact support with your payment ID: ' +
                response.razorpay_payment_id
            );
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false); // user closed the modal without paying — not an error
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error?.description || 'Payment failed'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start checkout. Please try again.');
      setLoading(false);
    }
  };

  return { bookTour, loading, error };
}

export default useBookTour;
