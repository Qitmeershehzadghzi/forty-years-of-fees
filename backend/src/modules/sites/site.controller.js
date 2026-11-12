import * as siteService from './site.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getSites = async (req, res, next) => {
  try {
    const sites = await siteService.getAllSites();
    return successResponse(res, sites, 'Sites retrieved');
  } catch (err) {
    next(err);
  }
};

export const getSite = async (req, res, next) => {
  try {
    const site = await siteService.getSiteById(req.params.id);
    if (!site) return errorResponse(res, 'Site not found', 404);
    return successResponse(res, site, 'Site details');
  } catch (err) {
    next(err);
  }
};

export const createSite = async (req, res, next) => {
  try {
    const site = await siteService.createSite(req.body, req.user?._id);
    return successResponse(res, site, 'Site created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateSite = async (req, res, next) => {
  try {
    const site = await siteService.updateSite(req.params.id, req.body, req.user?._id);
    return successResponse(res, site, 'Site updated');
  } catch (err) {
    next(err);
  }
};

export const deleteSite = async (req, res, next) => {
  try {
    await siteService.deleteSite(req.params.id, req.user?._id);
    return successResponse(res, null, 'Site deleted');
  } catch (err) {
    next(err);
  }
};
