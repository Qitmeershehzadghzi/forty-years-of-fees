import api from './api.js';

export const getFees = async (params = {}) => {
  const res = await api.get('/fees', { params });
  return res;
};

export const getFeeById = async (id) => {
  const res = await api.get(`/fees/${id}`);
  return res.data;
};

export const getProgrammeFeeHistory = async (programmeId, params = {}) => {
  const res = await api.get(`/fees/history/${programmeId}`, { params });
  return res.data;
};

export const exportFeesCSV = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  window.open(`${import.meta.env.VITE_API_URL || '/api'}/fees/export?${query}`, '_blank');
};
