import api from './api.js';

export const askAIChat = async (question) => {
  const res = await api.post('/ai/chat', { question });
  return res.data;
};

export const analyzeProgrammeAI = async (programmeId, baseYear = 2027) => {
  const res = await api.post('/ai/analyze-programme', { programmeId, baseYear });
  return res.data;
};

export const compareProgrammesAI = async (programmeIds, baseYear = 2027) => {
  const res = await api.post('/ai/compare-programmes', { programmeIds, baseYear });
  return res.data;
};

export const generateExecutiveReportAI = async () => {
  const res = await api.post('/ai/generate-report');
  return res.data;
};
