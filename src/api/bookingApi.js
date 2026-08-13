import axiosInstance, { clearApiCache } from './axiosInstance';

export const bookingApi = {
  createCheckoutSession: async (tourId) => {
    const res = await axiosInstance.get(`/booking/checkout-session/${tourId}`);
    return res.data; // { status, order, key_id, tour }
  },

  verifyPayment: async (payload) => {
    const res = await axiosInstance.post('/booking/verify-payment', payload);
    clearApiCache(); // bookings changed, invalidate cache
    return res.data;
  },

  getMyBookings: async () => {
    const res = await axiosInstance.get('/booking/my-bookings');
    return res.data?.data?.bookings || res.data?.data?.data || res.data?.data || res.data?.bookings || [];
  },

  getCheckoutSession: async (tourId) => {
    return bookingApi.createCheckoutSession(tourId);
  },
};

