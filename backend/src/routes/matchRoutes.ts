import { Router } from 'express';
import { getMyMatches, getMatchById } from '../controllers/matchController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getMyMatches);
router.get('/:matchId', authenticate, getMatchById);

export default router;
