import * as programmeService from './programme.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getProgrammes = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }
    const programmes = await programmeService.getAllProgrammes(filter);
    return successResponse(res, programmes, 'Programmes retrieved');
  } catch (err) {
    next(err);
  }
};

export const getProgramme = async (req, res, next) => {
  try {
    const programme = await programmeService.getProgrammeById(req.params.id);
    if (!programme) return errorResponse(res, 'Programme not found', 404);
    return successResponse(res, programme, 'Programme details');
  } catch (err) {
    next(err);
  }
};

export const createProgramme = async (req, res, next) => {
  try {
    const programme = await programmeService.createProgramme(req.body, req.user?._id);
    return successResponse(res, programme, 'Programme created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateProgramme = async (req, res, next) => {
  try {
    const programme = await programmeService.updateProgramme(req.params.id, req.body, req.user?._id);
    return successResponse(res, programme, 'Programme updated');
  } catch (err) {
    next(err);
  }
};

export const deleteProgramme = async (req, res, next) => {
  try {
    const result = await programmeService.deleteProgramme(req.params.id, req.user?._id);
    return successResponse(res, result, result.deactivated ? 'Programme deactivated (fee records exist)' : 'Programme deleted');
  } catch (err) {
    next(err);
  }
};
