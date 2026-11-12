import { Router } from 'express';
import { getSources, getSource, createSource, updateSource, deleteSource } from './source.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.get('/', getSources);
router.get('/:id', getSource);
router.post('/', requireAuth, requireRole('ADMIN'), createSource);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateSource);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteSource);

export default router;
