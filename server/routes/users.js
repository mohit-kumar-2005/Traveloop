import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadPhoto,
  changePassword,
} from '../controllers/usersController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.put('/password', changePassword);

export default router;
