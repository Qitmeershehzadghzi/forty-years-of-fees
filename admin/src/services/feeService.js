import api from './api.js';

export const getFees = async (params = {}) => {
  const res = await api.get('/fees', { params });
  return res;
};

export const getFeeById = async (id) => {
  const res = await api.get(`/fees/${id}`);
  return res.data;
};

export const createFee = async (data) => {
  const res = await api.post('/fees', data);
  return res.data;
};

export const updateFee = async (id, data) => {
  const res = await api.put(`/fees/${id}`, data);
  return res.data;
};

export const deleteFee = async (id) => {
  const res = await api.delete(`/fees/${id}`);
  return res.data;
};

export const importFeesCSV = async (fileOrText) => {
  if (typeof fileOrText === 'string') {
    const res = await api.post('/fees/import', { csvData: fileOrText });
    return res.data;
  }
  const formData = new FormData();
  formData.append('file', fileOrText);
  const res = await api.post('/fees/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
