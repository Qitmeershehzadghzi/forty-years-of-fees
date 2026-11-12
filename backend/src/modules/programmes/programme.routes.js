import { Router } from 'express';
import { getProgrammes, getProgramme, createProgramme, updateProgramme, deleteProgramme } from './programme.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.get('/', getProgrammes);
router.get('/:id', getProgramme);
router.post('/', requireAuth, requireRole('ADMIN'), createProgramme);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateProgramme);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProgramme);

export default router;
