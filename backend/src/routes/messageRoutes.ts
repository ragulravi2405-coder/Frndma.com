import { Router } from 'express';
import { getMessagesByMatch, sendMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:matchId', authenticate, getMessagesByMatch);
router.post('/', authenticate, sendMessage);

export default router;
