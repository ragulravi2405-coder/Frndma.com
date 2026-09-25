import { Router } from 'express';
import { likeUser, unlikeUser, getLikesReceived } from '../controllers/likeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, likeUser);
router.delete('/:targetUserId', authenticate, unlikeUser);
router.get('/', authenticate, getLikesReceived);

export default router;
