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

const router = express.Router();

router.post('/login', login);

router.get('/stats', adminAuth, getStats);
router.get('/users', adminAuth, getUsers);
router.get('/users/:userId', adminAuth, getUserDetail);

router.get('/essays', adminAuth, getEssays);
router.get('/essays/:essayId', adminAuth, getEssayDetail);

router.post('/broadcast', adminAuth, broadcast);

router.put('/users/:userId/credits', adminAuth, updateUserCredits);

export default router;
