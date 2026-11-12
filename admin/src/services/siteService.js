import api from './api.js';

export const getSites = async () => {
  const res = await api.get('/sites');
  return res.data;
};

export const createSite = async (data) => {
  const res = await api.post('/sites', data);
  return res.data;
};

export const updateSite = async (id, data) => {
  const res = await api.put(`/sites/${id}`, data);
  return res.data;
};

export const deleteSite = async (id) => {
  const res = await api.delete(`/sites/${id}`);
  return res.data;
};
