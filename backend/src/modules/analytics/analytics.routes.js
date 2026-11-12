import { Router } from 'express';
import {
  getOverview,
  getNominalFees,
  getRealFees,
  getProgrammeComparison,
  getInflationTrends,
  getFeeGrowth,
  getDataQuality
} from './analytics.controller.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/nominal-fees', getNominalFees);
router.get('/real-fees', getRealFees);
router.get('/programme-comparison', getProgrammeComparison);
router.get('/inflation-trends', getInflationTrends);
router.get('/fee-growth', getFeeGrowth);
router.get('/data-quality', getDataQuality);

export default router;
