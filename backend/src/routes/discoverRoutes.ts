import { Router } from 'express';
import { getDiscoverProfiles } from '../controllers/discoverController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

// Allow optional or authenticated browsing
router.get('/', optionalAuthenticate, getDiscoverProfiles);

export default router;

