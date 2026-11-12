import * as sourceService from './source.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getSources = async (req, res, next) => {
  try {
    const result = await sourceService.getSources(req.query);
    return successResponse(res, result.data, 'Sources retrieved', 200, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getSource = async (req, res, next) => {
  try {
    const source = await sourceService.getSourceById(req.params.id);
    if (!source) return errorResponse(res, 'Source not found', 404);
    return successResponse(res, source, 'Source details');
  } catch (err) {
    next(err);
  }
};

export const createSource = async (req, res, next) => {
  try {
    const source = await sourceService.createSource(req.body, req.user?._id);
    return successResponse(res, source, 'Source created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateSource = async (req, res, next) => {
  try {
    const source = await sourceService.updateSource(req.params.id, req.body, req.user?._id);
    return successResponse(res, source, 'Source updated');
  } catch (err) {
    next(err);
  }
};

export const deleteSource = async (req, res, next) => {
  try {
    await sourceService.deleteSource(req.params.id, req.user?._id);
    return successResponse(res, null, 'Source deleted');
  } catch (err) {
    next(err);
  }
};
