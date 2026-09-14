import axiosClient from './axiosClient';

export const userApi = {
  getUsers: (params = {}) => {
    return axiosClient.get('/api/v1/admin/users', { params });
  },

  createUser: (userData) => {
    return axiosClient.post('/api/v1/admin/users', userData);
  },

  updateUserStatus: (id, isActive) => {
    return axiosClient.patch(`/api/v1/admin/users/${id}/status`, { isActive });
  },

  getUserById: (id) => {
    return axiosClient.get(`/api/v1/admin/users/${id}`);
  },
};
