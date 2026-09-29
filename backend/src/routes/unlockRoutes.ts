import { Router } from 'express';
import { getMyUnlockedContacts, checkUnlockStatus } from '../controllers/unlockController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/my-unlocks', optionalAuthenticate, getMyUnlockedContacts);
router.get('/status/:targetUserId', optionalAuthenticate, checkUnlockStatus);

export default router;
