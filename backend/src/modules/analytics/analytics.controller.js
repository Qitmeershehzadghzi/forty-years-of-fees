import * as analyticsService from './analytics.service.js';
import { successResponse } from '../../utils/apiResponse.js';

export const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverviewStats();
    return successResponse(res, data, 'Analytics overview retrieved');
  } catch (err) {
    next(err);
  }
};

export const getNominalFees = async (req, res, next) => {
  try {
    const data = await analyticsService.getNominalFeesData(req.query);
    return successResponse(res, data, 'Nominal fees series retrieved');
  } catch (err) {
    next(err);
  }
};

export const getRealFees = async (req, res, next) => {
  try {
    const data = await analyticsService.getRealFeesData(req.query);
    return successResponse(res, data, 'Real fees comparison retrieved');
  } catch (err) {
    next(err);
  }
};

export const getProgrammeComparison = async (req, res, next) => {
  try {
    const data = await analyticsService.getProgrammeComparisonData(req.query);
    return successResponse(res, data, 'Programme comparison retrieved');
  } catch (err) {
    next(err);
  }
};

export const getInflationTrends = async (req, res, next) => {
  try {
    const data = await analyticsService.getInflationTrendsData(req.query);
    return successResponse(res, data, 'Inflation trends retrieved');
  } catch (err) {
    next(err);
  }
};

export const getFeeGrowth = async (req, res, next) => {
  try {
    const data = await analyticsService.getFeeGrowthData(req.query);
    return successResponse(res, data, 'Fee growth rankings retrieved');
  } catch (err) {
    next(err);
  }
};

export const getDataQuality = async (req, res, next) => {
  try {
    const data = await analyticsService.getDataQualityReport();
    return successResponse(res, data, 'Data quality report retrieved');
  } catch (err) {
    next(err);
  }
};
