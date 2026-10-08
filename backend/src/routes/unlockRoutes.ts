import { Router } from 'express';
import {
  getMyUnlockedContacts,
  checkUnlockStatus,
  getMyCredits,
  useCreditToUnlock,
} from '../controllers/unlockController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/my-unlocks', optionalAuthenticate, getMyUnlockedContacts);
router.get('/my-credits', optionalAuthenticate, getMyCredits);
router.post('/use-credit', authenticate, useCreditToUnlock);
router.get('/status/:targetUserId', optionalAuthenticate, checkUnlockStatus);

export default router;

