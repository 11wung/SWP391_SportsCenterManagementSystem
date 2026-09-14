import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => {
    return axiosClient.post('/api/v1/auth/login', credentials);
  },

  register: (userData) => {
    return axiosClient.post('/api/v1/auth/register', userData);
  },

  getMe: () => {
    return axiosClient.get('/api/v1/auth/me');
  },
};
