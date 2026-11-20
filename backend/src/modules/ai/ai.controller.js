import * as aiService from './ai.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, question } = req.body;
    const q = message || question;
    if (!q) {
      return errorResponse(res, 'A prompt or question message is required', 400);
    }
    const result = await aiService.answerChatQuestion(q);
    return successResponse(res, result, 'AI response generated');
  } catch (err) {
    next(err);
  }
};

export const handleAnalyzeProgramme = async (req, res, next) => {
  try {
    const { programmeId, baseYear } = req.body;
    if (!programmeId) {
      return errorResponse(res, 'programmeId is required', 400);
    }
    const result = await aiService.analyzeProgramme(programmeId, baseYear ? Number(baseYear) : 2027);
    return successResponse(res, result, 'Programme analysis generated');
  } catch (err) {
    next(err);
  }
};

export const handleCompareProgrammes = async (req, res, next) => {
  try {
    const { programmeIds, baseYear } = req.body;
    if (!Array.isArray(programmeIds) || programmeIds.length < 2) {
      return errorResponse(res, 'programmeIds must be an array of at least 2 programme IDs', 400);
    }
    const result = await aiService.compareProgrammesAI(programmeIds, baseYear ? Number(baseYear) : 2027);
    return successResponse(res, result, 'Comparative analysis generated');
  } catch (err) {
    next(err);
  }
};

export const handleGenerateReport = async (req, res, next) => {
  try {
    const result = await aiService.generateExecutiveReport();
    return successResponse(res, result, 'Executive report generated');
  } catch (err) {
    next(err);
  }
};
