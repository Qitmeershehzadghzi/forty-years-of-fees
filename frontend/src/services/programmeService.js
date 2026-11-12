import api from './api.js';

export const getProgrammes = async (params = {}) => {
  const res = await api.get('/programmes', { params });
  return res.data;
};

export const getProgrammeById = async (id) => {
  const res = await api.get(`/programmes/${id}`);
  return res.data;
};
