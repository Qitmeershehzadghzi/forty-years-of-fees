import * as researchService from './research.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getResearchNotes = async (req, res, next) => {
  try {
    const notes = await researchService.getResearchNotes(req.query);
    return successResponse(res, notes, 'Research notes retrieved');
  } catch (err) {
    next(err);
  }
};

export const getResearchNote = async (req, res, next) => {
  try {
    const note = await researchService.getResearchNoteById(req.params.id);
    if (!note) return errorResponse(res, 'Research note not found', 404);
    return successResponse(res, note, 'Research note details');
  } catch (err) {
    next(err);
  }
};

export const createResearchNote = async (req, res, next) => {
  try {
    const note = await researchService.createResearchNote(req.body, req.user?._id);
    return successResponse(res, note, 'Research note created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateResearchNote = async (req, res, next) => {
  try {
    const note = await researchService.updateResearchNote(req.params.id, req.body, req.user?._id);
    return successResponse(res, note, 'Research note updated');
  } catch (err) {
    next(err);
  }
};

export const deleteResearchNote = async (req, res, next) => {
  try {
    await researchService.deleteResearchNote(req.params.id, req.user?._id);
    return successResponse(res, null, 'Research note deleted');
  } catch (err) {
    next(err);
  }
};
