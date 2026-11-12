import { Router } from 'express';
import multer from 'multer';
import {
  getFees,
  getFee,
  createFee,
  updateFee,
  deleteFee,
  getHistory,
  importFees,
  exportFees
} from './fee.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.get('/', getFees);
router.get('/export', exportFees);
router.get('/history/:programmeId', getHistory);
router.get('/:id', getFee);

router.post('/', requireAuth, requireRole('ADMIN'), createFee);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateFee);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteFee);
router.post('/import', requireAuth, requireRole('ADMIN'), upload.single('file'), importFees);

export default router;
