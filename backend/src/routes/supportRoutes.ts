import { Router } from 'express';
import {
  getSupportInfo,
  submitSupportRequest,
  reportUser,
  blockUser,
  unblockUser,
  getPublicFAQs,
  getPublicPlans,
} from '../controllers/supportController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public info
router.get('/info', getSupportInfo);
router.get('/faqs', getPublicFAQs);
router.get('/plans', getPublicPlans);
router.post('/request', submitSupportRequest);

// Safety actions
router.post('/report', authenticate, reportUser);
router.post('/block', authenticate, blockUser);
router.delete('/block/:blockedUserId', authenticate, unblockUser);

export default router;
