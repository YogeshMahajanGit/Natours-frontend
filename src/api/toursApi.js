import axiosInstance from './axiosInstance';

export const toursApi = {
  getAllTours: async (params = {}) => {
    const res = await axiosInstance.get('/tours', { params });
    const tours = res.data?.data?.data || res.data?.data || [];
    const results = res.data?.results || tours.length;
    return { tours, results };
  },

  getTop5Cheap: async () => {
    const res = await axiosInstance.get('/tours/top-5-cheap');
    const tours = res.data?.data?.data || res.data?.data || [];
    return tours;
  },

  getTourStats: async () => {
    const res = await axiosInstance.get('/tours/tour-stats');
    const stats = res.data?.data?.stats || res.data?.data || [];
    return Array.isArray(stats) ? stats : [];
  },

  getTour: async (id) => {
    const res = await axiosInstance.get(`/tours/${id}`);
    const tour = res.data?.data?.data || res.data?.data?.tour || res.data?.data;
    return tour;
  },

  getToursWithin: async (distance, lat, lng, unit = 'mi') => {
    const res = await axiosInstance.get(`/tours/tours-within/${distance}/center/${lat},${lng}/unit/${unit}`);
    const tours = res.data?.data?.data || [];
    return tours;
  },

  getTourReviews: async (tourId) => {
    const res = await axiosInstance.get(`/tours/${tourId}/reviews`);
    const reviews = res.data?.data?.data || res.data?.data?.reviews || res.data?.data || [];
    return reviews;
  },
};
