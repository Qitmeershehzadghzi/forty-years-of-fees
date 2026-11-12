import api from './api.js';

export const loginAdmin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const logoutAdmin = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('fees_admin_token');
    localStorage.removeItem('fees_admin_user');
  }
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
