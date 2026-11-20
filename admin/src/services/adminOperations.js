import api from './api.js';

export const getAuditLogs = async (params = {}) => {
  const res = await api.get('/audit', { params });
  return res;
};

export const getAnalyticsOverview = async () => {
  const res = await api.get('/analytics/overview');
  return res.data;
};

export const getDataQuality = async () => {
  const res = await api.get('/analytics/data-quality');
  return res.data;
};

export const askAIChat = async (question) => {
  const res = await api.post('/ai/chat', { question });
  return res.data;
};

export const analyzeProgrammeAI = async (programmeId, baseYear = 2027) => {
  const res = await api.post('/ai/analyze-programme', { programmeId, baseYear });
  return res.data;
};

export const generateExecutiveReportAI = async () => {
  const res = await api.post('/ai/generate-report');
  return res.data;
};
