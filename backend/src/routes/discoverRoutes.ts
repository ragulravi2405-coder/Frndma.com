import { Router } from 'express';
import { getDiscoverProfiles } from '../controllers/discoverController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Allow optional or authenticated browsing
router.get('/', authenticate, getDiscoverProfiles);

export default router;
