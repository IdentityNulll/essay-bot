import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
  login,
  getStats,
  getUsers,
  getUserDetail,
  getEssays,
  getEssayDetail,
  broadcast,
  updateUserCredits
} from '../controllers/adminController.js';
import {
  getOverviewCards,
  getConversionFunnel,
  getCampaignMetrics,
  getReferralAnalytics,
  getChartData,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/login', login);

router.get('/stats', adminAuth, getStats);
router.get('/users', adminAuth, getUsers);
router.get('/users/:userId', adminAuth, getUserDetail);

router.get('/essays', adminAuth, getEssays);
router.get('/essays/:essayId', adminAuth, getEssayDetail);

router.post('/broadcast', adminAuth, broadcast);

router.put('/users/:userId/credits', adminAuth, updateUserCredits);

// Marketing Analytics Endpoints
router.get('/marketing/overview', adminAuth, getOverviewCards);
router.get('/marketing/funnel', adminAuth, getConversionFunnel);
router.get('/marketing/campaigns-metrics', adminAuth, getCampaignMetrics);
router.get('/marketing/referrals', adminAuth, getReferralAnalytics);
router.get('/marketing/charts', adminAuth, getChartData);

// Campaign Management Endpoints
router.get('/marketing/campaigns', adminAuth, getCampaigns);
router.post('/marketing/campaigns', adminAuth, createCampaign);
router.put('/marketing/campaigns/:campaignId', adminAuth, updateCampaign);
router.delete('/marketing/campaigns/:campaignId', adminAuth, deleteCampaign);

export default router;
