import { Router } from 'express';
import { getMyUnlockedContacts, checkUnlockStatus } from '../controllers/unlockController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my-unlocks', authenticate, getMyUnlockedContacts);
router.get('/status/:targetUserId', authenticate, checkUnlockStatus);

export default router;
