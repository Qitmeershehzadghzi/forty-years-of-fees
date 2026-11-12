import { Router } from 'express';
import { getSites, getSite, createSite, updateSite, deleteSite } from './site.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.get('/', getSites);
router.get('/:id', getSite);
router.post('/', requireAuth, requireRole('ADMIN'), createSite);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateSite);
router.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), deleteSite);

export default router;
