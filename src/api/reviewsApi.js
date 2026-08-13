import axiosInstance, { clearApiCache } from './axiosInstance';

export const reviewsApi = {
  createReview: async (tourId, reviewData) => {
    clearApiCache();
    try {
      const res = await axiosInstance.post(`/tours/${tourId}/reviews`, reviewData);
      return res.data;
    } catch {
      const res = await axiosInstance.post('/reviews', { ...reviewData, tour: tourId });
      return res.data;
    }
  },

  updateReview: async (id, reviewData) => {
    clearApiCache();
    const res = await axiosInstance.patch(`/reviews/${id}`, reviewData);
    return res.data;
  },

  deleteReview: async (id) => {
    clearApiCache();
    const res = await axiosInstance.delete(`/reviews/${id}`);
    return res.data;
  },
};
