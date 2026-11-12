import * as inflationService from './inflation.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getInflation = async (req, res, next) => {
  try {
    const records = await inflationService.getInflationIndices(req.query);
    return successResponse(res, records, 'Inflation records retrieved');
  } catch (err) {
    next(err);
  }
};

export const getInflationById = async (req, res, next) => {
  try {
    const record = await inflationService.getInflationById(req.params.id);
    if (!record) return errorResponse(res, 'Inflation record not found', 404);
    return successResponse(res, record, 'Inflation record details');
  } catch (err) {
    next(err);
  }
};

export const createInflation = async (req, res, next) => {
  try {
    const record = await inflationService.createInflationIndex(req.body, req.user?._id);
    return successResponse(res, record, 'Inflation record created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateInflation = async (req, res, next) => {
  try {
    const record = await inflationService.updateInflationIndex(req.params.id, req.body, req.user?._id);
    return successResponse(res, record, 'Inflation record updated');
  } catch (err) {
    next(err);
  }
};

export const deleteInflation = async (req, res, next) => {
  try {
    await inflationService.deleteInflationIndex(req.params.id, req.user?._id);
    return successResponse(res, null, 'Inflation record deleted');
  } catch (err) {
    next(err);
  }
};

export const importInflation = async (req, res, next) => {
  try {
    const csvContent = req.file?.buffer ? req.file.buffer.toString('utf-8') : req.body.csvData;
    if (!csvContent) {
      return errorResponse(res, 'No CSV data provided', 400);
    }
    const results = await inflationService.importInflationCSV(csvContent, req.user?._id);
    return successResponse(res, results, 'CSV import processed');
  } catch (err) {
    next(err);
  }
};
