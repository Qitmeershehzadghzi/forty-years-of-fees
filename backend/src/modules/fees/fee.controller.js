import * as feeService from './fee.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getFees = async (req, res, next) => {
  try {
    const result = await feeService.getFees(req.query);
    return successResponse(res, result.data, 'Fees retrieved', 200, result.meta);
  } catch (err) {
    next(err);
  }
};

export const getFee = async (req, res, next) => {
  try {
    const fee = await feeService.getFeeById(req.params.id);
    if (!fee) return errorResponse(res, 'Fee record not found', 404);
    return successResponse(res, fee, 'Fee record details');
  } catch (err) {
    next(err);
  }
};

export const createFee = async (req, res, next) => {
  try {
    const fee = await feeService.createFee(req.body, req.user?._id);
    return successResponse(res, fee, 'Fee record created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateFee = async (req, res, next) => {
  try {
    const fee = await feeService.updateFee(req.params.id, req.body, req.user?._id);
    return successResponse(res, fee, 'Fee record updated');
  } catch (err) {
    next(err);
  }
};

export const deleteFee = async (req, res, next) => {
  try {
    await feeService.deleteFee(req.params.id, req.user?._id);
    return successResponse(res, null, 'Fee record deleted');
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await feeService.getProgrammeHistory(req.params.programmeId, req.query);
    return successResponse(res, history, 'Programme fee history');
  } catch (err) {
    next(err);
  }
};

export const importFees = async (req, res, next) => {
  try {
    const csvContent = req.file?.buffer ? req.file.buffer.toString('utf-8') : req.body.csvData;
    if (!csvContent) {
      return errorResponse(res, 'No CSV data provided', 400);
    }
    const results = await feeService.importFeesCSV(csvContent, req.user?._id);
    return successResponse(res, results, 'CSV import processed');
  } catch (err) {
    next(err);
  }
};

export const exportFees = async (req, res, next) => {
  try {
    const csv = await feeService.exportFees(req.query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="greenwich_fees_history.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
};
