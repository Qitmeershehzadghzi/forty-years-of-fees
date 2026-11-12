import api from './api.js';

export const getProgrammes = async (params = {}) => {
  const res = await api.get('/programmes', { params });
  return res.data;
};

export const createProgramme = async (data) => {
  const res = await api.post('/programmes', data);
  return res.data;
};

export const updateProgramme = async (id, data) => {
  const res = await api.put(`/programmes/${id}`, data);
  return res.data;
};

export const deleteProgramme = async (id) => {
  const res = await api.delete(`/programmes/${id}`);
  return res.data;
};
