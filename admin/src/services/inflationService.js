import api from './api.js';

export const getInflationRecords = async (params = {}) => {
  const res = await api.get('/inflation', { params });
  return res.data;
};

export const createInflationRecord = async (data) => {
  const res = await api.post('/inflation', data);
  return res.data;
};

export const updateInflationRecord = async (id, data) => {
  const res = await api.put(`/inflation/${id}`, data);
  return res.data;
};

export const deleteInflationRecord = async (id) => {
  const res = await api.delete(`/inflation/${id}`);
  return res.data;
};

export const importInflationCSV = async (fileOrText) => {
  if (typeof fileOrText === 'string') {
    const res = await api.post('/inflation/import', { csvData: fileOrText });
    return res.data;
  }
  const formData = new FormData();
  formData.append('file', fileOrText);
  const res = await api.post('/inflation/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
