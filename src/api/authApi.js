import axiosInstance from './axiosInstance';

export const authApi = {
  signup: async (userData) => {
    const res = await axiosInstance.post('/users/signup', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await axiosInstance.post('/users/login', credentials);
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await axiosInstance.post('/users/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, passwords) => {
    const res = await axiosInstance.patch(`/users/reset-password/${token}`, passwords);
    return res.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get('/users/me');
    const userData = res.data?.data?.data || res.data?.data?.user || res.data?.data;
    return userData;
  },

  updateMe: async (data) => {
    const res = await axiosInstance.patch('/users/update-me', data);
    return res.data;
  },

  updatePassword: async (passwords) => {
    const res = await axiosInstance.patch('/users/update-password', passwords);
    return res.data;
  },

  deleteMe: async () => {
    const res = await axiosInstance.delete('/users/delete-me');
    return res.data;
  },
};
