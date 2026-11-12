import api from './api.js';

export const getOverview = async () => {
  const res = await api.get('/analytics/overview');
  return res.data;
};

export const getNominalFees = async (params = {}) => {
  const res = await api.get('/analytics/nominal-fees', { params });
  return res.data;
};

export const getRealFees = async (params = {}) => {
  const res = await api.get('/analytics/real-fees', { params });
  return res.data;
};

export const getProgrammeComparison = async (params = {}) => {
  const res = await api.get('/analytics/programme-comparison', { params });
  return res.data;
};

export const getInflationTrends = async (params = {}) => {
  const res = await api.get('/analytics/inflation-trends', { params });
  return res.data;
};

export const getFeeGrowth = async (params = {}) => {
  const res = await api.get('/analytics/fee-growth', { params });
  return res.data;
};

export const getDataQuality = async () => {
  const res = await api.get('/analytics/data-quality');
  return res.data;
};
