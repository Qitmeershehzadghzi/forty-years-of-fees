import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from './user.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

router.get('/', requireAuth, requireRole('SUPER_ADMIN'), getUsers);
router.get('/:id', requireAuth, requireRole('SUPER_ADMIN'), getUser);
router.post('/', requireAuth, requireRole('SUPER_ADMIN'), createUser);
router.put('/:id', requireAuth, requireRole('SUPER_ADMIN'), updateUser);
router.delete('/:id', requireAuth, requireRole('SUPER_ADMIN'), deleteUser);

export default router;
