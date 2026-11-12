import api from './api.js';

export const getResearchNotes = async (params = {}) => {
  const res = await api.get('/research', { params });
  return res.data;
};

export const getSources = async (params = {}) => {
  const res = await api.get('/sources', { params });
  return res;
};
