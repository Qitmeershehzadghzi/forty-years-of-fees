import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import programmeRoutes from '../modules/programmes/programme.routes.js';
import feeRoutes from '../modules/fees/fee.routes.js';
import inflationRoutes from '../modules/inflation/inflation.routes.js';
import sourceRoutes from '../modules/sources/source.routes.js';
import analyticsRoutes from '../modules/analytics/analytics.routes.js';
import aiRoutes from '../modules/ai/ai.routes.js';
import researchRoutes from '../modules/research/research.routes.js';
import siteRoutes from '../modules/sites/site.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import auditRoutes from '../modules/audit/audit.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/programmes', programmeRoutes);
router.use('/fees', feeRoutes);
router.use('/inflation', inflationRoutes);
router.use('/sources', sourceRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/research', researchRoutes);
router.use('/sites', siteRoutes);
router.use('/users', userRoutes);
router.use('/audit', auditRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Forty Years of Fees API — Greenwich University',
    version: '1.0.0',
    initiative: 'Journey 40',
  });
});

export default router;
