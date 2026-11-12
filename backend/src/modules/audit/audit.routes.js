import { Router } from 'express';
import { AuditLog } from './audit.model.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { successResponse } from '../../utils/apiResponse.js';
import { getPagination, formatPaginationMeta } from '../../utils/pagination.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 25);
    const filter = {};

    if (req.query.action) filter.action = req.query.action;
    if (req.query.entity) filter.entity = req.query.entity;

    const [data, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('performedBy', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    return successResponse(res, data, 'Audit logs retrieved', 200, formatPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
});

export default router;
