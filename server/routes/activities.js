import express from 'express';
import { listActivities, getActivityById } from '../controllers/activityController.js';

const router = express.Router();

router.get('/', listActivities);
router.get('/:id', getActivityById);

export default router;
