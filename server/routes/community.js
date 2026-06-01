import express from 'express';
import {
  listPublicTrips,
  likeTrip,
  saveTripBookmark,
} from '../controllers/communityController.js';

const router = express.Router();

router.get('/', listPublicTrips);
router.post('/:id/like', likeTrip);
router.post('/:id/save', saveTripBookmark);

export default router;
