import { Router } from 'express';
import {
  handleChat,
  handleAnalyzeProgramme,
  handleCompareProgrammes,
  handleGenerateReport
} from './ai.controller.js';
import { aiLimiter } from '../../middleware/rateLimit.middleware.js';

const router = Router();

router.use(aiLimiter);

router.post('/chat', handleChat);
router.post('/analyze-programme', handleAnalyzeProgramme);
router.post('/compare-programmes', handleCompareProgrammes);
router.post('/generate-report', handleGenerateReport);

export default router;
