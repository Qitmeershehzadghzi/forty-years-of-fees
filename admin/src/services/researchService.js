import api from './api.js';

export const getResearchNotes = async (params = {}) => {
  const res = await api.get('/research', { params: { includeDrafts: true, ...params } });
  return res.data;
};

export const createResearchNote = async (data) => {
  const res = await api.post('/research', data);
  return res.data;
};

export const updateResearchNote = async (id, data) => {
  const res = await api.put(`/research/${id}`, data);
  return res.data;
};

export const deleteResearchNote = async (id) => {
  const res = await api.delete(`/research/${id}`);
  return res.data;
};
