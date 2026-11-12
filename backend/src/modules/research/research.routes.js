import { Router } from 'express';
import {
  getResearchNotes,
  getResearchNote,
  createResearchNote,
  updateResearchNote,
  deleteResearchNote
} from './research.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.get('/', getResearchNotes);
router.get('/:id', getResearchNote);
router.post('/', requireAuth, requireRole('RESEARCHER'), createResearchNote);
router.put('/:id', requireAuth, requireRole('RESEARCHER'), updateResearchNote);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteResearchNote);

export default router;
