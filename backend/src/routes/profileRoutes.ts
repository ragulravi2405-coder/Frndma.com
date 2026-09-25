import { Router } from 'express';
import multer from 'multer';
import {
  getMyProfile,
  updateProfile,
  getProfileByUsername,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const router = Router();

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, updateProfile);
router.get('/:username', authenticate, getProfileByUsername);
router.post('/photos', authenticate, upload.single('photo'), uploadProfilePhoto);
router.delete('/photos/:publicId', authenticate, deleteProfilePhoto);

export default router;
