import { errorResponse } from '../utils/apiResponse.js';

const ROLE_HIERARCHY = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  RESEARCHER: 2,
  VIEWER: 1,
};

export const requireRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 99;

    if (userLevel < requiredLevel) {
      return errorResponse(res, `Access denied: requires at least ${minRole} privilege`, 403);
    }

    next();
  };
};
