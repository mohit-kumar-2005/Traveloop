import express from 'express';
import {
  getTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  getPublicTripBySlug,
  duplicateTrip,
} from '../controllers/tripController.js';
import {
  addStop,
  updateStop,
  deleteStop,
  reorderStops,
  addActivityToStop,
  removeActivityFromStop,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public/:slug', getPublicTripBySlug);

router.use(protect);

router.get('/', getTrips);
router.post('/', createTrip);
router.post('/:id/duplicate', duplicateTrip);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

router.post('/:id/stops', addStop);
router.put('/:id/stops/reorder', reorderStops);
router.put('/:id/stops/:stopId', updateStop);
router.delete('/:id/stops/:stopId', deleteStop);
router.post('/:id/stops/:stopId/activities', addActivityToStop);
router.delete('/:id/stops/:stopId/activities/:actId', removeActivityFromStop);

export default router;
