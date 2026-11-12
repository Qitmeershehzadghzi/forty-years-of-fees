import api from './api.js';

export const getInflationData = async (params = {}) => {
  const res = await api.get('/inflation', { params });
  return res.data;
};
