import { Router } from 'express';
import multer from 'multer';
import {
  getInflation,
  getInflationById,
  createInflation,
  updateInflation,
  deleteInflation,
  importInflation
} from './inflation.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

router.get('/', getInflation);
router.get('/:id', getInflationById);
router.post('/', requireAuth, requireRole('ADMIN'), createInflation);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateInflation);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteInflation);
router.post('/import', requireAuth, requireRole('ADMIN'), upload.single('file'), importInflation);

export default router;
