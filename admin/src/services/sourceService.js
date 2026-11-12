import api from './api.js';

export const getSources = async (params = {}) => {
  const res = await api.get('/sources', { params });
  return res;
};

export const createSource = async (data) => {
  const res = await api.post('/sources', data);
  return res.data;
};

export const updateSource = async (id, data) => {
  const res = await api.put(`/sources/${id}`, data);
  return res.data;
};

export const deleteSource = async (id) => {
  const res = await api.delete(`/sources/${id}`);
  return res.data;
};
